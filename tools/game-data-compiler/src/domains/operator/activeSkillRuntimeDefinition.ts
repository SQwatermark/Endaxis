import type { OperatorActiveSkillTypeSource } from './activeSkills.ts';
import type { SkillPatchSource } from '../../source/skillPatch.ts';
import { requireNonNegativeInteger, requireRecord } from '../../source/primitives.ts';
import {
  compileActiveSkillRuntimeProjectionSource,
  type CompiledActiveSkillRuntimeProjectionSource,
} from '../../compiler/activeSkillRuntimeProjection.ts';
import type {
  CombatActionProjectionContextSource,
  CombatActionProjectionExtensionsSource,
  CompiledBuffDefinitionSource,
} from '../../compiler/buffRuntimeProjection.ts';

type LevelValueSource = number | readonly number[];

export interface CompiledOperatorActiveSkillRuntimeDefinitionSource {
  readonly key: string;
  readonly sourceSkillId: string;
  readonly blackboard: Readonly<Record<string, LevelValueSource>>;
  readonly timelineBlockFrames: number;
  readonly cooldownFrames?: LevelValueSource;
  readonly costs?: readonly {
    readonly resource: 'sp' | 'ultimateEnergy';
    readonly value: LevelValueSource;
  }[];
  readonly costFrame: number;
  readonly scheduledSequences: readonly {
    readonly startFrame: number;
    readonly endFrame: number;
    readonly sequence: CompiledActiveSkillRuntimeProjectionSource['scheduledSequences'][number]['sequence'];
  }[];
}

export function compileOperatorActiveSkillRuntimeDefinitionSource(input: {
  readonly key: string;
  readonly skillType: OperatorActiveSkillTypeSource;
  readonly value: unknown;
  readonly sourcePath: string;
  readonly patch: SkillPatchSource | null;
  readonly context: CombatActionProjectionContextSource;
  readonly visualOnlyIds?: ReadonlySet<string>;
  readonly extensions?: CombatActionProjectionExtensionsSource;
}): CompiledOperatorActiveSkillRuntimeDefinitionSource {
  const runtime = compileActiveSkillRuntimeProjectionSource(input);
  const root = requireRecord(input.value, input.sourcePath);
  const cast = requireRecord(root.castData, `${input.sourcePath}.castData`);
  const costFrame = requireNonNegativeInteger(
    cast.startCdFrame,
    `${input.sourcePath}.castData.startCdFrame`,
  );
  const definition: CompiledOperatorActiveSkillRuntimeDefinitionSource = {
    key: input.key,
    sourceSkillId: runtime.skillId,
    blackboard: Object.fromEntries(
      Object.entries(runtime.blackboard.values).map(([key, values]) => [key, collapse(values)]),
    ),
    timelineBlockFrames: runtime.timelineBlockFrames,
    costFrame,
    scheduledSequences: runtime.scheduledSequences.map(item => ({
      startFrame: item.startFrame,
      endFrame: item.endFrame,
      sequence: item.sequence,
    })),
  };
  const patch = input.patch;
  if (!patch) return definition;
  if (patch.cooldownSeconds.some(value => value !== 0)) {
    const frames = patch.cooldownSeconds.map((value, index) => {
      const frame = value * 30;
      if (!Number.isInteger(frame) || frame < 0)
        throw new Error(
          `${input.sourcePath}: cooldown level ${patch.levels[index]} is not frame-exact`,
        );
      return frame;
    });
    Object.assign(definition, { cooldownFrames: collapse(frames) });
  }
  if (patch.costValues.some(value => value !== 0)) {
    const expected =
      input.skillType === 'battleSkill'
        ? ({ type: 1, resource: 'sp' } as const)
        : input.skillType === 'ultimate'
          ? ({ type: 0, resource: 'ultimateEnergy' } as const)
          : null;
    if (!expected || patch.costTypes.some(value => value !== expected.type))
      throw new Error(`${input.sourcePath}: non-zero cost does not match stable skill type`);
    Object.assign(definition, {
      costs: [{ resource: expected.resource, value: collapse(patch.costValues) }],
    });
  }
  return definition;
}

export function renderOperatorActiveSkillRuntimeDefinitionSource(input: {
  readonly operatorSlug: string;
  readonly definition: CompiledOperatorActiveSkillRuntimeDefinitionSource;
  readonly supplementalBuffDefinitions?: Readonly<Record<string, CompiledBuffDefinitionSource>>;
}) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.operatorSlug))
    throw new Error('operatorSlug: expected stable kebab-case identity');
  return {
    relativePath: `${input.operatorSlug}.${input.definition.key}.runtime.generated.ts`,
    content: `/** 由 tools/game-data-compiler 从完整主动 SkillData 动作图生成；不要手工编辑。 */\nimport type {\n  OperatorBuffDefinitions,\n  SkillDefinition,\n} from '../../../../core/game-data/operatorDefinition';\n\n// prettier-ignore\nexport const supplementalBuffDefinitions = ${JSON.stringify(input.supplementalBuffDefinitions ?? {}, null, 2)} as const satisfies OperatorBuffDefinitions;\n\n// prettier-ignore\nexport default ${JSON.stringify(input.definition, null, 2)} as const satisfies SkillDefinition;\n`,
  };
}

function collapse(values: readonly number[]): LevelValueSource {
  return values.every(value => value === values[0]) ? values[0]! : [...values];
}
