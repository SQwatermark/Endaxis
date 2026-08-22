"""执行 manifest 驱动的全量/定向生成、阶段分流与原子文件输出。"""

from __future__ import annotations

import json
from collections import OrderedDict
from dataclasses import dataclass, replace
from typing import Any, Callable

from source_utils import require_dict, require_list, table_row


def validate_routed_skills(
    operator: dict[str, Any], skills: list[Any], skill_source_dir: Any
) -> None:
    """严格验证 SwitchToAddBuff 包装器到真实 CastSkill 执行体的旁路证据。"""
    slug = str(operator["slug"])
    routed_keys = [
        str(value)
        for value in require_list(operator.get("routedSkillKeys", []), f"{slug}.routedSkillKeys")
    ]
    if len(routed_keys) != len(set(routed_keys)):
        raise ValueError(f"{slug}.routedSkillKeys: duplicate key")
    entries = {
        str(entry["key"]): require_dict(entry, f"{slug}.skills[]")
        for entry in require_list(operator.get("skills"), f"{slug}.skills")
    }
    skills_by_key = {skill.key: skill for skill in skills}
    for key in routed_keys:
        path = f"{slug}.skills.{key}.compile"
        entry = entries.get(key)
        skill = skills_by_key.get(key)
        if entry is None or skill is None:
            raise ValueError(f"{slug}.routedSkillKeys: unknown key {key!r}")
        config = require_dict(entry.get("compile"), path)
        if config.get("kind") != "routedSkill":
            raise ValueError(f"{path}.kind: expected 'routedSkill'")
        target_key = str(config.get("targetSkillKey", ""))
        target = skills_by_key.get(target_key)
        if target is None:
            raise ValueError(f"{path}.targetSkillKey: unknown skill {target_key!r}")
        if config.get("executionSkillType") != target.skillType:
            raise ValueError(
                f"{path}.executionSkillType: expected target type {target.skillType!r}"
            )
        level_source = config.get("executionLevelSource")
        if level_source not in {"basicAttack", "battleSkill", "comboSkill", "ultimate"}:
            raise ValueError(f"{path}.executionLevelSource: invalid level source")
        target_groups = [
            require_dict(group, f"{slug}.skillGroups[]")
            for group in require_list(operator.get("skillGroups"), f"{slug}.skillGroups")
            if target_key
            in require_list(
                require_dict(group, f"{slug}.skillGroups[]").get("skillKeys"),
                f"{slug}.skillGroups[].skillKeys",
            )
        ]
        if len(target_groups) != 1:
            raise ValueError(f"{path}.targetSkillKey: target must belong to exactly one group")
        if target_groups[0].get("levelSource") != level_source:
            raise ValueError(f"{path}.executionLevelSource: does not match target group")
        activation_buff_id = str(config.get("activationBuffId", ""))
        routing_buff_id = str(config.get("routingBuffId", ""))
        if not activation_buff_id or not routing_buff_id:
            raise ValueError(f"{path}: activationBuffId and routingBuffId are required")

        raw = require_dict(
            json.loads((skill_source_dir / skill.sourceFile).read_text(encoding="utf-8")),
            skill.sourceFile,
        )
        switch = require_dict(raw.get("switchToBuffConfig"), f"{skill.sourceFile}.switchToBuffConfig")
        condition = require_dict(switch.get("condition"), f"{skill.sourceFile}.switchToBuffConfig.condition")
        condition_actions = require_list(condition.get("actionData"), f"{skill.sourceFile}.switchToBuffConfig.condition.actionData")
        if len(condition_actions) != 1:
            raise ValueError(f"{path}: expected exactly one routing condition")
        condition_action = require_dict(condition_actions[0], f"{path}.condition")
        if "CheckBuffStackNumAdvanced" not in str(condition_action.get("$type")):
            raise ValueError(f"{path}: routing condition must be CheckBuffStackNumAdvanced")
        settings = require_dict(condition_action.get("buffSettings"), f"{path}.condition.buffSettings")
        if settings.get("checkType") != "Id" or require_list(settings.get("buffIdList"), f"{path}.condition.buffIdList") != [activation_buff_id]:
            raise ValueError(f"{path}: routing condition must check only {activation_buff_id!r}")
        value = require_dict(condition_action.get("value"), f"{path}.condition.value")
        if condition_action.get("compareType") != "GE" or value.get("useBlackboardKey") is not False or value.get("value") != 1.0:
            raise ValueError(f"{path}: routing condition must require at least one Buff stack")
        buffs = require_list(switch.get("buffs"), f"{path}.buffs")
        if len(buffs) != 1 or require_dict(buffs[0], f"{path}.buffs[0]").get("buffId") != routing_buff_id:
            raise ValueError(f"{path}: expected exactly routing Buff {routing_buff_id!r}")
        for selector_name in ("buffSource", "targets"):
            selector = require_dict(switch.get(selector_name), f"{path}.{selector_name}")
            if selector.get("targetSource") != "Owner":
                raise ValueError(f"{path}.{selector_name}: expected Owner")
        if switch.get("asSkillCast") is not False:
            raise ValueError(f"{path}.asSkillCast: expected false")

        buff_path = skill_source_dir.parent / "BuffData" / f"{routing_buff_id}.json"
        buff = require_dict(json.loads(buff_path.read_text(encoding="utf-8")), str(buff_path))
        events = require_list(buff.get("buffEventAction"), f"{routing_buff_id}.buffEventAction")
        if len(events) != 1 or require_dict(events[0], f"{routing_buff_id}.event").get("buffEvent") != "OnBuffEnable":
            raise ValueError(f"{path}: routing Buff must only act on OnBuffEnable")
        actions = require_list(require_dict(events[0], f"{routing_buff_id}.event").get("actions"), f"{routing_buff_id}.actions")
        if len(actions) != 1:
            raise ValueError(f"{path}: routing Buff must contain one action group")
        cast_actions = require_list(require_dict(actions[0], f"{routing_buff_id}.actions[0]").get("actionData"), f"{routing_buff_id}.actionData")
        if len(cast_actions) != 1:
            raise ValueError(f"{path}: routing Buff must contain one CastSkill action")
        cast = require_dict(cast_actions[0], f"{routing_buff_id}.cast")
        if "CastSkill+Data" not in str(cast.get("$type")):
            raise ValueError(f"{path}: routing Buff action must be CastSkill")
        skill_id = require_dict(cast.get("skillId"), f"{routing_buff_id}.cast.skillId")
        if skill_id.get("useBlackboardKey") is not False or skill_id.get("value") != target.skillId:
            raise ValueError(f"{path}: routing Buff must cast {target.skillId!r}")
        if require_dict(cast.get("caster"), f"{path}.caster").get("targetSource") != "Owner":
            raise ValueError(f"{path}: routed caster must be Owner")
        if require_dict(cast.get("target"), f"{path}.target").get("targetSource") != "MainTarget":
            raise ValueError(f"{path}: routed target must be MainTarget")
        if cast.get("skipApplyCost") is not False or cast.get("inheritSourceSkillCastId") is not False:
            raise ValueError(f"{path}: unsupported routed CastSkill flags")

        combat_fields = (
            "directDamageHits", "conditionalActions", "inflictions", "auxiliaryActions",
            "blackboardCalculations", "blackboardMutations", "buffBlackboardReads",
            "buffFinishes", "buffHolds", "targetGroupControlFlowActions", "auraActions",
            "physicalInflictions", "resourceGains", "projectileLaunches",
            "projectileTriggeredSkills", "abilityEntityHits", "eventListeners",
            "timeDilations", "keywordActions", "skillReplacements", "intervalDamageHits",
            "timelineJumps", "timelineJumpControlFlowActions", "timelineFinishes",
        )
        nonempty = [field for field in combat_fields if getattr(skill, field)]
        if nonempty:
            raise ValueError(f"{path}: input wrapper unexpectedly has combat behavior {nonempty}")


