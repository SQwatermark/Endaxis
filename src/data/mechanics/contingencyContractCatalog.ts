import catalog from './contingency-contract-catalog.generated.json';
import {
  contingencyContractBlockedTagReasons,
  contingencyContractOmittedTagReasons,
} from './generated/contingencyContractDefinitions.generated';
import { CONTINGENCY_CONTRACT_MECHANIC_PREFIX } from './contingencyContractAdapter';
import { contingencyContractInitializationPlans } from './generated/contingencyContractDefinitions.generated';
import { contingencyContractEnemyMaxHealthPlans } from './generated/contingencyContractDefinitions.generated';

export type ContingencyContractTagSupport = 'supported' | 'blocked' | 'omitted';

export interface ContingencyContractTagPresentation {
  readonly tagId: number;
  readonly columnId: string;
  readonly groupId: number;
  readonly conflictId: string;
  readonly score: number;
  readonly keyId: string;
  readonly lockIds: readonly string[];
  readonly romanNumSuffix: string;
  readonly iconPath: string;
  readonly localization: Readonly<Record<'zh' | 'en', { name: string; description: string }>>;
  readonly terms: readonly {
    readonly blackboard: readonly { readonly key: string; readonly value: number }[];
  }[];
  readonly support: ContingencyContractTagSupport;
  readonly supportReason?: string;
}

const supportedIds = new Set([
  ...contingencyContractInitializationPlans.map(plan => plan.tagId),
  ...contingencyContractEnemyMaxHealthPlans.map(plan => plan.tagId),
]);
const tagById = new Map(catalog.tags.map(tag => [tag.tagId, tag]));
const contract = catalog.contracts[0];
if (contract === undefined) throw new Error('Contingency Contract catalog has no contract');

export const contingencyContractTags: readonly ContingencyContractTagPresentation[] = Object.freeze(
  contract.columns.flatMap(column =>
    column.entries.map(entry => {
      const tag = tagById.get(entry.tagId);
      if (tag === undefined) throw new Error(`Contingency Contract tag ${entry.tagId} is missing`);
      const support: ContingencyContractTagSupport = supportedIds.has(tag.tagId)
        ? 'supported'
        : Object.hasOwn(contingencyContractBlockedTagReasons, tag.tagId)
          ? 'blocked'
          : 'omitted';
      const supportReason =
        support === 'blocked'
          ? contingencyContractBlockedTagReasons[tag.tagId]
          : support === 'omitted'
            ? contingencyContractOmittedTagReasons[tag.tagId]
            : undefined;
      return Object.freeze({
        tagId: tag.tagId,
        columnId: column.id,
        groupId: entry.groupId,
        conflictId: entry.conflictId,
        score: tag.score,
        keyId: entry.keyId,
        lockIds: Object.freeze([...entry.lockIds]),
        romanNumSuffix: tag.romanNumSuffix,
        iconPath: `/contingency_contract/1/${tag.icon}.webp`,
        localization: tag.localization,
        terms: tag.terms,
        support,
        ...(supportReason === undefined ? {} : { supportReason }),
      });
    }),
  ),
);

export function contingencyContractMechanicId(tagId: number): string {
  return `${CONTINGENCY_CONTRACT_MECHANIC_PREFIX}${tagId}`;
}

export function isContingencyContractTagLocked(
  selectedTagIds: readonly number[],
  tagId: number,
): boolean {
  const target = contingencyContractTags.find(tag => tag.tagId === tagId);
  if (target === undefined || selectedTagIds.includes(tagId) || target.lockIds.length === 0) {
    return false;
  }
  const selectedKeys = new Set(
    contingencyContractTags
      .filter(tag => selectedTagIds.includes(tag.tagId) && tag.keyId !== '')
      .map(tag => tag.keyId),
  );
  return target.lockIds.some(keyId => !selectedKeys.has(keyId));
}

/** 同一原生 conflictId 的不同等级互斥；其他已选词条保持原顺序。 */
export function toggleContingencyContractTag(
  selectedTagIds: readonly number[],
  tagId: number,
): readonly number[] {
  const target = contingencyContractTags.find(tag => tag.tagId === tagId);
  if (target === undefined) return selectedTagIds;
  if (selectedTagIds.includes(tagId)) return selectedTagIds.filter(id => id !== tagId);
  if (isContingencyContractTagLocked(selectedTagIds, tagId)) return selectedTagIds;
  const conflictingIds = new Set(
    contingencyContractTags
      .filter(tag => tag.conflictId !== '' && tag.conflictId === target.conflictId)
      .map(tag => tag.tagId),
  );
  return [...selectedTagIds.filter(id => !conflictingIds.has(id)), tagId];
}
