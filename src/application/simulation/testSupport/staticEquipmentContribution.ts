import type { EquipmentContributionDefinition } from '../../../core/game-data/equipmentDefinition';

/** 测试中的静态装备对照：保留属性词条，移除全部运行时入口及其资源。 */
export function staticEquipmentContribution<T extends EquipmentContributionDefinition>(
  definition: T,
) {
  const {
    enableSequence: _enableSequence,
    initializationSequence: _initializationSequence,
    blackboard: _blackboard,
    eventHandlers: _eventHandlers,
    actionGraph: _actionGraph,
    ...staticOnly
  } = definition;
  return staticOnly;
}
