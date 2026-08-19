"""渲染完整、可注册的 Next OperatorDefinition TypeScript。"""

from __future__ import annotations

import textwrap
from dataclasses import dataclass
from typing import Any, Callable

from passive_skill_parser import PassiveSkillSource
from progression_renderer import render_potentials, render_talents
from source_models import BuffDefinitionSource, SkillSource
from source_utils import require_non_negative_int, table_row, ts_inline_literal


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
    skill_entries, damage_type_factories = compile_skill_entries(
        operator,
        skills,
        definitions_by_id,
        skill_slot_replacement_relations,
    )
    validate_skill_groups(operator, skills, growth, f"CharGrowthTable.{char_id}")
    groups = render_skill_groups(operator, skills, skill_slot_replacement_relations)
    combo_skill_registrations = parse_combo_skill_registrations(operator, skills)
    if entity_blackboard_initializers is None:
        entity_blackboard_initializers = derive_entity_blackboard_initializers(
            passive_skills, buff_definitions
        )
    talents = render_talents(
        operator, skills, growth, effects, passive_skills, definitions_by_id
    )
    potentials = render_potentials(
        operator,
        skills,
        potential_table,
        effects,
        passive_skills,
        definitions_by_id,
    )
    trust_attribute_bonus = parse_trust_attribute_bonus(
        growth,
        main_attribute,
        f"CharGrowthTable.{char_id}",
    )
    attribute_lines = [f"    {key}: {ts_inline_literal(value)}," for key, value in attributes.items()]
    helper_imports = collect_definition_helpers(skill_entries, damage_type_factories)
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
