import { prepareLegacySource, type ConversionMappings } from './sourcePreparation';
import { createLegacyProjectImporter } from './projectConversion';
import { parseProjectDocument } from '../../src/core/project/serialization';
import type { GameDataRepository } from '../../src/core/game-data/gameDataRepository';

/** 离线工具的唯一转换入口；有遗漏或目标校验失败时不返回可用项目。 */
export function convertLegacyTimeline(
  input: unknown,
  repository: GameDataRepository,
  mappings: ConversionMappings = {},
) {
  const prepared = prepareLegacySource(input, mappings);
  const result = createLegacyProjectImporter(repository).migrate(prepared.source);
  const issues = [...prepared.issues];
  if (!result.ok) issues.push(...result.errors.map(message => ({ path: '', message })));
  else issues.push(...result.warnings.map(message => ({ path: '', message })));
  if (result.ok) {
    const checked = parseProjectDocument(result.value, { gameDataRepository: repository });
    if (!checked.ok) issues.push({ path: '', message: JSON.stringify(checked) });
  }
  return {
    status: issues.length ? 'blocked' : 'converted',
    project: result.ok && !issues.length ? result.value : null,
    report: {
      issues,
      times: prepared.times,
      identityChanges: prepared.identityChanges,
      unresolvedSkills: prepared.unresolvedSkills,
      sourceActionCounts: prepared.source.scenarioList.map((s: any) => ({
        id: s.id,
        count: s.data.tracks.reduce((n: number, t: any) => n + t.actions.length, 0),
      })),
      limitations: [
        '只转换保存的输入坐标，不等于已还原旧版加载后时间编译或屏幕位置',
        '使用当前游戏定义重算；旧 hits、Buff、面板、伤害等快照不迁移',
        '未实现旧自定义行为、连接、继承状态、合约及非中性全局修正',
      ],
    },
  };
}
