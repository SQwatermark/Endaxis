/**
 * Next UI 对旧版游戏文本查询接口的集中适配。
 *
 * Next 组件只从这里读取本地化后的游戏内容，避免直接依赖旧版数据模块。未来建立
 * Next 原生的按需文本仓库后，只需替换本文件的委托实现，不必逐个修改选择器和编辑弹窗。
 */
export {
  getGameAttributeName,
  getGameClassName,
  getGameElementName,
  getGameSlotTypeName,
  getGameWeaponTypeName,
  getEnemyGameName,
  getGearPieceGameName,
  getGearSetGameDescription,
  getGearSetGameName,
  getOperatorCombatSkillDescription,
  getOperatorCombatSkillName,
  getOperatorGameName,
  getOperatorPotentialDescription,
  getOperatorPotentialName,
  getOperatorTalentDescription,
  getOperatorTalentName,
  getOperatorUiLabel,
  getWeaponGameName,
  getWeaponSkillDescription,
  getWeaponSkillName,
  getWeaponUiLabel,
} from '@/data/gameText';
