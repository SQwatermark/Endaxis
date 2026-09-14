import { gameDataRepository } from '../data/gameDataRepository';
import type { ProjectDefinitionLibraryDocument } from '../core/project/schema';
import { createScenarioSimulationService } from './createScenarioSimulationService';

/** 页面与后台线程共用同一装配，不在传输层重写战斗规则。 */
export function createEditorSimulationService(library?: ProjectDefinitionLibraryDocument) {
  return createScenarioSimulationService({
    ...gameDataRepository,
    getOperator: id => library?.operators[id]?.definition ?? gameDataRepository.getOperator(id),
    getWeapon: id => library?.weapons[id]?.definition ?? gameDataRepository.getWeapon(id),
    getGear: id => library?.gears[id]?.definition ?? gameDataRepository.getGear(id),
    getGearSet: id => library?.gearSets[id]?.definition ?? gameDataRepository.getGearSet(id),
  });
}
