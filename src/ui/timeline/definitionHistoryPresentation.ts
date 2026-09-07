import type { DefinitionHistoryLocation } from './useDefinitionDraftHistory';

/** 描述已记录的编辑意图，不从当前页面或快照差异反推历史目标。 */
export function describeDefinitionHistory(location: DefinitionHistoryLocation | undefined): string {
  if (!location) return '修改定义';
  const section =
    (
      {
        buffs: 'Buff',
        entities: '能力实体',
        skills: '技能',
        progression: '养成',
        runtime: '角色行为',
        panel: '基础面板',
      } as Record<string, string>
    )[location.section ?? ''] ?? '定义';
  const operation = { add: '新增', duplicate: '复制', remove: '删除', reset: '重置', edit: '修改' }[
    location.operation ?? 'edit'
  ];
  return `${operation}${section}${location.objectId ? `「${location.objectId}」` : ''}`;
}
