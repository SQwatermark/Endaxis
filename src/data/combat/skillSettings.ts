import { parseSkillSettings } from '../../core/combat/infliction/skillSettings';
import rawSkillSettings from './skill-setting.generated.json';

/** 当前版本 SkillSetting TypeTree dump 经严格生成器导出的法术配置。 */
export const skillSettings = parseSkillSettings(rawSkillSettings);
