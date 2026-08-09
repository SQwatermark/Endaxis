/**
 * 协调敌人目录选择和属性编辑，把一次 UI 意图转换为一次场景会话提交。
 * 组件不需要知道目录默认值、秒到帧换算或用户覆盖字段的记录方式。
 */
import { computed, type Ref } from 'vue';
import {
  createCatalogEnemyDocument,
  createCustomEnemyDocument,
  replaceEnemyEditableValues,
  setScenarioEnemy,
} from '../../application/editor/enemyEditorCommands';
import type { ScenarioEditorSession } from '../../application/editor/scenarioEditorSession';
import type { GameDataBrowser, GameDataRepository } from '../../core/game-data/gameDataRepository';
import type { EnemyEditableValues, ScenarioDocument } from '../../core/project/schema';

type TimelineEnemyGameData = GameDataRepository & GameDataBrowser;

export interface TimelineEnemyEditorOptions {
  readonly scenario: Readonly<Ref<ScenarioDocument>>;
  readonly session: ScenarioEditorSession;
  readonly gameData: TimelineEnemyGameData;
  readonly fps: number;
}

export function useTimelineEnemyEditor(options: TimelineEnemyEditorOptions) {
  const enemies = computed(() => options.gameData.getEnemies());
  const selectedDefinition = computed(() => {
    const source = options.scenario.value.enemy.source;
    return source.kind === 'catalog' ? options.gameData.getEnemy(source.enemyId) : null;
  });

  function selectCatalogEnemy(enemyId: string, level: number): void {
    const definition = options.gameData.getEnemy(enemyId);
    if (definition === null) throw new Error(`missing enemy definition '${enemyId}'`);
    const enemy = createCatalogEnemyDocument(definition, level, options.fps);
    options.session.commit('setScenarioEnemy', scenario => setScenarioEnemy(scenario, enemy));
  }

  function selectCustomEnemy(level = 90): void {
    const enemy = createCustomEnemyDocument(level);
    options.session.commit('setCustomEnemy', scenario => setScenarioEnemy(scenario, enemy));
  }

  function saveEnemyValues(values: EnemyEditableValues): void {
    options.session.commit('updateEnemyValues', scenario =>
      replaceEnemyEditableValues(scenario, values),
    );
  }

  return {
    enemies,
    selectedDefinition,
    selectCatalogEnemy,
    selectCustomEnemy,
    saveEnemyValues,
  };
}