def filter_presentation_only_passive_buffs(
    operator: dict[str, Any], passive_skills: dict[str, Any]
) -> dict[str, Any]:
    """按 manifest 的显式证据移除隐藏被动仅用于表现的启动 Buff。"""
    path = f"{operator['slug']}.presentationOnlyPassiveBuffIds"
    ignored = tuple(
        str(value)
        for value in require_list(operator.get("presentationOnlyPassiveBuffIds", []), path)
    )
    if len(ignored) != len(set(ignored)):
        raise ValueError(f"{path}: duplicate Buff id")
    referenced = {
        buff.buff_id for passive in passive_skills.values() for buff in passive.buffs
    }
    unknown = sorted(set(ignored).difference(referenced))
    if unknown:
        raise ValueError(f"{path}: Buff ids are not passive startup Buffs: {unknown}")
    ignored_set = set(ignored)
    return {
        skill_id: replace(
            passive,
            buffs=tuple(buff for buff in passive.buffs if buff.buff_id not in ignored_set),
        )
        for skill_id, passive in passive_skills.items()
    }


def mark_explicit_unmodeled_passive_skills(
    operator: dict[str, Any],
    passive_skills: dict[str, Any],
    issues: dict[str, tuple[str, ...]],
) -> dict[str, tuple[str, ...]]:
    """把已知不能完整投影的隐藏被动留在审计层，不输出残缺行为。"""
    path = f"{operator['slug']}.unmodeledPassiveSkillIds"
    unmodeled = tuple(
        str(value)
        for value in require_list(operator.get("unmodeledPassiveSkillIds", []), path)
    )
    if len(unmodeled) != len(set(unmodeled)):
        raise ValueError(f"{path}: duplicate passive skill id")
    unknown = sorted(set(unmodeled).difference(passive_skills))
    if unknown:
        raise ValueError(f"{path}: unknown passive skill ids: {unknown}")
    result = dict(issues)
    for skill_id in unmodeled:
        result[skill_id] = tuple(
            dict.fromkeys(
                (
                    *result.get(skill_id, ()),
                    "manifest explicitly keeps this passive skill unmodeled",
                )
            )
        )
    return result


