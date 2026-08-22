import { parseSkillSettings } from '../../core/combat/infliction/skillSettings';
import rawSkillSettings from './skill-setting.combat-1.4.4.json';

/** AnimeStudio TypeTree Dump 经 combat-spec 严格导出的 1.4.4 全局法术配置。 */
export const skillSettings = parseSkillSettings(rawSkillSettings);
