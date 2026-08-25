import {
  projectPrimaryAttributeKey,
  type AttributeTypeSource,
} from '../../compiler/attributeModifier.ts';
import type { OperatorTalentNodeSource } from '../../source/operatorTalentNodes.ts';
import type { OperatorPrimaryAttributeSource } from './characterTable.ts';

const TRUST_BREAK_STAGES = [1, 2, 3, 4] as const;
const DEFAULT_TRUST_VALUES = [10, 15, 15, 20] as const;

export {
  parseOperatorTalentNodeSources,
  type OperatorTalentNodeSource,
  type TalentAttributeModifierSource,
  type TalentNodeTypeSource,
} from '../../source/operatorTalentNodes.ts';

export interface CompiledTrustAttributeBonusSource {
  readonly values: readonly number[];
  readonly attributes: readonly OperatorPrimaryAttributeSource[];
}

/**
 * 把四个 Attr 节点投影为 Next 好感属性。全局默认值不重复写入干员定义。
 * 原生节点和 Modifier 已由 source 唯一读取；这里仅负责 OperatorDefinition 的组装规则。
 */
export function compileTrustAttributeBonusSource(
  nodes: readonly OperatorTalentNodeSource[],
  mainAttribute: OperatorPrimaryAttributeSource,
): CompiledTrustAttributeBonusSource | null {
  const byStage = new Map<
    number,
    { readonly attributes: readonly OperatorPrimaryAttributeSource[]; readonly value: number }
  >();
  for (const node of nodes) {
    if (node.nodeType !== 'attribute') continue;
    if (byStage.has(node.breakStage)) {
      throw new Error(`talentNodeMap: duplicate trust break stage ${node.breakStage}`);
    }
    if (node.attributeModifiers.length === 0) {
      throw new Error(`${node.sourcePath}.attributeNodeInfo.attributeModifiers: expected entries`);
    }
    const attributes = node.attributeModifiers.map((modifier, index) => {
      const path = `${node.sourcePath}.attributeNodeInfo.attributeModifiers[${index}]`;
      if (modifier.modifierType !== 'BaseAddition' || modifier.modifyAttributeType !== 'Specific') {
        throw new Error(`${path}: unsupported trust attribute modifier mode`);
      }
      return projectPrimaryAttribute(modifier.attributeType, `${path}.attrType`);
    });
    if (new Set(attributes).size !== attributes.length) {
      throw new Error(`${node.sourcePath}: duplicate trust attribute`);
    }
    const values = node.attributeModifiers.map(modifier => modifier.value);
    if (values.some(value => !Number.isInteger(value))) {
      throw new Error(`${node.sourcePath}: trust attribute value must be an integer`);
    }
    if (new Set(values).size !== 1) {
      throw new Error(`${node.sourcePath}: trust attributes must share one node value`);
    }
    byStage.set(node.breakStage, { attributes, value: values[0]! });
  }
  if (
    byStage.size !== TRUST_BREAK_STAGES.length ||
    TRUST_BREAK_STAGES.some(stage => !byStage.has(stage))
  ) {
    throw new Error(
      `talentNodeMap: expected trust break stages ${JSON.stringify(TRUST_BREAK_STAGES)}, got ${JSON.stringify([...byStage.keys()].sort())}`,
    );
  }
  const ordered = TRUST_BREAK_STAGES.map(stage => byStage.get(stage)!);
  const attributes = ordered[0]!.attributes;
  if (ordered.slice(1).some(item => !sameValues(item.attributes, attributes))) {
    throw new Error('talentNodeMap: trust attributes differ between break stages');
  }
  const values = ordered.map(item => item.value);
  if (sameValues(values, DEFAULT_TRUST_VALUES) && sameValues(attributes, [mainAttribute])) {
    return null;
  }
  return { values, attributes };
}

function projectPrimaryAttribute(
  attribute: AttributeTypeSource,
  path: string,
): OperatorPrimaryAttributeSource {
  const result = projectPrimaryAttributeKey(attribute);
  if (result === null) throw new Error(`${path}: unsupported attribute ${attribute}`);
  return result;
}

function sameValues<T>(left: readonly T[], right: readonly T[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}
