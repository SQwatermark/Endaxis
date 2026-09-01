import type { OperatorPassiveUiDefinition } from '../../../../../packages/game-data-contract/src/operators.ts';
import {
  compileOperatorPassiveUiPrefabComponent,
  type OperatorPassiveUiPrefabComponentEvidence,
} from './passiveUiPrefab.ts';
import { OPERATOR_PASSIVE_UI_COMPONENT_BY_PREFAB } from '../../source/operatorPassiveUiPrefabCatalog.generated.ts';

/**
 * 1.4.4 原生 prefab 中专用 UICharPassive 组件的窄字段投影。几何和动画不混入这里；
 * 后续资源导出入口会从同一 prefab 快照重新生成这份证据。
 * 未知非空 prefab 必须阻断生成，避免把遗留资源或视觉命名猜成行为。
 */
export function compileOperatorPassiveUiDefinition(
  prefabName: string,
  sourcePath: string,
): OperatorPassiveUiDefinition | undefined {
  if (prefabName === '') return undefined;
  const evidence = (
    OPERATOR_PASSIVE_UI_COMPONENT_BY_PREFAB as Readonly<
      Record<string, OperatorPassiveUiPrefabComponentEvidence>
    >
  )[prefabName];
  if (evidence === undefined) {
    throw new Error(`${sourcePath}: unsupported character passive UI prefab '${prefabName}'`);
  }
  return compileOperatorPassiveUiPrefabComponent(evidence, sourcePath);
}
