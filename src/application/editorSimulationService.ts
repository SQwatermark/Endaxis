import { ScenarioSimulationService } from './scenarioSimulationService';
import { gameDataRepository } from '../data/gameDataRepository';
import { skillSettings, skillSettingResources } from '../data/combat/skillSettings';
import type { ProjectDefinitionLibraryDocument } from '../core/project/schema';

/** 页面与后台线程共用同一装配，不在传输层重写战斗规则。 */
export function createEditorSimulationService(library?: ProjectDefinitionLibraryDocument) {
  return new ScenarioSimulationService({
    index: {
      ...gameDataRepository,
      getOperator: id => library?.operators[id]?.definition ?? gameDataRepository.getOperator(id),
      getWeapon: id => library?.weapons[id]?.definition ?? gameDataRepository.getWeapon(id),
      getGear: id => library?.gears[id]?.definition ?? gameDataRepository.getGear(id),
      getGearSet: id => library?.gearSets[id]?.definition ?? gameDataRepository.getGearSet(id),
    },
    repositoryRevision: gameDataRepository.revision,
    spellInflictionSettings: skillSettings,
    resources: {
      sharedSpGain: { baseGainEfficiency: skillSettingResources.atbGainEfficiency },
      spRecoveryPauseDuration: skillSettingResources.atbRecoverInterval,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: {
        selfGainPerSp: skillSettingResources.atbConsumedDefaultUspGainSelf,
        otherGainPerSp: skillSettingResources.atbConsumedDefaultUspGainOther,
      },
    },
  });
}
