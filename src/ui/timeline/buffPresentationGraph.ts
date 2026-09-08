import type {
  BuffDefinitionProperties,
  CombatBuffPresentation,
} from '../../../packages/game-data-contract/src/buffs';
import type { SkillStructureNode } from './skillStructureMindMapModel';
import {
  insertStructureArrayItem,
  replaceStructureValueAtPath,
  resolveStructureValue,
} from './skillStructureEditorCommands';

export function appendBuffPresentationChild<T>(document: T, path: string) {
  if (/(?:^|\.)childPresentations$/.test(path))
    return insertStructureArrayItem(document, path, { buffId: '', presentation: {} });
  if (resolveStructureValue(document, path) !== undefined) return;
  if (/(?:^|\.)presentation$/.test(path))
    return { root: replaceStructureValueAtPath(document, path, {}), itemPath: path };
  if (/(?:^|\.)presentation\.orderPriority$/.test(path))
    return {
      root: replaceStructureValueAtPath(document, path, {
        useDirectoryValue: false,
        value: 0,
        category: '',
      }),
      itemPath: path,
    };
}

export function buildBuffPresentationGraph(
  definition: Pick<BuffDefinitionProperties, 'presentation' | 'childPresentations'>,
): SkillStructureNode[] {
  const base = (path: string, label: string): SkillStructureNode => ({
    id: `buff:${path}`,
    sourcePath: path,
    label,
    kind: 'Buff 成员集合',
    summary: '',
    details: {},
    editorSection: 'overview',
    relationToParent: 'port',
    canCopy: false,
    canMove: false,
    canDelete: false,
    children: [],
  });
  const presentation = (
    path: string,
    value: CombatBuffPresentation | undefined,
    required = false,
  ): SkillStructureNode => ({
    ...base(path, '表现'),
    ...(value === undefined
      ? {
          canAddChild: 'buffMember' as const,
          acceptsChildKind: 'buffPresentation' as const,
          summary: '未设置',
        }
      : {
          kind: 'Buff 表现',
          payloadKind: 'buffPresentation' as const,
          canCopy: true,
          canDelete: !required,
          children: [
            {
              ...base(`${path}.orderPriority`, '排序优先级'),
              ...(value.orderPriority === undefined
                ? {
                    canAddChild: 'buffMember' as const,
                    acceptsChildKind: 'buffPresentationOrder' as const,
                    summary: '未设置',
                  }
                : {
                    kind: '表现排序',
                    payloadKind: 'buffPresentationOrder' as const,
                    canCopy: true,
                    canDelete: true,
                  }),
            },
          ],
        }),
  });
  return [
    presentation('presentation', definition.presentation),
    {
      ...base('childPresentations', '子 Buff 表现'),
      canAddChild: 'buffMember',
      acceptsChildKind: 'buffChildPresentation',
      children: (definition.childPresentations ?? []).map((child, index) => ({
        ...base(`childPresentations[${index}]`, `子表现 ${index + 1}`),
        kind: '子 Buff 表现',
        summary: child.buffId,
        payloadKind: 'buffChildPresentation',
        relationToParent: 'member',
        canCopy: true,
        canMove: true,
        canDelete: true,
        children: [
          presentation(`childPresentations[${index}].presentation`, child.presentation, true),
        ],
      })),
    },
  ];
}
