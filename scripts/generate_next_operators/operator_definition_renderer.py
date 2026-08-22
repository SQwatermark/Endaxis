"""渲染完整、可注册的 Next OperatorDefinition TypeScript。"""

from __future__ import annotations

import textwrap
from collections import OrderedDict
from dataclasses import dataclass, replace
from typing import Any, Callable

from passive_skill_parser import PassiveSkillSource
from progression_renderer import render_base_passive_skills, render_potentials, render_talents
from operator_buff_linker import (
    link_operator_buff_definitions,
    render_operator_buff_definitions,
)
from operator_ability_entity_linker import (
    link_operator_ability_entity_definitions,
    render_operator_ability_entity_definitions,
)
from source_models import BuffDefinitionSource, SkillSource
from source_utils import (
    require_dict,
    require_list,
    require_non_negative_int,
    table_row,
    ts_inline_literal,
)


@dataclass(frozen=True)
class OperatorDefinitionRendererServices:
    """由入口注入技能组、养成、替换关系和项目身份规则。"""

    parse_panel_attributes: Callable[..., Any]
    typescript_identifier: Callable[..., Any]
    select_runtime_skill_slot_replacement_relations: Callable[..., Any]
    derive_skill_slot_replacement_relations: Callable[..., Any]
    compile_skill_entries: Callable[..., Any]
    validate_skill_groups: Callable[..., Any]
    render_skill_groups: Callable[..., Any]
    parse_combo_skill_registrations: Callable[..., Any]
    derive_entity_blackboard_initializers: Callable[..., Any]
    parse_trust_attribute_bonus: Callable[..., Any]
    collect_definition_helpers: Callable[..., Any]
    parse_conversion_support: Callable[..., Any]
    render_named_skills: Callable[..., Any]
    compile_progression_buff_definition: Callable[..., Any]
    compile_passive_event_listener: Callable[..., Any]
    weapon_type_map: dict[Any, str]
    element_type_map: dict[Any, str]
    profession_map: dict[Any, str]
    attribute_type_map: dict[Any, str]


