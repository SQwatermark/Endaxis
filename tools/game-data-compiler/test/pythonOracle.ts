import { spawnSync } from 'node:child_process';

interface PythonOracleRequest {
  readonly operation:
    | 'collectBlackboardKeys'
    | 'collectTargetGroupWrites'
    | 'parseBlackboardCalculation'
    | 'parseBlackboardMutation'
    | 'parseConditionLeaf'
    | 'parseDeclaredBlackboard'
    | 'parsePanelAttributes'
    | 'parseTrustAttributeBonus'
    | 'validateSkillGroups'
    | 'parseScalar'
    | 'parseSkillPatch'
    | 'parseTagQuery'
    | 'parseTargetReference'
    | 'parseTargetGroupWrite'
    | 'projectTickIntervalFrames';
  readonly payload: unknown;
}

// 差分测试只通过 JSON 交换数据，避免 TS 测试依赖 Python 内部对象身份。
const ORACLE_SCRIPT = String.raw`
import dataclasses
import json
import pathlib
import sys

root = pathlib.Path.cwd()
sys.path.insert(0, str(root / "scripts" / "generate_next_operators"))
request = json.load(sys.stdin)

if request["operation"] == "parseScalar":
    from action_payload_parser import parse_scalar
    payload = request["payload"]
    result = dataclasses.asdict(parse_scalar(
        payload["value"], payload["path"],
        {key: tuple(values) for key, values in payload["blackboard"].items()},
    ))
elif request["operation"] == "projectTickIntervalFrames":
    from source_utils import project_tick_interval_frames
    payload = request["payload"]
    result = project_tick_interval_frames(
        payload["startFrame"], payload["endFrame"], payload["intervalSeconds"]
    )
elif request["operation"] == "parseTagQuery":
    from action_payload_parser import parse_tag_query
    query_type, tag_ids = parse_tag_query(
        request["payload"]["value"], request["payload"]["path"]
    )
    result = {"queryType": query_type, "tagIds": tag_ids}
elif request["operation"] == "parseTargetReference":
    from target_parser import parse_target_reference
    payload = request["payload"]
    result = dataclasses.asdict(parse_target_reference(payload["value"], payload["path"]))
    result["finderShape"] = None
    result["finderOwnerPartsQuery"] = None
elif request["operation"] == "collectBlackboardKeys":
    from generate_next_operators import collect_blackboard_keys
    result = collect_blackboard_keys(request["payload"])
elif request["operation"] == "parseDeclaredBlackboard":
    from generate_next_operators import parse_declared_blackboard
    payload = request["payload"]
    result = [
        dataclasses.asdict(item)
        for item in parse_declared_blackboard(payload["value"], payload["path"])
    ]
elif request["operation"] == "parsePanelAttributes":
    from generate_next_operators import parse_panel_attributes
    payload = request["payload"]
    result = parse_panel_attributes(payload["character"], payload["path"])
elif request["operation"] == "parseTrustAttributeBonus":
    from generate_next_operators import parse_trust_attribute_bonus
    payload = request["payload"]
    result = parse_trust_attribute_bonus(
        payload["growth"], payload["mainAttribute"], payload["path"]
    )
elif request["operation"] == "validateSkillGroups":
    from types import SimpleNamespace
    from generate_next_operators import validate_skill_groups
    payload = request["payload"]
    validate_skill_groups(
        payload["operator"],
        [SimpleNamespace(**skill) for skill in payload["skills"]],
        payload["growth"],
        payload["path"],
    )
    result = {"valid": True}
elif request["operation"] == "parseSkillPatch":
    from generate_next_operators import parse_skill_patch
    payload = request["payload"]
    result = dataclasses.asdict(parse_skill_patch(payload["value"], payload["skillId"]))
elif request["operation"] == "parseBlackboardCalculation":
    from action_payload_parser import parse_blackboard_calculation_payload
    payload = request["payload"]
    result = dataclasses.asdict(parse_blackboard_calculation_payload(
        payload["value"], payload["path"],
        {key: tuple(values) for key, values in payload["blackboard"].items()},
    ))
elif request["operation"] == "parseBlackboardMutation":
    from action_payload_parser import parse_blackboard_mutation_payload
    payload = request["payload"]
    result = dataclasses.asdict(parse_blackboard_mutation_payload(
        payload["value"], payload["path"],
        {key: tuple(values) for key, values in payload["blackboard"].items()},
    ))
elif request["operation"] == "parseTargetGroupWrite":
    from target_group_parser import parse_target_group_writes
    payload = request["payload"]
    writes = parse_target_group_writes(payload["root"], payload["sourceName"])
    result = dataclasses.asdict(writes[payload.get("index", 0)])
elif request["operation"] == "collectTargetGroupWrites":
    from target_group_parser import parse_target_group_writes
    payload = request["payload"]
    result = [
        dataclasses.asdict(item)
        for item in parse_target_group_writes(payload["root"], payload["sourceName"])
    ]
elif request["operation"] == "parseConditionLeaf":
    from conditional_parser import parse_conditional_actions
    payload = request["payload"]
    effect = {
        "$type": "Example.ModifyDynamicBlackboard+Data, Example",
        "isEnable": True, "priorityLevel": "Default", "priorityOffset": 0,
        "serverActionIndex": 3, "key": "oracle_effect", "operation": "Add",
        "directValue": True,
        "value": {"useBlackboardKey": False, "value": 1, "blackboardKey": ""},
    }
    branch = {
        "$type": "Example.IfElseAction+Data, Example", "isEnable": True,
        "priorityLevel": "Default", "priorityOffset": 0, "serverActionIndex": 1,
        "alwaysNext": False,
        "conditionAction": {"actionData": [payload["value"]]},
        "succeedActions": {"actionData": [effect]},
        "failActions": {"actionData": []},
    }
    root_value = {"actionGroupData": {"timelineActions": [{
        "_startFrame": 0, "_endFrame": 0,
        "_sequenceActionData": {"actionData": [branch]},
    }]}}
    condition = parse_conditional_actions(
        root_value, "oracle.json",
        {key: tuple(values) for key, values in payload["blackboard"].items()},
    )[0].conditions[0]
    def normalize_condition(item):
        common = {"sourceType": item.sourceType}
        if item.sourceType == "CompareFloat":
            return {"kind": "floatCompare", **common, "comparison": item.comparison,
                    "left": dataclasses.asdict(item.left), "right": dataclasses.asdict(item.right)}
        if item.mainOperator is not None:
            return {"kind": "mainOperator", **common, **dataclasses.asdict(item.mainOperator)}
        if item.distance is not None:
            return {"kind": "distance", **common, **dataclasses.asdict(item.distance)}
        if item.entityCount is not None:
            return {"kind": "entityCount", **common, **dataclasses.asdict(item.entityCount)}
        if item.buffStack is not None:
            return {"kind": "buffStack", **common, **dataclasses.asdict(item.buffStack)}
        if item.entityTag is not None:
            return {"kind": "entityTag", **common, **dataclasses.asdict(item.entityTag)}
        if item.timedMarker is not None:
            return {"kind": "timedMarker", **common, **dataclasses.asdict(item.timedMarker)}
        if item.health is not None:
            return {"kind": "health", **common, **dataclasses.asdict(item.health)}
        if item.probability is not None:
            return {"kind": "probability", **common, "value": dataclasses.asdict(item.probability)}
        if item.skillTypes:
            return {"kind": "skillType", **common, "skillTypes": item.skillTypes}
        if item.damageType is not None:
            return {"kind": "damageType", **common, "damageType": item.damageType}
        if item.inflictionElements:
            return {"kind": "inflictionType", **common,
                    "elements": item.inflictionElements, "savedKey": ""}
        if item.deckAttributeCompare is not None:
            return {"kind": "deckAttributeCompare", **common,
                    **dataclasses.asdict(item.deckAttributeCompare)}
        if item.abilityEntityDuration is not None:
            return {"kind": "abilityEntityDuration", **common,
                    **dataclasses.asdict(item.abilityEntityDuration)}
        if item.damageDecorateMask is not None:
            return {"kind": "damageDecorateMask", **common,
                    **dataclasses.asdict(item.damageDecorateMask)}
        if item.healTag is not None:
            return {"kind": "healTag", **common, **dataclasses.asdict(item.healTag)}
        if item.overHeal is not None:
            return {"kind": "overHeal", **common, **dataclasses.asdict(item.overHeal)}
        if item.contextBuffId is not None:
            return {"kind": "contextBuff", **common,
                    **dataclasses.asdict(item.contextBuffId)}
        if item.globalCooldown is not None:
            return {"kind": "globalCooldown", **common,
                    **dataclasses.asdict(item.globalCooldown)}
        if item.skillHasHit is not None:
            return {"kind": "skillHasHit", **common}
        if item.enemyRank is not None:
            return {"kind": "enemyRank", **common, **dataclasses.asdict(item.enemyRank)}
        if item.superArmor is not None:
            return {"kind": "superArmor", **common, **dataclasses.asdict(item.superArmor)}
        if item.twoDirectionAngle is not None:
            return {"kind": "twoDirectionAngle", **common,
                    **dataclasses.asdict(item.twoDirectionAngle)}
        if item.targetAngle is not None:
            return {"kind": "targetAngle", **common, **dataclasses.asdict(item.targetAngle)}
        if item.poise is not None:
            return {"kind": "poise", **common, **dataclasses.asdict(item.poise)}
        if item.targetIdentity is not None:
            return {"kind": "targetIdentity", **common,
                    **dataclasses.asdict(item.targetIdentity)}
        if item.objectTypeMatch is not None:
            return {"kind": "objectTypeMatch", **common,
                    **dataclasses.asdict(item.objectTypeMatch)}
        if item.anyConditionGroups:
            return {"kind": "any", **common, "groups": [
                {"conditions": [normalize_condition(child) for child in group],
                 "negated": negated}
                for group, negated in zip(item.anyConditionGroups, item.anyConditionNegated)
            ]}
        raise ValueError("oracle condition normalizer does not support " + item.sourceType)
    result = normalize_condition(condition)
else:
    raise ValueError("unknown oracle operation")

def add_target_shape(value):
    if isinstance(value, dict):
        if "finderType" in value and "finderSpawnedObjectType" in value:
            value.setdefault("finderShape", None)
            value.setdefault("finderOwnerPartsQuery", None)
            value.setdefault("priorityFilters", [])
            value.setdefault("shuffleTargets", [])
            value.setdefault("distanceValidators", [])
        for child in value.values():
            add_target_shape(child)
    elif isinstance(value, (list, tuple)):
        for child in value:
            add_target_shape(child)

add_target_shape(result)
json.dump(result, sys.stdout)
`;

export function runPythonOracle(request: PythonOracleRequest): unknown {
  const result = spawnSync('python', ['-c', ORACLE_SCRIPT], {
    cwd: process.cwd(),
    encoding: 'utf8',
    input: JSON.stringify(request),
  });
  if (result.status !== 0) {
    throw new Error(`Python oracle failed:\n${result.stderr}`);
  }
  return JSON.parse(result.stdout) as unknown;
}
