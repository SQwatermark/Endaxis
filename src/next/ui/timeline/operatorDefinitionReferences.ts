import type { OperatorDefinition, SkillDefinition } from '../../core/game-data/operatorDefinition';

export type OperatorDefinitionReferenceKind = 'buff' | 'entity';
export type OperatorDefinitionReferenceOwnerKind = 'skill' | 'buff' | 'entity';

export interface OperatorDefinitionReference {
  readonly kind: OperatorDefinitionReferenceKind;
  readonly id: string;
  readonly path: string;
  readonly ownerKind: OperatorDefinitionReferenceOwnerKind;
  readonly ownerId: string;
}

type ReferenceSource = Pick<
  OperatorDefinition,
  'skillGroups' | 'buffDefinitions' | 'abilityEntityDefinitions'
>;

interface ReferenceOwner {
  readonly kind: OperatorDefinitionReferenceOwnerKind;
  readonly id: string;
}

function normalizeSkills(
  skills: OperatorDefinition['skillGroups'][number]['skills'] | undefined,
): readonly SkillDefinition[] {
  if (skills === undefined) return [];
  return Array.isArray(skills) ? skills : [skills as SkillDefinition];
}

function propertyPath(path: string, property: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(property)
    ? `${path}.${property}`
    : `${path}[${JSON.stringify(property)}]`;
}

function collectValueReferences(
  value: unknown,
  path: string,
  owner: ReferenceOwner,
  output: OperatorDefinitionReference[],
): void {
  if (value === null || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectValueReferences(item, `${path}[${index}]`, owner, output),
    );
    return;
  }

  for (const [property, child] of Object.entries(value)) {
    const childPath = propertyPath(path, property);
    if (property === 'buffId' && typeof child === 'string') {
      output.push({
        kind: 'buff',
        id: child,
        path: childPath,
        ownerKind: owner.kind,
        ownerId: owner.id,
      });
    } else if (property === 'buffIds' && Array.isArray(child)) {
      child.forEach((id, index) => {
        if (typeof id !== 'string') return;
        output.push({
          kind: 'buff',
          id,
          path: `${childPath}[${index}]`,
          ownerKind: owner.kind,
          ownerId: owner.id,
        });
      });
    } else if (property === 'abilityEntityId' && typeof child === 'string') {
      output.push({
        kind: 'entity',
        id: child,
        path: childPath,
        ownerKind: owner.kind,
        ownerId: owner.id,
      });
    } else if (property === 'abilityEntityIds' && Array.isArray(child)) {
      child.forEach((id, index) => {
        if (typeof id !== 'string') return;
        output.push({
          kind: 'entity',
          id,
          path: `${childPath}[${index}]`,
          ownerKind: owner.kind,
          ownerId: owner.id,
        });
      });
    }
    collectValueReferences(child, childPath, owner, output);
  }
}

/**
 * Index every stable Buff / ability-entity identity used by an operator's
 * component trees. Registry keys themselves are deliberately not references.
 */
export function collectOperatorDefinitionReferences(
  definition: ReferenceSource,
): readonly OperatorDefinitionReference[] {
  const references: OperatorDefinitionReference[] = [];

  definition.skillGroups.forEach((group, groupIndex) => {
    normalizeSkills(group.skills).forEach((skill, skillIndex) => {
      collectValueReferences(
        skill,
        `skillGroups[${groupIndex}].skills[${skillIndex}]`,
        { kind: 'skill', id: `${group.key}/${skill.key}` },
        references,
      );
    });
    (group.variants ?? []).forEach((variant, variantIndex) => {
      normalizeSkills(variant.skills).forEach((skill, skillIndex) => {
        collectValueReferences(
          skill,
          `skillGroups[${groupIndex}].variants[${variantIndex}].skills[${skillIndex}]`,
          { kind: 'skill', id: `${group.key}/${variant.key}/${skill.key}` },
          references,
        );
      });
    });
  });

  Object.entries(definition.buffDefinitions ?? {}).forEach(([id, buff]) => {
    collectValueReferences(
      buff,
      `buffDefinitions[${JSON.stringify(id)}]`,
      { kind: 'buff', id },
      references,
    );
  });

  Object.entries(definition.abilityEntityDefinitions ?? {}).forEach(([id, entity]) => {
    collectValueReferences(
      entity,
      `abilityEntityDefinitions[${JSON.stringify(id)}]`,
      { kind: 'entity', id },
      references,
    );
  });

  return references;
}

export function referencesToDefinition(
  references: readonly OperatorDefinitionReference[],
  kind: OperatorDefinitionReferenceKind,
  id: string,
): readonly OperatorDefinitionReference[] {
  return references.filter(reference => reference.kind === kind && reference.id === id);
}
