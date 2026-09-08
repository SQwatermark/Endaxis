import { parseSkillSettings } from '../../core/combat/infliction/skillSettings';
import rawSkillSettings from './skill-setting.generated.json';
import { parseSkillSettingResources } from '../../../packages/game-data-contract/src/skillSettingResources';

/** 当前版本 SkillSetting TypeTree dump 经严格生成器导出的法术配置。 */
const { resources, ...infliction } = rawSkillSettings;
export const skillSettings = parseSkillSettings(infliction);
export const skillSettingResources = parseSkillSettingResources(resources);