@dataclass(frozen=True)
class GenerationPipelineServices:
    """由兼容入口注入解析、编译、审计与文件操作。"""

    audit_passive_skill_generation: Callable[..., Any]
    collect_operator_passive_skills: Callable[..., Any]
    derive_entity_blackboard_initializers: Callable[..., Any]
    derive_skill_slot_replacement_relations: Callable[..., Any]
    parse_args: Callable[..., Any]
    parse_base_passive_skill_ids: Callable[..., Any]
    parse_skill: Callable[..., Any]
    remove_obsolete_generated_file: Callable[..., Any]
    render_compiled_skills: Callable[..., Any]
    render_operator_definition: Callable[..., Any]
    is_strictly_presentation_only_buff: Callable[..., Any]
    render_report: Callable[..., Any]
    render_shared_buff_definitions_module: Callable[..., Any]
    render_shared_ability_entity_definitions_module: Callable[..., Any]
    render_typescript: Callable[..., Any]
    resolve_operator_buff_definitions_for_stage: Callable[..., Any]
    resolve_passive_buff_definitions: Callable[..., Any]
    resolve_progression_buff_definitions: Callable[..., Any]
    write_or_check: Callable[..., Any]


def retain_reachable_buff_definitions(
    root_ids: set[str], definitions: tuple[Any, ...]
) -> tuple[Any, ...]:
    """只保留从已启用根 Buff 可达的递归定义。

    `resolve_buff_definitions` 会递归解析 CreateBuffAction 依赖；渲染阶段也必须
    保留同一闭包，不能在被动审计通过后又把子定义裁掉。
    """

    definitions_by_id = {definition.buffId: definition for definition in definitions}
    reachable: set[str] = set()
    pending = list(root_ids)
    while pending:
        buff_id = pending.pop()
        if buff_id in reachable:
            continue
        reachable.add(buff_id)
        definition = definitions_by_id.get(buff_id)
        if definition is None:
            continue
        pending.extend(
            child_id
            for event in (
                *getattr(definition, "eventActions", ()),
                *getattr(definition, "igniteEventActions", ()),
            )
            for child_id in getattr(event, "createdBuffIds", ())
            if child_id not in reachable
        )
    return tuple(
        definitions_by_id[buff_id]
        for buff_id in sorted(reachable)
        if buff_id in definitions_by_id
    )


