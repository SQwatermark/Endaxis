"""条件动作树到结构化 DSL IR 的统一递归编译骨架。

本模块负责控制流顺序、作用域传播和叶到根规范化；具体游戏条件证明与叶子动作
语义由调用方注入，避免这里反向依赖生成器入口或复制规则。
"""

from __future__ import annotations

from dataclasses import dataclass, replace
from typing import Any, Callable, Literal

from compiler_ir import (
    CompiledNode,
    EMPTY_SEQUENCE,
    atom,
    branch,
    for_each_context_target,
    once,
    repeat_each_tick,
    semantic_signature,
    sequence,
)
from source_models import (
    AbilityEntitySpawnPayload,
    AuraActionSource,
    BuffDefinitionSource,
    ConditionalActionSource,
    ConditionalBranchActionSource,
    ConditionalProjectileProjection,
    DoOnceActionSource,
    EveryFrameActionSource,
    ForEachContextActionSource,
    SkillSource,
    TargetGroupWriteSource,
    UnconditionalActionSource,
)
from source_utils import ts_inline_literal


@dataclass(frozen=True)
class ConditionalCompileContext:
    ignored_buff_ids: frozenset[str] = frozenset()
    damage_tags: tuple[str, ...] = ()
    runtime_blackboard_keys: frozenset[str] = frozenset()
    target_group_writes: tuple[TargetGroupWriteSource, ...] = ()
    root_skill_context: bool = False
    input_target: Literal["enemy"] | None = None
    skill_has_output_damage: bool = False
    step_key_prefix: str | None = None
    buff_definitions: dict[str, BuffDefinitionSource] | None = None
    ability_entity_current_target: bool = False
    current_ability_entity_id: str | None = None
    singleton_ability_entity_context_keys: frozenset[str] = frozenset()
    buff_ability_damage_event: bool = False
    buff_owner_target: Literal["caster", "enemy", "currentAbilityEntity"] | None = None
    current_buff_environment: bool = False
    invoked_child_context: tuple[SkillSource, dict[str, Any]] | None = None
    unmodeled_action_types: frozenset[str] = frozenset()
    projected_ability_entity_spawns: tuple[AbilityEntitySpawnPayload, ...] = ()
    projected_projectile_launches: tuple[ConditionalProjectileProjection, ...] = ()
    aura_actions: tuple[AuraActionSource, ...] = ()
    compiled_ability_entity_spawns: tuple[
        tuple[tuple[str, ...], str], ...
    ] = ()
    prefer_compiled_ability_entity_spawns: bool = False
    compiled_projectile_launches: tuple[tuple[tuple[str, ...], str], ...] = ()
    context_action: ConditionalActionSource | None = None


CompileLeaf = Callable[
    [ConditionalBranchActionSource, str, ConditionalCompileContext], str
]
CompileCondition = Callable[
    [ConditionalActionSource, str, ConditionalCompileContext], str
]
ActionPredicate = Callable[
    [ConditionalActionSource, ConditionalCompileContext], bool
]
ValidateForEach = Callable[
    [ForEachContextActionSource, str, ConditionalCompileContext],
    Literal["abilityEntity", "singleEnemy"],
]


@dataclass(frozen=True)
class ConditionalCompilerServices:
    compile_leaf: CompileLeaf
    compile_condition: CompileCondition
    is_guaranteed_success: ActionPredicate
    is_presentation_only: ActionPredicate
    validate_for_each: ValidateForEach
    logical_spawn_can_compile: Callable[[AbilityEntitySpawnPayload], bool]
    leaf_semantic_source: Callable[[str], str]


