import { describe, expect, it } from 'vitest';
import type { SkillDefinition } from '../../core/game-data/operatorDefinition';
import {
  appendCombatStepAtSequencePath,
  duplicateCombatStepAtPath,
  insertStructureArrayItem,
  moveStructureArrayItem,
  moveCombatStepAtPath,
  removeCombatStepAtPath,
  replaceCombatStepAtPath,
  resolveSkillStructureValue,
} from './skillStructureEditorCommands';

function skill(): SkillDefinition {
  return {
    key: 'test',
    timelineBlockFrames: 10,
    scheduledSequences: [
      {
        startFrame: 0,
        sequence: {
          steps: [
            {
              kind: 'conditional',
              parameters: { condition: { kind: 'combatActive' } },
              whenTrue: { steps: [{ kind: 'finishCurrentAbilityEntity', parameters: {} }] },
            },
          ],
        },
      },
    ],
  };
}

describe('skillStructureEditorCommands', () => {
  const branchPath = 'scheduledSequences[0].sequence.steps[0].whenTrue';
  const stepPath = `${branchPath}.steps[0]`;

  it('edits a nested sequence by structural source path without mutating the input', () => {
    const input = skill();
    const appended = appendCombatStepAtSequencePath(input, branchPath, {
      kind: 'finishCurrentAbilityEntity',
      parameters: {},
    });
    expect(
      (resolveSkillStructureValue(appended.skill, branchPath) as { steps: unknown[] }).steps,
    ).toHaveLength(2);
    expect(resolveSkillStructureValue(input, branchPath)).toMatchObject({ steps: [{}] });
    expect(appended.stepPath).toBe(`${branchPath}.steps[1]`);
  });

  it('replaces, duplicates, moves, and removes nested steps', () => {
    const replaced = replaceCombatStepAtPath(skill(), stepPath, {
      kind: 'finishCurrentAbilityEntityWhenSourceDies',
      parameters: {},
    });
    expect((resolveSkillStructureValue(replaced, stepPath) as { kind: string }).kind).toBe(
      'finishCurrentAbilityEntityWhenSourceDies',
    );
    const duplicated = duplicateCombatStepAtPath(replaced, stepPath, value => ({ ...value }));
    expect(duplicated.stepPath).toBe(`${branchPath}.steps[1]`);
    const moved = moveCombatStepAtPath(duplicated.skill, duplicated.stepPath, -1);
    expect(moved.stepPath).toBe(stepPath);
    expect(
      (
        resolveSkillStructureValue(removeCombatStepAtPath(moved.skill, stepPath), branchPath) as {
          steps: unknown[];
        }
      ).steps,
    ).toHaveLength(1);
  });

  it('moves steps across branch containers and inserts clipboard values at an explicit target', () => {
    const input = skill();
    const sourcePath = 'scheduledSequences[0].sequence.steps[0]';
    const targetArrayPath = `${sourcePath}.whenFalse.steps`;
    const inserted = insertStructureArrayItem(input, targetArrayPath, {
      kind: 'finishCurrentAbilityEntity',
      parameters: {},
    });
    expect(inserted.itemPath).toBe(`${targetArrayPath}[0]`);

    const moved = moveStructureArrayItem(
      inserted.root,
      `${sourcePath}.whenTrue.steps[0]`,
      targetArrayPath,
      0,
    );
    expect(moved.itemPath).toBe(`${targetArrayPath}[0]`);
    expect(
      (resolveSkillStructureValue(moved.root, `${sourcePath}.whenTrue`) as { steps: unknown[] })
        .steps,
    ).toHaveLength(0);
    expect(
      (resolveSkillStructureValue(moved.root, `${sourcePath}.whenFalse`) as { steps: unknown[] })
        .steps,
    ).toHaveLength(2);
  });
});