def run_generation(*, services: GenerationPipelineServices) -> None:
    audit_passive_skill_generation = services.audit_passive_skill_generation
    collect_operator_passive_skills = services.collect_operator_passive_skills
    derive_entity_blackboard_initializers = services.derive_entity_blackboard_initializers
    derive_skill_slot_replacement_relations = services.derive_skill_slot_replacement_relations
    parse_args = services.parse_args
    parse_base_passive_skill_ids = services.parse_base_passive_skill_ids
    parse_skill = services.parse_skill
    remove_obsolete_generated_file = services.remove_obsolete_generated_file
    render_compiled_skills = services.render_compiled_skills
    render_operator_definition = services.render_operator_definition
    is_strictly_presentation_only_buff = services.is_strictly_presentation_only_buff
    render_report = services.render_report
    render_shared_buff_definitions_module = services.render_shared_buff_definitions_module
    render_shared_ability_entity_definitions_module = services.render_shared_ability_entity_definitions_module
    render_typescript = services.render_typescript
    resolve_operator_buff_definitions_for_stage = services.resolve_operator_buff_definitions_for_stage
    resolve_passive_buff_definitions = services.resolve_passive_buff_definitions
    resolve_progression_buff_definitions = services.resolve_progression_buff_definitions
    write_or_check = services.write_or_check
    args = parse_args()
    manifest = require_dict(json.loads(args.manifest.read_text(encoding="utf-8")), str(args.manifest))
    global_simulation_no_effect_buff_ids = tuple(
        str(value)
        for value in require_list(
            manifest.get("simulationNoEffectBuffIds", []),
            "simulationNoEffectBuffIds",
        )
    )
    if len(global_simulation_no_effect_buff_ids) != len(
        set(global_simulation_no_effect_buff_ids)
    ):
        raise ValueError("simulationNoEffectBuffIds: duplicate Buff id")
    invalid_global_ignores = sorted(
        buff_id
        for buff_id in global_simulation_no_effect_buff_ids
        if buff_id.startswith("buff_chr_")
    )
    if invalid_global_ignores:
        raise ValueError(
            "simulationNoEffectBuffIds: character Buffs belong in an operator config: "
            f"{invalid_global_ignores}"
        )
    shared_buff_definitions: OrderedDict[str, str] = OrderedDict()
    shared_ability_entity_definitions: OrderedDict[str, str] = OrderedDict()
    patch_path = args.tables / "SkillPatchTable.json"
    patch_table = require_dict(json.loads(patch_path.read_text(encoding="utf-8")), str(patch_path))
    table_names = (
        "CharacterTable.json",
        "CharGrowthTable.json",
        "CharacterPotentialTable.json",
        "PotentialTalentEffectTable.json",
    )
    loaded_tables = {
        name: require_dict(
            json.loads((args.tables / name).read_text(encoding="utf-8")),
            str(args.tables / name),
        )
        for name in table_names
    }
    selected = set(args.operators or [])
    generated = 0
    for raw_operator in require_list(manifest.get("operators"), "operators"):
        operator = require_dict(raw_operator, "operators[]")
        slug = str(operator["slug"])
        if selected and slug not in selected:
            continue
        skills = [
            parse_skill(require_dict(entry, f"{slug}.skills[]"), args.source, patch_table)
            for entry in require_list(operator["skills"], f"{slug}.skills")
        ]
        validate_routed_skills(operator, skills, args.source)
        operator_simulation_no_effect_buff_ids = tuple(
            str(value)
            for value in require_list(
                operator.get("simulationNoEffectBuffIds", []),
                f"{slug}.simulationNoEffectBuffIds",
            )
        )
        if len(operator_simulation_no_effect_buff_ids) != len(
            set(operator_simulation_no_effect_buff_ids)
        ):
            raise ValueError(f"{slug}.simulationNoEffectBuffIds: duplicate Buff id")
        inherited_simulation_no_effect_buff_ids = tuple(
            dict.fromkeys(
                [
                    *global_simulation_no_effect_buff_ids,
                    *operator_simulation_no_effect_buff_ids,
                ]
            )
        )
        char_id = str(operator["charId"])
        output_stage = operator.get("outputStage", "complete")
        if output_stage not in {"audit", "complete"}:
            raise ValueError(f"{slug}.outputStage: expected 'audit' or 'complete'")
        growth = table_row(loaded_tables["CharGrowthTable.json"], char_id, "CharGrowthTable")
        passive_skills = collect_operator_passive_skills(
            char_id,
            growth,
            loaded_tables["CharacterPotentialTable.json"],
            loaded_tables["PotentialTalentEffectTable.json"],
            args.source,
            patch_table,
            parse_base_passive_skill_ids(operator),
        )
        passive_skills = filter_presentation_only_passive_buffs(operator, passive_skills)
        buff_source_dir = args.source.parent / "BuffData"
        skipped_buff_definition_ids: set[str] = set(
            inherited_simulation_no_effect_buff_ids
        )
        for skill_index, raw_skill in enumerate(
            require_list(operator["skills"], f"{slug}.skills")
        ):
            compile_config = require_dict(
                raw_skill, f"{slug}.skills[{skill_index}]"
            ).get("compile")
            if not isinstance(compile_config, dict):
                continue
            omission_ids = {
                str(value)
                for field in (
                    "ignoreBuffIds",
                    "simulationNoEffectBuffIds",
                    "unmodeledBuffIds",
                    "projectedBuffIds",
                )
                for value in require_list(
                    compile_config.get(field, []),
                    f"{slug}.skills[{skill_index}].compile.{field}",
                )
            }
            skipped = {
                str(value)
                for value in require_list(
                    compile_config.get("skipBuffDefinitionResolutionIds", []),
                    f"{slug}.skills[{skill_index}].compile.skipBuffDefinitionResolutionIds",
                )
            }
            invalid_skips = sorted(skipped - omission_ids)
            if invalid_skips:
                raise ValueError(
                    f"{slug}.skills[{skill_index}].compile.skipBuffDefinitionResolutionIds: "
                    f"ids must also use an omission category: {invalid_skips}"
                )
            skipped_buff_definition_ids.update(skipped)
        skill_buff_definitions, buff_definition_resolution_issues = (
            resolve_operator_buff_definitions_for_stage(
                skills,
                buff_source_dir,
                output_stage,
                args.source,
                skipped_buff_definition_ids if output_stage == "complete" else (),
            )
        )
        passive_buff_definitions, passive_buff_resolution_issues = (
            resolve_passive_buff_definitions(passive_skills, buff_source_dir)
        )
        progression_buff_definitions = resolve_progression_buff_definitions(
            operator,
            growth,
            loaded_tables["CharacterPotentialTable.json"],
            loaded_tables["PotentialTalentEffectTable.json"],
            buff_source_dir,
        )
        audited_buff_definitions_by_id = {
            definition.buffId: definition
            for definition in (
                *skill_buff_definitions,
                *passive_buff_definitions,
                *progression_buff_definitions,
            )
        }
        audited_buff_definitions = tuple(
            audited_buff_definitions_by_id[key]
            for key in sorted(audited_buff_definitions_by_id)
        )
        passive_generation_issues = audit_passive_skill_generation(
            passive_skills,
            audited_buff_definitions,
            passive_buff_resolution_issues,
        )
        passive_generation_issues = mark_explicit_unmodeled_passive_skills(
            operator,
            passive_skills,
            passive_generation_issues,
        )
        renderable_passive_skills = {
            skill_id: passive
            for skill_id, passive in passive_skills.items()
            if skill_id not in passive_generation_issues
        }
        renderable_passive_buff_ids = {
            buff_id
            for passive in renderable_passive_skills.values()
            for buff_id in passive.referenced_buff_ids
        }
        buff_definitions_by_id = {
            definition.buffId: definition for definition in skill_buff_definitions
        }
        buff_definitions_by_id.update(
            {
                definition.buffId: definition
                for definition in retain_reachable_buff_definitions(
                    renderable_passive_buff_ids,
                    passive_buff_definitions,
                )
            }
        )
        buff_definitions_by_id.update(
            {definition.buffId: definition for definition in progression_buff_definitions}
        )
        buff_definitions = tuple(
            buff_definitions_by_id[key] for key in sorted(buff_definitions_by_id)
        )
        entity_blackboard_initializers = derive_entity_blackboard_initializers(
            passive_skills, audited_buff_definitions
        )
        write_or_check(
            args.output / f"{slug}.generated.ts",
            render_typescript(str(operator["exportName"]), slug, skills, buff_definitions),
            args.check,
        )
        write_or_check(
            args.output / f"{slug}.audit.json",
            render_report(
                operator,
                skills,
                buff_definitions,
                passive_skills,
                passive_generation_issues,
                buff_definition_resolution_issues,
                entity_blackboard_initializers,
            ),
            args.check,
        )
        if output_stage == "audit":
            presentation_only_buff_ids = {
                definition.buffId
                for definition in audited_buff_definitions
                if is_strictly_presentation_only_buff(definition)
            }
            audit_compile_operator = {
                **operator,
                "skills": [
                    {
                        **raw_skill,
                        "compile": (
                            {
                                **raw_skill["compile"],
                                "ignoreBuffIds": list(
                                    dict.fromkeys(
                                        [
                                            *require_list(
                                                raw_skill["compile"].get(
                                                    "ignoreBuffIds", []
                                                ),
                                                f"{slug}.skills[{skill_index}].compile.ignoreBuffIds",
                                            ),
                                            *sorted(
                                                presentation_only_buff_ids.intersection(
                                                    skills[skill_index].referencedBuffIds
                                                )
                                            ),
                                        ]
                                    )
                                ),
                            }
                            if isinstance(raw_skill.get("compile"), dict)
                            else raw_skill.get("compile")
                        ),
                    }
                    for skill_index, raw_skill in enumerate(
                        require_list(operator["skills"], f"{slug}.skills")
                    )
                ],
            }
            write_or_check(
                args.output / f"{slug}.skills.audit.generated.ts",
                # 审计产物允许保留尚未闭环的 Buff 身份；完整事实仍在同名 audit.json 中。
                render_compiled_skills(
                    audit_compile_operator,
                    skills,
                    entity_blackboard_initializers=entity_blackboard_initializers,
                    skill_slot_replacement_relations=derive_skill_slot_replacement_relations(
                        skills, audited_buff_definitions
                    ),
                    simulation_no_effect_buff_ids=inherited_simulation_no_effect_buff_ids,
                ),
                args.check,
            )
            generated += 1
            print(f"[{slug}] audited {len(skills)} skills -> {args.output}")
            continue
        remove_obsolete_generated_file(args.output / f"{slug}.skills.generated.ts", args.check)
        remove_obsolete_generated_file(
            args.output / f"{slug}.skills.audit.generated.ts", args.check
        )
        write_or_check(
            args.output / f"{slug}.operator.generated.ts",
            render_operator_definition(
                operator,
                skills,
                loaded_tables["CharacterTable.json"],
                loaded_tables["CharGrowthTable.json"],
                loaded_tables["CharacterPotentialTable.json"],
                loaded_tables["PotentialTalentEffectTable.json"],
                buff_definitions,
                renderable_passive_skills,
                entity_blackboard_initializers,
                shared_buff_definitions,
                shared_ability_entity_definitions,
                inherited_simulation_no_effect_buff_ids,
            ),
            args.check,
        )
        print(f"[{slug}] generated {len(skills)} skills -> {args.output}")
        generated += 1
    if selected and generated != len(selected):
        missing = selected.difference(
            str(item.get("slug")) for item in require_list(manifest.get("operators"), "operators") if isinstance(item, dict)
        )
        raise ValueError(f"unknown operators: {', '.join(sorted(missing))}")
    if not selected:
        write_or_check(
            args.output / "commonBuffDefinitions.generated.ts",
            render_shared_buff_definitions_module(shared_buff_definitions),
            args.check,
        )
        write_or_check(
            args.output / "commonAbilityEntityDefinitions.generated.ts",
            render_shared_ability_entity_definitions_module(
                shared_ability_entity_definitions
            ),
            args.check,
        )
