import type {
  BuffDefinitionProperties,
  CombatBuffSemanticRole,
} from '../../../packages/game-data-contract/src/buffs';
import type { SkillStructureNode } from './skillStructureMindMapModel';
import { replaceStructureValueAtPath, resolveStructureValue } from './skillStructureEditorCommands';

export const BUFF_OPTIONAL_OBJECTS = {
  sustainedProtection: {
    label: '持续保护',
    payload: 'buffProtection',
    create: () => ({ target: 'owner' as const, superArmor: 0, impactResistance: 0 }),
  },
  role: {
    label: '元素语义',
    payload: 'buffRole',
    create: (): CombatBuffSemanticRole => ({ kind: 'elementalAttachment', element: 'heat' }),
  },
  spellBurst: {
    label: '法术爆发参数',
    payload: 'buffSpellBurst',
    create: () => ({
      burstType: '',
      damageType: 'physical' as const,
      skillSettingDataKey: '',
      skillSettingColumn: 1,
      atkScaleBase: 0,
    }),
  },
} as const;
export type BuffOptionalObjectKey = keyof typeof BUFF_OPTIONAL_OBJECTS;
export function appendBuffOptionalObject<T>(document: T, path: string) {
  const key = path.split('.').at(-1) as BuffOptionalObjectKey;
  if (
    !Object.hasOwn(BUFF_OPTIONAL_OBJECTS, key) ||
    resolveStructureValue(document, path) !== undefined
  )
    return;
  return {
    root: replaceStructureValueAtPath(document, path, BUFF_OPTIONAL_OBJECTS[key].create()),
    itemPath: path,
  };
}
export function buildBuffOptionalObjects(
  definition: Pick<BuffDefinitionProperties, BuffOptionalObjectKey>,
): SkillStructureNode[] {
  return (Object.keys(BUFF_OPTIONAL_OBJECTS) as BuffOptionalObjectKey[]).map(key => {
    const config = BUFF_OPTIONAL_OBJECTS[key];
    const exists = definition[key] !== undefined;
    return {
      id: `buff:${key}`,
      sourcePath: key,
      label: config.label,
      kind: exists ? config.label : 'Buff 成员集合',
      summary: exists ? '' : '未设置',
      details: {},
      editorSection: 'overview',
      relationToParent: 'port',
      canCopy: exists,
      canDelete: exists,
      canMove: false,
      children: [],
      ...(exists
        ? { payloadKind: config.payload }
        : { canAddChild: 'buffMember', acceptsChildKind: config.payload }),
    };
  });
}
