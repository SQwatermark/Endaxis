/**
 * 从本次重建使用的来源编译装备和机制消费者，供实体黑板用途分析。
 * 不读正式生成库，不写候选文件；各领域仍走原生成器的同一编译入口，缺来源或未支持行为继续报错。
 */
import path from 'node:path';
import { compileWeaponDefinitionsFromFiles } from './generateWeaponDefinitions.ts';
import { compileGearSetDefinitionsFromFiles } from './generateGearSetDefinitions.ts';
import { compileGearDefinitionsFromFiles } from './generateGearDefinitions.ts';
import { compileContingencyContractDefinitionsFromFiles } from './generateContingencyContractDefinitions.ts';
import type { OperatorPlanningSources } from './operatorPlanningSources.ts';

export async function compileEntityValueConsumers(args: {
  readonly sourceRoot: string;
  readonly tableRoot: string;
  readonly buffDataRoot: string;
  readonly gameplayTagCatalog: string;
  readonly globalBuffCatalog: string;
  readonly skillSettingCatalog: string;
  readonly sources: OperatorPlanningSources;
}) {
  const weapons = compileWeaponDefinitionsFromFiles({
    tables: args.tableRoot,
    skillData: path.join(args.sourceRoot, 'SkillData'),
    buffData: args.buffDataRoot,
    gameplayTagCatalog: args.gameplayTagCatalog,
  }).definitions;
  const gears = (await compileGearDefinitionsFromFiles(args.tableRoot)).definitions;
  const gearSets = (
    await compileGearSetDefinitionsFromFiles({
      tablesDirectory: args.tableRoot,
      skillDataDirectory: path.join(args.sourceRoot, 'SkillData'),
      buffDataDirectory: args.buffDataRoot,
      gameplayTagCatalog: args.gameplayTagCatalog,
    })
  ).definitions;
  const mechanics = compileContingencyContractDefinitionsFromFiles({
    tableRoot: args.tableRoot,
    buffDataRoot: args.buffDataRoot,
    globalBuffCatalog: args.globalBuffCatalog,
    skillSettingCatalog: args.skillSettingCatalog,
    gameplayTagPaths: args.sources.gameplayTags(args.gameplayTagCatalog),
    scope: path.resolve(import.meta.dirname, '../config/contingencyContractSimulationScope.json'),
  });
  return {
    // 默认数据仓库没有另行注册的共享实体；游戏实体定义随所属干员进入本轮分析。
    commonAbilityEntityDefinitions: {},
    weapons,
    gears,
    gearSets,
    mechanicBuffDefinitions: mechanics.buffDefinitions,
    mechanicSequences: mechanics.initializationPlans.map(plan => plan.sequence),
  };
}