def render_operator_definition(
    operator: dict[str, Any],
    skills: list[SkillSource],
    character_table: dict[str, Any],
    growth_table: dict[str, Any],
    potential_table: dict[str, Any],
    effects: dict[str, Any],
    buff_definitions: tuple[BuffDefinitionSource, ...] = (),
    passive_skills: dict[str, PassiveSkillSource] | None = None,
    entity_blackboard_initializers: list[dict[str, Any]] | None = None,
    *,
    services: OperatorDefinitionRendererServices,
    shared_buff_definitions: OrderedDict[str, str] | None = None,
    shared_ability_entity_definitions: OrderedDict[str, str] | None = None,
    simulation_no_effect_buff_ids: tuple[str, ...] | list[str] = (),
) -> str:
    parse_panel_attributes = services.parse_panel_attributes
    typescript_identifier = services.typescript_identifier
    select_runtime_skill_slot_replacement_relations = services.select_runtime_skill_slot_replacement_relations
    derive_skill_slot_replacement_relations = services.derive_skill_slot_replacement_relations
    compile_skill_entries = services.compile_skill_entries
    validate_skill_groups = services.validate_skill_groups
    render_skill_groups = services.render_skill_groups
    parse_combo_skill_registrations = services.parse_combo_skill_registrations
    derive_entity_blackboard_initializers = services.derive_entity_blackboard_initializers
    parse_trust_attribute_bonus = services.parse_trust_attribute_bonus
    collect_definition_helpers = services.collect_definition_helpers
    parse_conversion_support = services.parse_conversion_support
    render_named_skills = services.render_named_skills
    compile_progression_buff_definition = services.compile_progression_buff_definition
    compile_passive_event_listener = services.compile_passive_event_listener
    WEAPON_TYPE_MAP = services.weapon_type_map
    ELEMENT_TYPE_MAP = services.element_type_map
    PROFESSION_MAP = services.profession_map
    ATTRIBUTE_TYPE_MAP = services.attribute_type_map
    char_id = str(operator["charId"])
    character = table_row(character_table, char_id, "CharacterTable")
    growth = table_row(growth_table, char_id, "CharGrowthTable")
    attributes = parse_panel_attributes(character, f"CharacterTable.{char_id}")
    weapon_type = WEAPON_TYPE_MAP.get(character.get("weaponType"))
    element = ELEMENT_TYPE_MAP.get(character.get("charTypeId"))
    role = PROFESSION_MAP.get(character.get("profession"))
    main_attribute = ATTRIBUTE_TYPE_MAP.get(character.get("mainAttrType"))
    secondary_attribute = ATTRIBUTE_TYPE_MAP.get(character.get("subAttrType"))
    if None in {weapon_type, element, role, main_attribute, secondary_attribute}:
        raise ValueError(f"{char_id}: unsupported operator metadata enum")
    identifier = typescript_identifier(str(operator["slug"]))
    operator_export_name = f"{identifier}GeneratedOperator"
    definitions_by_id = {definition.buffId: definition for definition in buff_definitions}
    passive_skills = passive_skills or {}
    skill_slot_replacement_relations = select_runtime_skill_slot_replacement_relations(
        operator,
        skills,
        derive_skill_slot_replacement_relations(skills, buff_definitions),
    )
    # Project action-scoped replacements once at the operator boundary so the
    # exact same inline Buff definition is used by skills, talents and potentials.
    for relation in skill_slot_replacement_relations:
        base_skill = next(skill for skill in skills if skill.key == relation["baseSkillKey"])
        replacement_skill = next(
            skill for skill in skills if skill.key == relation["replacementSkillKey"]
        )
        matching_buff_ids = {
            relation["activatedByBuffId"],
            *(
                buff_id
                for buff_id, definition in definitions_by_id.items()
                if any(
                    item.eventSource == "buff"
                    and item.event == "DuringBuffEnable"
                    and item.skillSource.targetSource in {"Owner", "Source"}
                    and not item.skillSource.targetGroupKey
                    and item.targetSkillId == replacement_skill.skillId
                    and item.revertedSkillId == base_skill.skillId
                    and item.lifeTimeType == "FinishByAction"
                    for item in definition.skillReplacements
                )
            ),
        }
        for buff_id in matching_buff_ids:
            definition = definitions_by_id.get(buff_id)
            if definition is None:
                raise ValueError(
                    f"{operator['slug']}: missing lifecycle replacement Buff {buff_id!r}"
                )
            runtime_replacement = {
                "skillGroupKey": relation.get("skillGroupKey", relation["baseSkillKey"]),
                "targetSkillKey": relation["replacementSkillKey"],
                "revertedSkillKey": relation["baseSkillKey"],
                "inheritOriginSkillCooldownProgress": relation[
                    "inheritOriginSkillCooldownProgress"
                ],
            }
            definitions_by_id[buff_id] = replace(
                definition,
                skillReplacements=(),
                runtimeSkillSlotReplacements=(
                    *definition.runtimeSkillSlotReplacements,
                    runtime_replacement,
                ),
            )
    buff_definitions = tuple(definitions_by_id.values())
    skill_entries, damage_type_factories = compile_skill_entries(
        operator,
        skills,
        definitions_by_id,
        skill_slot_replacement_relations,
        simulation_no_effect_buff_ids,
    )
    validate_skill_groups(operator, skills, growth, f"CharGrowthTable.{char_id}")
    groups = render_skill_groups(operator, skills, skill_slot_replacement_relations)
    canonical_skill_identities = {
        (str(group["key"]), str(skill_key))
        for group in (
            require_dict(raw, f"{operator['slug']}.skillGroups[]")
            for raw in require_list(operator.get("skillGroups"), f"{operator['slug']}.skillGroups")
        )
        for skill_key in require_list(group.get("skillKeys"), f"{operator['slug']}.skillGroups[].skillKeys")
    }
    skill_aliases: list[dict[str, list[str]]] = []
    seen_aliases: set[tuple[str, str]] = set()
    for index, raw_alias in enumerate(
        require_list(operator.get("skillAliases", []), f"{operator['slug']}.skillAliases")
    ):
        path = f"{operator['slug']}.skillAliases[{index}]"
        alias = require_dict(raw_alias, path)
        if set(alias) != {"from", "to"}:
            raise ValueError(f"{path}: expected only from/to identities")
        source = [str(value) for value in require_list(alias.get("from"), f"{path}.from")]
        target = [str(value) for value in require_list(alias.get("to"), f"{path}.to")]
        if len(source) != 2 or len(target) != 2 or not all((*source, *target)):
            raise ValueError(f"{path}: expected two non-empty group/skill keys")
        source_identity = (source[0], source[1])
        target_identity = (target[0], target[1])
        if source_identity in seen_aliases or source_identity in canonical_skill_identities:
            raise ValueError(f"{path}.from: duplicate or canonical identity {source_identity!r}")
        if source_identity == target_identity or target_identity not in canonical_skill_identities:
            raise ValueError(f"{path}.to: expected a distinct canonical identity")
        seen_aliases.add(source_identity)
        skill_aliases.append({"from": source, "to": target})
    combo_skill_registrations = parse_combo_skill_registrations(operator, skills)
    if entity_blackboard_initializers is None:
        entity_blackboard_initializers = derive_entity_blackboard_initializers(
            passive_skills, buff_definitions
        )
    talents = render_talents(
        operator,
        skills,
        growth,
        effects,
        passive_skills,
        definitions_by_id,
        compile_progression_buff_definition,
        compile_passive_event_listener,
    )
    potentials = render_potentials(
        operator,
        skills,
        potential_table,
        effects,
        passive_skills,
        definitions_by_id,
        compile_progression_buff_definition,
    )
    base_passive_ids = [str(value) for value in operator.get("basePassiveSkillIds", [])]
    compile_time_only_base_passive_ids = {
        str(value) for value in operator.get("compileTimeOnlyBasePassiveSkillIds", [])
    }
    unknown_compile_time_ids = compile_time_only_base_passive_ids.difference(base_passive_ids)
    if unknown_compile_time_ids:
        raise ValueError(
            f"{operator['slug']}: compile-time-only base passives are not declared base passives: "
            f"{sorted(unknown_compile_time_ids)!r}"
        )
    native_level_sources = {0: "basicAttack", 1: "battleSkill", 2: "ultimate", 3: "comboSkill"}
    base_passive_level_sources: dict[str, str] = {}
    native_skill_groups = require_dict(
        growth.get("skillGroupMap"), f"CharGrowthTable.{char_id}.skillGroupMap"
    )
    for passive_id in base_passive_ids:
        matching_groups = [
            require_dict(group, f"CharGrowthTable.{char_id}.skillGroupMap[]")
            for group in native_skill_groups.values()
            if passive_id in require_list(
                require_dict(group, f"CharGrowthTable.{char_id}.skillGroupMap[]").get("skillIdList"),
                f"CharGrowthTable.{char_id}.skillGroupMap[].skillIdList",
            )
        ]
        if len(matching_groups) > 1:
            raise ValueError(
                f"{operator['slug']}.basePassiveSkillIds: ambiguous native groups for {passive_id!r}"
            )
        if not matching_groups:
            continue
        native_group_type = matching_groups[0].get("skillGroupType")
        if native_group_type not in native_level_sources:
            raise ValueError(
                f"{operator['slug']}.basePassiveSkillIds: unsupported group type "
                f"{native_group_type!r} for {passive_id!r}"
            )
        base_passive_level_sources[passive_id] = native_level_sources[native_group_type]
    base_passive_body = render_base_passive_skills(
        {
            skill_id: passive_skills[skill_id]
            for skill_id in base_passive_ids
            if skill_id not in compile_time_only_base_passive_ids
        },
        definitions_by_id,
        compile_progression_buff_definition,
        compile_passive_event_listener,
        base_passive_level_sources,
    )
    helper_imports = collect_definition_helpers(skill_entries, damage_type_factories)
    base_passive_sources = [] if base_passive_body is None else [base_passive_body]
    linked_sources, linked_ability_entity_definitions, _ = link_operator_ability_entity_definitions(
        [source for _, source in skill_entries] + base_passive_sources + talents + potentials,
        shared_ability_entity_definitions,
    )
    linked_sources, linked_buff_definitions, _ = link_operator_buff_definitions(
        linked_sources,
        shared_buff_definitions,
    )
    skill_source_count = len(skill_entries)
    base_passive_count = len(base_passive_sources)
    talent_count = len(talents)
    skill_entries = [
        (skill, linked_sources[index])
        for index, (skill, _) in enumerate(skill_entries)
    ]
    if base_passive_count:
        base_passive_body = linked_sources[skill_source_count]
    talents = linked_sources[
        skill_source_count + base_passive_count : skill_source_count + base_passive_count + talent_count
    ]
    potentials = linked_sources[skill_source_count + base_passive_count + talent_count :]
    operator_buff_definition_lines = render_operator_buff_definitions(
        linked_buff_definitions
    )
    operator_ability_entity_definition_lines = render_operator_ability_entity_definitions(
        linked_ability_entity_definitions
    )
    trust_attribute_bonus = parse_trust_attribute_bonus(
        growth,
        main_attribute,
        f"CharGrowthTable.{char_id}",
    )
    attribute_lines = [f"    {key}: {ts_inline_literal(value)}," for key, value in attributes.items()]
    conversion_support = parse_conversion_support(
        operator, (skill for skill, _ in skill_entries)
    )
    return "\n".join(
        [
            "/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */",
            "import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';",
            f"import {{ {helper_imports} }} from '../definitionHelpers';",
            "",
            "// prettier-ignore",
            *render_named_skills(operator, skill_entries),
            f"export const {operator_export_name}: OperatorDefinition = {{",
            f"  slug: {ts_inline_literal(operator['slug'])},",
            f"  gameId: {ts_inline_literal(str(character['engName']).upper())},",
            f"  rarity: {require_non_negative_int(character.get('rarity'), f'{char_id}.rarity')},",
            f"  weaponType: {ts_inline_literal(weapon_type)},",
            f"  element: {ts_inline_literal(element)},",
            f"  role: {ts_inline_literal(role)},",
            f"  mainAttribute: {ts_inline_literal(main_attribute)},",
            f"  secondaryAttribute: {ts_inline_literal(secondary_attribute)},",
            "  attributes: {",
            *attribute_lines,
            "  },",
            *(
                [f"  trustAttributeBonus: {ts_inline_literal(trust_attribute_bonus)},"]
                if trust_attribute_bonus is not None
                else []
            ),
            "  skillGroups: [",
            *(f"    {group}," for group in groups),
            "  ],",
            *(
                [f"  skillAliases: {ts_inline_literal(skill_aliases)},"]
                if skill_aliases
                else []
            ),
            *operator_buff_definition_lines,
            *operator_ability_entity_definition_lines,
            *(
                [
                    "  comboSkillRegistrations: "
                    f"{ts_inline_literal(combo_skill_registrations)},"
                ]
                if combo_skill_registrations is not None
                else []
            ),
            *(
                [
                    "  entityBlackboardInitializers: "
                    f"{ts_inline_literal(entity_blackboard_initializers)},"
                ]
                if entity_blackboard_initializers
                else []
            ),
            *([] if base_passive_body is None else base_passive_body.splitlines()),
            "  talents: [",
            *(textwrap.indent(talent, "    ") + "," for talent in talents),
            "  ],",
            "  potentials: [",
            *(textwrap.indent(potential, "    ") + "," for potential in potentials),
            "  ],",
            f"  conversionSupport: {ts_inline_literal(conversion_support)},",
            "};",
            "",
        ]
    )
