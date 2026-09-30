import { expectTypeOf } from 'vitest';
import type {
  CombatRuntimeAssembly,
  CombatRuntimeAssemblyOptions,
  CombatRuntimeAssemblyRestoreOptions,
  CombatRuntimeEnvironmentOptions,
  CombatRuntimeScenarioOptions,
} from '../combat/runtime/combatRuntimeAssembly';
import type { CompileScenarioRuntimeAssemblyOptions } from './compileScenarioRuntimeAssembly';

// 场景输入与环境端口互不重叠；完整装配选项由两者组成。
expectTypeOf<
  keyof CombatRuntimeScenarioOptions & keyof CombatRuntimeEnvironmentOptions
>().toEqualTypeOf<never>();
expectTypeOf<keyof CombatRuntimeAssemblyOptions>().toEqualTypeOf<
  keyof CombatRuntimeScenarioOptions | keyof CombatRuntimeEnvironmentOptions
>();
expectTypeOf<
  CompileScenarioRuntimeAssemblyOptions['environment']
>().toEqualTypeOf<CombatRuntimeEnvironmentOptions>();

// 构造器只接收一个完整的新建或已预检恢复输入，不能再搭配伪造的新建选项。
type ConstructionInput = ConstructorParameters<typeof CombatRuntimeAssembly>;
expectTypeOf<ConstructionInput['length']>().toEqualTypeOf<1>();
expectTypeOf<CombatRuntimeAssemblyOptions>().toExtend<ConstructionInput[0]>();
expectTypeOf<CombatRuntimeAssemblyRestoreOptions>().not.toExtend<ConstructionInput[0]>();
expectTypeOf<{}>().not.toExtend<ConstructionInput[0]>();
