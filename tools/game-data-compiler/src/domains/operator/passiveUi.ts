import type { OperatorPassiveUiDefinition } from '../../../../../packages/game-data-contract/src/operators.ts';

/**
 * CharacterTable 只导出 prefab 身份，组件序列化字段由 1.4.4 当前 bundle 取证。
 * 未知非空 prefab 必须阻断生成，避免把遗留资源或视觉命名猜成行为。
 */
const PASSIVE_UI_BY_PREFAB: Readonly<Record<string, OperatorPassiveUiDefinition>> = {
  OverlayInfoNodeTangTang: { kind: 'numeric', maximum: 2 },
  OverlayInfoNodeLaevat: { kind: 'numeric', maximum: 4, activeAt: 4 },
  OverlayInfoNodeZhuangfy: { kind: 'numeric', maximum: 9, activeAt: 9 },
  OverlayInfoNodeLizhiyan: { kind: 'numeric', maximum: 3 },
  OverlayInfoNodeLiino: {
    kind: 'buffProgress',
    normalBuffId: 'buff_chr_0035_liino_normalskill_music_tag',
    ultimateBuffId: 'buff_chr_0035_liino_ultskill_music_tag',
  },
};

export function compileOperatorPassiveUiDefinition(
  prefabName: string,
  sourcePath: string,
): OperatorPassiveUiDefinition | undefined {
  if (prefabName === '') return undefined;
  const definition = PASSIVE_UI_BY_PREFAB[prefabName];
  if (definition === undefined) {
    throw new Error(`${sourcePath}: unsupported character passive UI prefab '${prefabName}'`);
  }
  return definition;
}
