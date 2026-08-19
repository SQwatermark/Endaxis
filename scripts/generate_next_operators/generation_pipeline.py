"""执行 manifest 驱动的全量/定向生成、阶段分流与原子文件输出。"""

from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Callable

from source_utils import require_dict, require_list, table_row


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
    render_report: Callable[..., Any]
    render_typescript: Callable[..., Any]
    resolve_operator_buff_definitions_for_stage: Callable[..., Any]
    resolve_passive_buff_definitions: Callable[..., Any]
    resolve_progression_buff_definitions: Callable[..., Any]
    write_or_check: Callable[..., Any]


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
    render_report = services.render_report
    render_typescript = services.render_typescript
    resolve_operator_buff_definitions_for_stage = services.resolve_operator_buff_definitions_for_stage
    resolve_passive_buff_definitions = services.resolve_passive_buff_definitions
    resolve_progression_buff_definitions = services.resolve_progression_buff_definitions
    write_or_check = services.write_or_check
    args = parse_args()
    manifest = require_dict(json.loads(args.manifest.read_text(encoding="utf-8")), str(args.manifest))
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
            parse_base_passive_skill_ids(operator),
        )
        buff_source_dir = args.source.parent / "BuffData"
        skipped_buff_definition_ids: set[str] = set()
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
                for definition in passive_buff_definitions
                if definition.buffId in renderable_passive_buff_ids
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
            write_or_check(
                args.output / f"{slug}.skills.audit.generated.ts",
                # 审计产物允许保留尚未闭环的 Buff 身份；完整事实仍在同名 audit.json 中。
                render_compiled_skills(
                    operator,
                    skills,
                    entity_blackboard_initializers=entity_blackboard_initializers,
                    skill_slot_replacement_relations=derive_skill_slot_replacement_relations(
                        skills, audited_buff_definitions
                    ),
                ),
                args.check,
            )
            generated += 1
            print(f"[{slug}] audited {len(skills)} skills -> {args.output}")
            continue
        remove_obsolete_generated_file(args.output / f"{slug}.skills.generated.ts", args.check)
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
