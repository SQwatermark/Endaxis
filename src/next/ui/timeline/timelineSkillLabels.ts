/**
 * 统一时间轴技能库与动作块的普攻段标签，避免不同渲染入口各自推导名称。
 * 这里只处理稳定的技能身份；本地化后的“重击”文本由调用方传入。
 */
import type { TimelineSkillLibraryEntryViewModel } from './timelineEditorViewModel';

export function basicAttackSegmentLabel(
  entry: TimelineSkillLibraryEntryViewModel,
  skillKey: string,
  heavyAttackLabel: string,
): string | null {
  if (entry.skillType !== 'basicAttack' || entry.skills.length < 2) return null;
  const index = entry.skills.findIndex(skill => skill.skillKey === skillKey);
  if (index < 0) return null;
  return index === entry.skills.length - 1 ? heavyAttackLabel : `A${index + 1}`;
}