class ConditionalCompiler:
    """用注入的语义服务编译整棵条件树；实例自身无可变状态。"""

    def __init__(self, services: ConditionalCompilerServices) -> None:
        self.services = services

    def compile_branch(
        self,
        actions: tuple[ConditionalBranchActionSource, ...],
        path: str,
        context: ConditionalCompileContext,
    ) -> CompiledNode:
        if not actions:
            return EMPTY_SEQUENCE
        compiled_nodes: list[CompiledNode] = []
        available_singleton_keys = set(context.singleton_ability_entity_context_keys)
        for index, action in enumerate(actions):
            action_path = f"{path}[{index}]"
            action_context = replace(
                context,
                singleton_ability_entity_context_keys=frozenset(
                    available_singleton_keys
                ),
            )
            nested_condition = getattr(action, "nestedCondition", None)
            once_actions = getattr(action, "onceActions", None)
            if nested_condition is not None:
                compiled = self.compile_action(
                    nested_condition,
                    f"{action_path}.nestedCondition",
                    action_context,
                )
            elif once_actions is not None:
                if action.onceScopeKey is None:
                    raise ValueError(f"{action_path}: DoOnceAction has no scope key")
                compiled = once(
                    ts_inline_literal(action.onceScopeKey),
                    self.compile_branch(
                        once_actions,
                        f"{action_path}.onceActions",
                        action_context,
                    ),
                )
            else:
                compiled_source = self.services.compile_leaf(
                    action, action_path, action_context
                )
                compiled = (
                    EMPTY_SEQUENCE
                    if compiled_source == "sequence()"
                    else atom(
                        compiled_source,
                        semantic_source=self.services.leaf_semantic_source(
                            compiled_source
                        ),
                    )
                )
            ability_entity_spawn = getattr(action, "abilityEntitySpawn", None)
            if (
                ability_entity_spawn is not None
                and ability_entity_spawn.saveToContextKey is not None
                and self.services.logical_spawn_can_compile(ability_entity_spawn)
            ):
                available_singleton_keys.add(ability_entity_spawn.saveToContextKey)
            if nested_condition is not None:
                available_singleton_keys.update(
                    payload.saveToContextKey
                    for payload in getattr(
                        nested_condition, "projectedAbilityEntitySpawns", ()
                    )
                    if payload.saveToContextKey is not None
                    and self.services.logical_spawn_can_compile(payload)
                )
            compiled_nodes.append(compiled)
        return sequence(*compiled_nodes)

    def _branch_context(
        self,
        action: ConditionalActionSource,
        context: ConditionalCompileContext,
        *,
        ability_entity_current_target: bool | None = None,
        input_target: Literal["enemy"] | None = None,
    ) -> ConditionalCompileContext:
        return replace(
            context,
            projected_ability_entity_spawns=getattr(
                action, "projectedAbilityEntitySpawns", ()
            ),
            projected_projectile_launches=getattr(
                action, "projectedProjectileLaunches", ()
            ),
            context_action=action,
            ability_entity_current_target=(
                context.ability_entity_current_target
                if ability_entity_current_target is None
                else ability_entity_current_target
            ),
            input_target=context.input_target if input_target is None else input_target,
        )

    def compile_action(
        self,
        action: ConditionalActionSource,
        path: str,
        context: ConditionalCompileContext,
    ) -> CompiledNode:
        branch_context = self._branch_context(action, context)
        if isinstance(action, DoOnceActionSource):
            return once(
                ts_inline_literal(action.onceScopeKey),
                self.compile_branch(
                    action.succeedActions,
                    f"{path}.succeedActions",
                    branch_context,
                ),
            )
        if isinstance(action, ForEachContextActionSource):
            target_kind = self.services.validate_for_each(action, path, context)
            if target_kind == "singleEnemy":
                return self.compile_branch(
                    action.succeedActions,
                    f"{path}.succeedActions",
                    self._branch_context(
                        action,
                        context,
                        ability_entity_current_target=False,
                        input_target="enemy",
                    ),
                )
            return for_each_context_target(
                ts_inline_literal(action.contextKey),
                self.compile_branch(
                    action.succeedActions,
                    f"{path}.succeedActions",
                    self._branch_context(
                        action, context, ability_entity_current_target=True
                    ),
                ),
            )
        if isinstance(action, EveryFrameActionSource):
            return repeat_each_tick(
                self.compile_branch(
                    action.succeedActions,
                    f"{path}.succeedActions",
                    branch_context,
                )
            )
        if isinstance(action, UnconditionalActionSource):
            return self.compile_branch(
                action.succeedActions,
                f"{path}.succeedActions",
                branch_context,
            )
        if self.services.is_guaranteed_success(action, context):
            return self.compile_branch(
                action.succeedActions,
                f"{path}.succeedActions",
                branch_context,
            )
        if self.services.is_presentation_only(action, context):
            return EMPTY_SEQUENCE
        succeed = self.compile_branch(
            action.succeedActions,
            f"{path}.succeedActions",
            branch_context,
        )
        fail = (
            self.compile_branch(
                action.failActions,
                f"{path}.failActions",
                branch_context,
            )
            if action.failActions
            else None
        )
        if succeed == EMPTY_SEQUENCE and (fail is None or fail == EMPTY_SEQUENCE):
            return EMPTY_SEQUENCE
        always_next = getattr(action, "alwaysNext", False)
        if fail is not None and semantic_signature(succeed) == semantic_signature(fail):
            if not always_next:
                return succeed
            # 两个分支效果相同，不必编译可能尚未覆盖的原生条件；恒真条件仍保留
            # alwaysNext 对所选公共分支返回值的覆盖语义。
            return branch(
                "{ kind: 'actionValueCompare', "
                "left: { kind: 'constant', value: 0 }, operator: 'equal', "
                "right: { kind: 'constant', value: 0 } }",
                succeed,
                always_next=True,
            )
        condition_source = self.services.compile_condition(action, path, context)
        return branch(
            condition_source,
            succeed,
            fail,
            always_next=always_next,
        )
