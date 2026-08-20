"""编译直伤、投射物伤害和通用 DamageUnit 步骤。"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable

from source_models import (
    DamageUnitSource,
    ProjectileLaunchSource,
    ProjectileSkillTriggerSource,
    ProjectileTriggeredSkillSource,
    ResolvedDamageHitSource,
    SkillSource,
)
from source_utils import require_list, ts_inline_literal


@dataclass(frozen=True)
class DamageStepCompilerServices:
    """由入口注入数值、资源、Buff 与技能元数据编译规则。"""

    compile_buff_blackboard_read: Callable[..., Any]
    compile_buff_finish: Callable[..., Any]
    compile_infliction: Callable[..., Any]
    compile_percentage_level_values: Callable[..., Any]
    compile_resource_gain: Callable[..., Any]
    compact_level_values: Callable[..., Any]
    decode_damage_decorate_mask: Callable[..., Any]
    render_time_dilation_scheduled_entries: Callable[..., Any]
    require_level_values: Callable[..., Any]
    resolve_skill_cooldown_frames: Callable[..., Any]
    resolve_skill_cost_resource: Callable[..., Any]
    resolved_scalar_values: Callable[..., Any]
    damage_type_map: dict[str, str]
    implied_damage_tag_parents: dict[str, str]


def compile_direct_damage(
    skill: SkillSource,
    config: dict[str, Any],
    *,
    services: DamageStepCompilerServices,
) -> str:
    compile_buff_blackboard_read = services.compile_buff_blackboard_read
    compile_buff_finish = services.compile_buff_finish
    compile_infliction = services.compile_infliction
    compile_percentage_level_values = services.compile_percentage_level_values
    compile_resource_gain = services.compile_resource_gain
    compact_level_values = services.compact_level_values
    render_time_dilation_scheduled_entries = services.render_time_dilation_scheduled_entries
    require_level_values = services.require_level_values
    resolve_skill_cooldown_frames = services.resolve_skill_cooldown_frames
    resolve_skill_cost_resource = services.resolve_skill_cost_resource
    resolved_scalar_values = services.resolved_scalar_values
    DAMAGE_TYPE_MAP = services.damage_type_map
    if len(skill.directDamageHits) != 1:
        raise ValueError(f"{skill.key}: direct damage compiler requires exactly one non-projectile hit")
    non_presentation_projectiles = [
        hit
        for hit in skill.projectileTriggeredSkills
        if hit.cycleTruncated or hit.combatActions or hit.nestedProjectileTriggeredSkills
    ]
    if non_presentation_projectiles:
        raise ValueError(f"{skill.key}: projectile contains combat behavior and cannot be omitted")
    unclassified = [action.sourceId for action in skill.auxiliaryActions if action.classification is None]
    if unclassified:
        raise ValueError(f"{skill.key}: unclassified auxiliary actions: {unclassified}")
    expected_actions = {
        "DamageAction",
        *(action.actionType for action in skill.auxiliaryActions),
        *({"ObtainCostAction"} if skill.resourceGains else set()),
        *({"SpellInfliction"} if skill.inflictions else set()),
        *({"LaunchProjectile"} if skill.projectileTriggeredSkills else set()),
        *({"GetTargetBuffBBAdvanced"} if skill.buffBlackboardReads else set()),
    }
    if set(skill.unresolvedCombatActions) != expected_actions:
        raise ValueError(f"{skill.key}: unresolved combat actions are not fully accounted for")
    hit = skill.directDamageHits[0]
    hp_units = [unit for unit in hit.damageUnits if unit.attributeType == "Hp"]
    poise_units = [unit for unit in hit.damageUnits if unit.attributeType == "Poise"]
    if len(hp_units) != 1 or len(poise_units) > 1 or len(hp_units) + len(poise_units) != len(hit.damageUnits):
        raise ValueError(f"{skill.key}: unsupported direct DamageUnit layout")
    hp = hp_units[0]
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
    scale = compile_percentage_level_values(
        require_level_values(hp.attackScale, f"{skill.key}.attackScale")
    )
    damage_fields = [
        f"damageType: {ts_inline_literal(damage_type)}",
        f"attackScale: {scale}",
        f"tags: {ts_inline_literal(require_list(config.get('tags'), f'{skill.key}.compile.tags'))}",
    ]
    if hp.calculation != "standard":
        damage_fields.append(f"calculation: {ts_inline_literal(hp.calculation)}")
    if hp.calculationMultiplier is not None:
        damage_fields.append(
            "calculationMultiplier: "
            f"{ts_inline_literal(compact_level_values(resolved_scalar_values(hp.calculationMultiplier)))}"
        )
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{skill.key}: Poise unit has no value")
        stagger = compact_level_values(require_level_values(poise, f"{skill.key}.stagger"))
        damage_fields.append(f"stagger: {ts_inline_literal(stagger)}")
    step_key = encode_damage_step_key(
        skill.key,
        "direct",
        (skill.skillId,),
        (hit.actionIndex,),
    )
    damage_step = "\n".join(
        [
            "step('dealDamage', {",
            *(f"  {field}," for field in damage_fields),
            f"}}, {ts_inline_literal(step_key)})",
        ]
    )
    ordered_steps: list[tuple[float, str]] = [(hit.actionIndex, damage_step)]
    for index, read in enumerate(skill.buffBlackboardReads):
        if read.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: buff blackboard read and damage occur on different frames")
        ordered_steps.append(
            (
                read.actionIndex,
                compile_buff_blackboard_read(
                    read,
                    f"{skill.key}.buffBlackboardReads[{index}]",
                    root_skill_context=True,
                    input_target="enemy",
                ),
            )
        )
    for index, finish in enumerate(skill.buffFinishes):
        if finish.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: buff finish and damage occur on different frames")
        ordered_steps.append(
            (
                finish.actionIndex,
                compile_buff_finish(
                    finish,
                    f"{skill.key}.buffFinishes[{index}]",
                    root_skill_context=True,
                    input_target="enemy",
                ),
            )
        )
    for infliction in skill.inflictions:
        if infliction.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: infliction and damage occur on different frames")
        ordered_steps.append(
            (
                infliction.actionIndex,
                compile_infliction(infliction),
            )
        )
    for action in skill.auxiliaryActions:
        if action.classification != "skillCostUltimateEnergyGain":
            continue
        if action.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: ultimate energy gain and damage occur on different frames")
        ordered_steps.append(
            (
                action.actionIndex,
                "step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })",
            )
        )
    for gain in skill.resourceGains:
        if gain.startFrame != hit.startFrame:
            raise ValueError(f"{skill.key}: resource gain and damage occur on different frames")
        amount_values = require_level_values(gain.amount, f"{skill.key}.resourceGain.amount")
        # 原生数据中存在已启用但全等级数值均为 0 的资源动作；保留在审计层，但不生成无效果步骤。
        if all(value == 0 for value in amount_values):
            continue
        ordered_steps.append(
            (
                gain.actionIndex,
                compile_resource_gain(gain, f"{skill.key}.resourceGain"),
            )
        )
    after_damage = config.get("afterDamage")
    if after_damage == "gainFinisherSp":
        ordered_steps.append(
            (hit.actionIndex + 0.5, "step('gainFinisherSp', { factor: 1, recipient: 'team' })")
        )
    elif after_damage is not None:
        raise ValueError(f"{skill.key}.compile.afterDamage: unsupported value")
    steps = [step_source for _, step_source in sorted(ordered_steps, key=lambda item: item[0])]
    rendered_steps = [
        f"          {line}{',' if index == len(lines) - 1 else ''}"
        for step_source in steps
        for lines in [step_source.splitlines()]
        for index, line in enumerate(lines)
    ]
    fields = [
        f"key: {ts_inline_literal(skill.key)},",
        f"sourceSkillId: {ts_inline_literal(skill.skillId)},",
        f"timelineBlockFrames: {skill.timelineBlockFrames},",
    ]
    availability = config.get("availability")
    if availability == "targetStaggered":
        fields.append("availability: { kind: 'targetStaggered', target: 'enemy' },")
    elif availability is not None:
        raise ValueError(f"{skill.key}.compile.availability: unsupported value")
    cooldown_frames = resolve_skill_cooldown_frames(skill, config)
    if cooldown_frames is not None:
        fields.append(
            f"cooldownFrames: {ts_inline_literal(compact_level_values(cooldown_frames))},"
        )
    cost_resource = resolve_skill_cost_resource(skill, config)
    if cost_resource is not None:
        cost = compact_level_values(skill.patch.costValues)
        fields.append(f"costs: [{{ resource: {ts_inline_literal(cost_resource)}, value: {ts_inline_literal(cost)} }}],")
        fields.append(f"costFrame: {skill.costFrame},")
    return "\n".join(
        [
            "  {",
            *(f"    {field}" for field in fields),
            "    scheduledSequences: [",
            *render_time_dilation_scheduled_entries(skill),
            "      scheduled(",
            f"        {hit.startFrame},",
            "        sequence(",
            *rendered_steps,
            "        ),",
            "      ),",
            "    ],",
            "  },",
        ]
    )


def compile_projectile_damage(
    skill: SkillSource,
    config: dict[str, Any],
    *,
    services: DamageStepCompilerServices,
) -> str:
    compile_percentage_level_values = services.compile_percentage_level_values
    compile_resource_gain = services.compile_resource_gain
    compact_level_values = services.compact_level_values
    render_time_dilation_scheduled_entries = services.render_time_dilation_scheduled_entries
    require_level_values = services.require_level_values
    resolve_skill_cooldown_frames = services.resolve_skill_cooldown_frames
    resolve_skill_cost_resource = services.resolve_skill_cost_resource
    DAMAGE_TYPE_MAP = services.damage_type_map
    if skill.unresolvedCombatActions != ("LaunchProjectile",):
        raise ValueError(
            f"{skill.key}: projectile damage compiler expected only root LaunchProjectile, "
            f"got {skill.unresolvedCombatActions}"
        )
    if len(skill.projectileTriggeredSkills) != 1:
        raise ValueError(f"{skill.key}: projectile damage compiler requires exactly one root projectile")
    hit = skill.projectileTriggeredSkills[0]
    if hit.cycleTruncated:
        raise ValueError(f"{skill.key}: root projectile unexpectedly truncates a cycle")
    if hit.assumedTravelFrames != 0:
        raise ValueError(f"{skill.key}: non-zero projectile travel is not supported yet")
    if len(hit.directDamageHits) != 1:
        raise ValueError(f"{skill.key}: projectile hit requires exactly one direct damage action")
    if hit.conditionalActions:
        if config.get("ignoreRecursiveProjectileForSingleTarget") is not True:
            raise ValueError(
                f"{skill.key}: conditional projectile branch requires an explicit single-target omission declaration"
            )
        validate_ignored_recursive_projectile_conditions(
            hit, f"{skill.key}.projectileTriggeredSkills[0].conditionalActions"
        )
    if hit.nestedProjectileTriggeredSkills:
        if config.get("ignoreRecursiveProjectileForSingleTarget") is not True:
            raise ValueError(
                f"{skill.key}: recursive projectile requires an explicit single-target omission declaration"
            )
        if any(
            nested.projectileId != hit.projectileId
            or nested.triggerSkillId != hit.triggerSkillId
            or not nested.cycleTruncated
            for nested in hit.nestedProjectileTriggeredSkills
        ):
            raise ValueError(f"{skill.key}: recursive projectile shape is not the expected self-cycle")

    expected_child_actions = {
        "DamageAction",
        *({"CreateBuffAction"} if hit.auxiliaryActions else set()),
        *({"ObtainCostAction"} if hit.resourceGains else set()),
        *({"LaunchProjectile"} if hit.nestedProjectileTriggeredSkills else set()),
        *({"IfElseAction", "LaunchProjectile"} if hit.conditionalActions else set()),
    }
    if set(hit.combatActions) != expected_child_actions:
        raise ValueError(f"{skill.key}: projectile child actions are not fully accounted for")
    unclassified = [action.sourceId for action in hit.auxiliaryActions if action.classification is None]
    if unclassified:
        raise ValueError(f"{skill.key}: unclassified projectile child actions: {unclassified}")

    damage = hit.directDamageHits[0]
    hp_units = [unit for unit in damage.damageUnits if unit.attributeType == "Hp"]
    poise_units = [unit for unit in damage.damageUnits if unit.attributeType == "Poise"]
    if len(hp_units) != 1 or len(poise_units) > 1 or len(hp_units) + len(poise_units) != len(damage.damageUnits):
        raise ValueError(f"{skill.key}: unsupported projectile DamageUnit layout")
    hp = hp_units[0]
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{skill.key}: unsupported damage type {hp.damageType}")
    damage_fields = [
        f"damageType: {ts_inline_literal(damage_type)}",
        "attackScale: "
        + compile_percentage_level_values(
            require_level_values(hp.attackScale, f"{skill.key}.attackScale")
        ),
        f"tags: {ts_inline_literal(require_list(config.get('tags'), f'{skill.key}.compile.tags'))}",
    ]
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{skill.key}: Poise unit has no value")
        damage_fields.append(
            f"stagger: {ts_inline_literal(compact_level_values(require_level_values(poise, f'{skill.key}.stagger')))}"
        )
    step_key = encode_damage_step_key(
        skill.key,
        "projectile",
        (skill.skillId, hit.triggerSkillId),
        (*hit.actionOrder, damage.actionIndex),
    )
    damage_step = "\n".join(
        [
            "step('dealDamage', {",
            *(f"  {field}," for field in damage_fields),
            f"}}, {ts_inline_literal(step_key)})",
        ]
    )
    ordered_steps: list[tuple[int, str]] = [(damage.actionIndex, damage_step)]
    for action in hit.auxiliaryActions:
        if action.classification == "tutorialMarker":
            continue
        if action.classification != "electrificationReaction":
            raise ValueError(f"{skill.key}: unsupported auxiliary classification {action.classification}")
        duration = action.blackboardAssignments.get("duration")
        if duration is None:
            raise ValueError(f"{skill.key}: electrification reaction has no duration assignment")
        duration_seconds = compact_level_values(
            require_level_values(duration, f"{skill.key}.electrification.duration")
        )
        ordered_steps.append(
            (
                action.actionIndex,
                "\n".join(
                    [
                        "step('applyElementalReaction', {",
                        "  reaction: 'electrification',",
                        "  target: 'enemy',",
                        f"  durationSeconds: {ts_inline_literal(duration_seconds)},",
                        "  effectiveness: 1,",
                        f"}}, {ts_inline_literal(f'{skill.key}.electrification')})",
                    ]
                ),
            )
        )
    for gain in hit.resourceGains:
        ordered_steps.append(
            (
                gain.actionIndex,
                compile_resource_gain(gain, f"{skill.key}.resourceGain"),
            )
        )
    rendered_steps = [
        f"          {line}{',' if index == len(lines) - 1 else ''}"
        for _, step_source in sorted(ordered_steps, key=lambda item: item[0])
        for lines in [step_source.splitlines()]
        for index, line in enumerate(lines)
    ]
    cooldown_frames = resolve_skill_cooldown_frames(skill, config)
    cost_resource = resolve_skill_cost_resource(skill, config)
    resource_fields: list[str] = []
    if cooldown_frames is not None:
        resource_fields.append(
            f"    cooldownFrames: {ts_inline_literal(compact_level_values(cooldown_frames))},"
        )
    if cost_resource is not None:
        resource_fields.extend(
            [
                "    costs: [{ resource: "
                f"{ts_inline_literal(cost_resource)}, value: "
                f"{ts_inline_literal(compact_level_values(skill.patch.costValues))} }}],",
                f"    costFrame: {skill.costFrame},",
            ]
        )
    return "\n".join(
        [
            "  {",
            f"    key: {ts_inline_literal(skill.key)},",
            f"    sourceSkillId: {ts_inline_literal(skill.skillId)},",
            f"    timelineBlockFrames: {skill.timelineBlockFrames},",
            *resource_fields,
            "    scheduledSequences: [",
            *render_time_dilation_scheduled_entries(skill),
            "      scheduled(",
            f"        {hit.launchFrame + hit.assumedTravelFrames + damage.startFrame},",
            "        sequence(",
            *rendered_steps,
            "        ),",
            "      ),",
            "    ],",
            "  },",
        ]
    )


def validate_ignored_recursive_projectile_conditions(
    hit: ProjectileTriggeredSkillSource, path: str
) -> None:
    """校验显式省略项确实只是在条件分支中再次发射同一命中技能。"""
    launches: list[ProjectileLaunchSource] = []
    for condition_index, condition in enumerate(hit.conditionalActions):
        if condition.failActions:
            raise ValueError(f"{path}[{condition_index}]: recursive omission has a fail branch")
        for action_index, action in enumerate(condition.succeedActions):
            if action.projectileLaunch is not None:
                launches.append(action.projectileLaunch)
                continue
            if action.blackboardMutation is not None:
                continue
            raise ValueError(
                f"{path}[{condition_index}].succeedActions[{action_index}]: "
                f"unsupported recursive omission leaf {action.actionType!r}"
            )
    if len(launches) != 1:
        raise ValueError(f"{path}: expected exactly one recursive projectile launch")
    launch = launches[0]
    if (
        launch.projectileId != hit.projectileId
        or ProjectileSkillTriggerSource(hit.triggerEvent, hit.triggerSkillId)
        not in launch.skillTriggers
    ):
        raise ValueError(f"{path}: recursive launch does not target the same projectile event skill")


def encode_step_key_parts(parts: tuple[int | str, ...]) -> str:
    """编码多个字段，并保留字段边界。"""
    return "".join(f"{len(str(part))}:{part}" for part in parts)


def encode_damage_step_key(
    skill_key: str,
    source_kind: str,
    source_path: tuple[str, ...],
    action_order: tuple[int, ...],
) -> str:
    """根据源数据中的命中位置生成稳定的伤害步骤 key。"""
    return encode_step_key_parts(
        (skill_key, source_kind, *source_path, "actionOrder", *action_order)
    )


def compile_damage_units_step(
    damage_units: tuple[DamageUnitSource, ...],
    declared_tags: tuple[str, ...],
    path: str,
    runtime_blackboard_keys: frozenset[str] = frozenset(),
    step_key: str | None = None,
    validate_declared_tags: bool = True,
    *,
    services: DamageStepCompilerServices,
) -> list[str]:
    """按原生 DamageUnit 顺序编译生命伤害及独立失衡单元。"""
    compact_level_values = services.compact_level_values
    compile_percentage_level_values = services.compile_percentage_level_values
    decode_damage_decorate_mask = services.decode_damage_decorate_mask
    require_level_values = services.require_level_values
    resolved_scalar_values = services.resolved_scalar_values
    DAMAGE_TYPE_MAP = services.damage_type_map
    IMPLIED_DAMAGE_TAG_PARENTS = services.implied_damage_tag_parents
    hp_units = [unit for unit in damage_units if unit.attributeType == "Hp"]
    poise_units = [unit for unit in damage_units if unit.attributeType == "Poise"]
    if (
        len(hp_units) > 1
        or len(poise_units) > 1
        or len(hp_units) + len(poise_units) != len(damage_units)
        or not damage_units
    ):
        raise ValueError(f"{path}: unsupported DamageUnit layout")
    if not hp_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{path}: Poise unit has no value")
        if poise.blackboardKey in runtime_blackboard_keys:
            value = (
                "{ kind: 'blackboard', key: "
                f"{ts_inline_literal(poise.blackboardKey)} }}"
            )
        else:
            value = ts_inline_literal(
                compact_level_values(require_level_values(poise, f"{path}.stagger"))
            )
        return [
            "step('dealStagger', {",
            f"  value: {value},",
            "})",
        ]
    if tuple(unit.attributeType for unit in damage_units) not in {("Hp",), ("Hp", "Poise")}:
        raise ValueError(f"{path}: unsupported DamageUnit execution order")
    hp = hp_units[0]
    tags, features = decode_damage_decorate_mask(hp.damageDecorateMask, path)
    undeclared_tags = {
        tag
        for tag in tags
        if tag not in declared_tags
        and IMPLIED_DAMAGE_TAG_PARENTS.get(tag) not in declared_tags
    }
    if validate_declared_tags and undeclared_tags:
        raise ValueError(
            f"{path}: native damage tags {sorted(undeclared_tags)} are absent from the skill declaration"
        )
    damage_type = DAMAGE_TYPE_MAP.get(hp.damageType)
    if damage_type is None:
        raise ValueError(f"{path}: unsupported damage type {hp.damageType}")
    if hp.calculation == "definiteValue":
        fixed_value = hp.definiteValue
        if fixed_value is None:
            raise ValueError(f"{path}: definite damage unit has no value")
        if fixed_value.blackboardKey in runtime_blackboard_keys:
            value = (
                "{ kind: 'blackboard', key: "
                f"{ts_inline_literal(fixed_value.blackboardKey)} }}"
            )
        else:
            value = ts_inline_literal(
                compact_level_values(require_level_values(fixed_value, f"{path}.value"))
            )
        fields = [
            f"damageType: {ts_inline_literal(damage_type)}",
            f"value: {value}",
            f"tags: {ts_inline_literal(tags)}",
        ]
    else:
        if hp.attackScale.blackboardKey in runtime_blackboard_keys:
            attack_scale = (
                "{ kind: 'blackboard', key: "
                f"{ts_inline_literal(hp.attackScale.blackboardKey)} }}"
            )
        else:
            attack_scale = compile_percentage_level_values(
                require_level_values(hp.attackScale, f"{path}.attackScale")
            )
        fields = [
            f"damageType: {ts_inline_literal(damage_type)}",
            f"attackScale: {attack_scale}",
            f"tags: {ts_inline_literal(tags)}",
        ]
        if hp.calculation != "standard":
            fields.append(f"calculation: {ts_inline_literal(hp.calculation)}")
        if hp.calculationMultiplier is not None:
            fields.append(
                "calculationMultiplier: "
                f"{ts_inline_literal(compact_level_values(resolved_scalar_values(hp.calculationMultiplier)))}"
            )
    if features:
        fields.append(f"features: {ts_inline_literal(features)}")
    if poise_units:
        poise = poise_units[0].poiseValue
        if poise is None:
            raise ValueError(f"{path}: Poise unit has no value")
        if poise.blackboardKey in runtime_blackboard_keys:
            fields.append(
                "stagger: { kind: 'blackboard', key: "
                f"{ts_inline_literal(poise.blackboardKey)} }}"
            )
        else:
            fields.append(
                "stagger: "
                f"{ts_inline_literal(compact_level_values(require_level_values(poise, f'{path}.stagger')))}"
            )
    step_kind = "dealFixedDamage" if hp.calculation == "definiteValue" else "dealDamage"
    if step_key is not None:
        return [
            f"step('{step_kind}', {{",
            *(f"  {field}," for field in fields),
            f"}}, {ts_inline_literal(step_key)})",
        ]
    return [f"step('{step_kind}', {{", *(f"  {field}," for field in fields), "})"]


def compile_resolved_damage_steps(
    skill: SkillSource,
    config: dict[str, Any],
    hit: ResolvedDamageHitSource,
    index: int,
    is_last_damage: bool,
    runtime_blackboard_keys: frozenset[str] = frozenset(),
    *,
    services: DamageStepCompilerServices,
) -> list[str]:
    """把一个已解析命中编译成同步步骤；收尾效果紧跟最后一次伤害。"""
    tags = tuple(require_list(config.get("tags"), f"{skill.key}.compile.tags"))
    step_key = encode_damage_step_key(
        skill.key,
        hit.sourceKind,
        hit.sourcePath,
        hit.actionOrder,
    )
    result = compile_damage_units_step(
        hit.damageUnits,
        tags,
        f"{skill.key}.resolvedDamageHits[{index}]",
        runtime_blackboard_keys,
        step_key,
        services=services,
    )
    if is_last_damage and config.get("afterDamage") == "gainFinisherSp":
        result.append("step('gainFinisherSp', { factor: 1, recipient: 'team' })")
    elif is_last_damage and config.get("afterDamage") is not None:
        raise ValueError(f"{skill.key}.compile.afterDamage: unsupported value")
    return result
