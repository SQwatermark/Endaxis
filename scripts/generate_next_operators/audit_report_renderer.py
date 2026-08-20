"""将完整来源事实投影为稳定、可审计的 JSON 报告。"""

from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from typing import Any, Callable

from passive_skill_parser import PassiveSkillSource
from source_models import BuffDefinitionSource, SkillSource
from source_utils import require_dict, require_list


@dataclass(frozen=True)
class AuditReportRendererServices:
    """由入口注入递归序列化、调度投影与技能替换关系归纳。"""

    collect_resolved_damage_hits: Callable[..., Any]
    collect_resolved_schedule: Callable[..., Any]
    derive_skill_slot_replacement_relations: Callable[..., Any]
    omit_empty_execution_frames: Callable[..., Any]
    serialize_audit_value: Callable[..., Any]


def render_report(
    operator: dict[str, Any],
    skills: list[SkillSource],
    buff_definitions: tuple[BuffDefinitionSource, ...],
    passive_skills: dict[str, PassiveSkillSource] | None = None,
    passive_generation_issues: dict[str, tuple[str, ...]] | None = None,
    buff_definition_resolution_issues: tuple[str, ...] = (),
    entity_blackboard_initializers: list[dict[str, Any]] | None = None,
    *,
    services: AuditReportRendererServices,
) -> str:
    collect_resolved_damage_hits = services.collect_resolved_damage_hits
    collect_resolved_schedule = services.collect_resolved_schedule
    derive_skill_slot_replacement_relations = services.derive_skill_slot_replacement_relations
    omit_empty_execution_frames = services.omit_empty_execution_frames
    serialize_audit_value = services.serialize_audit_value
    slug = str(operator["slug"])
    skill_configs = {
        str(entry["key"]): require_dict(entry.get("compile", {}), f"{slug}.skills[].compile")
        for entry in require_list(operator["skills"], f"{slug}.skills")
    }
    passive_skills = passive_skills or {}
    passive_generation_issues = passive_generation_issues or {}
    report = {
        "operator": slug,
        **(
            {"entityBlackboardInitializers": entity_blackboard_initializers}
            if entity_blackboard_initializers
            else {}
        ),
        **(
            {"skillSlotReplacementRelations": replacement_relations}
            if (
                replacement_relations := derive_skill_slot_replacement_relations(
                    skills, buff_definitions
                )
            )
            else {}
        ),
        "complete": all(
            not skill.unresolvedCombatActions
            and not skill.blackboardKeys
            and not skill.conditionalActions
            for skill in skills
        )
        and not passive_generation_issues
        and not buff_definition_resolution_issues,
        **(
            {"buffDefinitionResolutionIssues": list(buff_definition_resolution_issues)}
            if buff_definition_resolution_issues
            else {}
        ),
        "buffDefinitions": [
            serialize_audit_value(definition) for definition in buff_definitions
        ],
        **(
            {
                "passiveSkills": [
                    {
                        **serialize_audit_value(passive_skills[key]),
                        "generationIssues": list(passive_generation_issues.get(key, ())),
                    }
                    for key in sorted(passive_skills)
                ]
            }
            if passive_skills
            else {}
        ),
        "skills": [
            {
                "key": skill.key,
                "skillId": skill.skillId,
                "sourceFile": skill.sourceFile,
                "timelineBlockFrames": skill.timelineBlockFrames,
                "blockBoundarySource": skill.blockBoundarySource,
                "directDamageHits": [asdict(hit) for hit in skill.directDamageHits],
                "timelineJumps": [asdict(jump) for jump in skill.timelineJumps],
                "timelineJumpControlFlowActions": [
                    asdict(action) for action in skill.timelineJumpControlFlowActions
                ],
                "timelineFinishes": [
                    asdict(finish) for finish in skill.timelineFinishes
                ],
                **(
                    {
                        "intervalDamageHits": [
                            asdict(hit) for hit in skill.intervalDamageHits
                        ]
                    }
                    if getattr(skill, "intervalDamageHits", ())
                    else {}
                ),
                "conditionalActions": [
                    serialize_audit_value(action) for action in skill.conditionalActions
                ],
                "auxiliaryActions": [
                    serialize_audit_value(action) for action in skill.auxiliaryActions
                ],
                "blackboardCalculations": [
                    asdict(calculation) for calculation in skill.blackboardCalculations
                ],
                "blackboardMutations": [
                    asdict(mutation) for mutation in skill.blackboardMutations
                ],
                "buffBlackboardReads": [asdict(read) for read in skill.buffBlackboardReads],
                "buffFinishes": [asdict(finish) for finish in skill.buffFinishes],
                "buffHolds": [asdict(hold) for hold in skill.buffHolds],
                "resourceGains": [asdict(gain) for gain in skill.resourceGains],
                "projectileLaunches": [asdict(launch) for launch in skill.projectileLaunches],
                "projectileTriggeredSkills": [
                    omit_empty_execution_frames(hit) for hit in skill.projectileTriggeredSkills
                ],
                "abilityEntityHits": [
                    omit_empty_execution_frames(hit) for hit in skill.abilityEntityHits
                ],
                "referencedBuffIds": skill.referencedBuffIds,
                "resolvedDamageHits": [asdict(hit) for hit in collect_resolved_damage_hits(skill)],
                "resolvedSchedule": [
                    {
                        "frame": item.frame,
                        "actionOrder": item.actionOrder,
                        "sequenceOrder": item.sequenceOrder,
                        "itemType": item.itemType,
                        "sourcePath": item.sourcePath,
                    }
                    for item in collect_resolved_schedule(skill)
                ],
                "blackboardKeys": skill.blackboardKeys,
                "blackboardProvenance": [
                    asdict(provenance) for provenance in skill.blackboardProvenance
                ],
                "targetGroupWrites": [
                    serialize_audit_value(write) for write in skill.targetGroupWrites
                ],
                "timeDilations": [asdict(action) for action in skill.timeDilations],
                "skillReplacements": [
                    serialize_audit_value(action) for action in skill.skillReplacements
                ],
                "unresolvedCombatActions": skill.unresolvedCombatActions,
                **(
                    {
                        "unmodeledCombatActions": sorted(
                            str(value)
                            for value in require_list(
                                skill_configs[skill.key]["unmodeledActionTypes"],
                                f"{slug}.{skill.key}.compile.unmodeledActionTypes",
                            )
                        )
                    }
                    if "unmodeledActionTypes" in skill_configs[skill.key]
                    else {}
                ),
            }
            for skill in skills
        ],
    }
    return json.dumps(report, ensure_ascii=False, indent=2) + "\n"
