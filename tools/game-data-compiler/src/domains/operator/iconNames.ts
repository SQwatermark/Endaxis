import { operatorSkillIconFile } from '../../../../../packages/game-data-contract/src/skillIconPaths.ts';

/** 公共武器图标由显示层按武器类型选择，只有专属图标文件名进入定义。 */
export function operatorSkillIconName(iconId: string): string | undefined {
  if (!/^[A-Za-z0-9_-]+$/.test(iconId)) throw new Error(`invalid operator skill icon: ${iconId}`);
  if (iconId === 's' || iconId.startsWith('icon_attack_')) return undefined;
  const native = /^icon_(?:(combo|ultimate)_)?skill_.+_(\d+)$/.exec(iconId);
  if (!native) return iconId;
  const type =
    native[1] === 'combo' ? 'comboSkill' : native[1] === 'ultimate' ? 'ultimate' : 'battleSkill';
  return operatorSkillIconFile(type, native[2]!.padStart(2, '0'))!.replace(/\.webp$/, '');
}
