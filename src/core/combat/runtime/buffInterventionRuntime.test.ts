import { expect, it } from 'vitest';
import type { ResolvedSkillBuffDefinition } from '../../compiler/combatProgram';
import { BuffDefinitionOperationTarget } from '../buffs/buffDefinitionOperationTarget';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer } from '../buffs/combatBuffs';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import {
  BuffInterventionRuntime,
  createBuffInterventionState,
  type CompiledBuffIntervention,
} from './buffInterventionRuntime';

const reference = { kind: 'common', sourceId: 'common', buffId: 'signal' } as const;
const definition: ResolvedSkillBuffDefinition = {
  stackingType: 'refresh',
  durationSeconds: 20,
  applyTags: [],
  extendTags: [],
  blackboard: {},
  attributeModifiers: [],
};
const apply = (id: string, frame: number): CompiledBuffIntervention => ({
  id,
  kind: 'apply',
  frame,
  buff: reference,
  target: { kind: 'enemy' },
  sourceOperatorId: 'caster',
  definition,
});
function fixture(
  plans: readonly CompiledBuffIntervention[],
  saved = createBuffInterventionState(),
) {
  let frame = 0;
  const container = new CombatBuffContainer('enemy', new CombatAttributeSet<string>());
  const target = new BuffDefinitionOperationTarget(container, {
    get: () => undefined,
    compile: entry => ({
      id: entry.id,
      stackingType: entry.stackingType,
      durationSeconds: entry.durationSeconds,
    }),
  });
  const receipt = new CombatReceiptCollector();
  const runtime = new BuffInterventionRuntime(
    { plans, provenance: [{ reference, definitionOwnerIds: ['caster'] }] },
    saved,
    () => frame,
    id => (id === 'enemy' ? target : undefined),
    receipt,
  );
  target.configureAdmission(request => runtime.admit(request));
  return {
    container,
    target,
    receipt,
    runtime,
    setFrame: (value: number) => {
      frame = value;
    },
  };
}

it('applies suppression before same-frame manual/natural attempts with exclusive end and no replay', () => {
  const plans: CompiledBuffIntervention[] = [
    apply('existing', 0),
    apply('blocked', 1),
    apply('allowed', 3),
    {
      id: 'suppress',
      kind: 'suppress',
      startFrame: 1,
      endFrame: 3,
      buff: reference,
      target: { kind: 'enemy' },
    },
  ];
  const f = fixture(plans);
  f.runtime.applyCurrentFrame();
  const existing = f.runtime.state.applications.get('existing')!;
  f.setFrame(1);
  f.runtime.applyCurrentFrame();
  expect(f.runtime.state.applications.has('blocked')).toBe(false);
  expect(f.target.resolveHandle(existing)?.isFinished).toBe(false);
  expect(f.container.add({ id: 'signal', stackingType: 'unique' }, 'caster')).toBeNull();
  expect(f.target.getCountByIds(['signal'])).toBe(1);
  f.setFrame(3);
  f.runtime.applyCurrentFrame();
  expect(f.runtime.state.applications.get('allowed')).toEqual(existing);
  expect(
    f.receipt.entries.filter(x => x.data?.interventionId === 'allowed').map(x => x.data?.result),
  ).toEqual(['refreshed']);
  f.runtime.applyCurrentFrame();
  expect(f.receipt.entries.filter(x => x.data?.interventionId === 'allowed')).toHaveLength(1);
});

it('ends only the returned instance and preserves shared refresh references in copied state', () => {
  const plans: CompiledBuffIntervention[] = [
    apply('first', 0),
    apply('refresh', 1),
    { id: 'finish', kind: 'finish', frame: 2, applicationId: 'refresh' },
  ];
  const f = fixture(plans);
  f.runtime.applyCurrentFrame();
  f.setFrame(1);
  f.runtime.applyCurrentFrame();
  const saved = structuredClone(f.runtime.state);
  expect(saved.applications.get('first')).toEqual(saved.applications.get('refresh'));
  const restored = new BuffInterventionRuntime(
    f.runtime.program,
    saved,
    () => 2,
    id => (id === 'enemy' ? f.target : undefined),
    f.receipt,
  );
  const unrelated = f.container.add({ id: 'other', stackingType: 'unlimited' }, 'caster')!;
  restored.applyCurrentFrame();
  expect(f.target.resolveHandle(saved.applications.get('refresh')!)?.isFinished).toBe(true);
  expect(unrelated.isFinished).toBe(false);
  expect(f.receipt.entries.at(-1)?.data?.result).toBe('finished');
});

it('reports non-finishable and naturally missing references without deleting state', () => {
  const plans: CompiledBuffIntervention[] = [
    apply('apply', 0),
    { id: 'finish', kind: 'finish', frame: 1, applicationId: 'apply' },
    { id: 'missing', kind: 'finish', frame: 1, applicationId: 'unknown' },
  ];
  const f = fixture(plans);
  f.runtime.applyCurrentFrame();
  f.container
    .getInstance(f.runtime.state.applications.get('apply')!.instanceId)!
    .setFinishable(false);
  f.setFrame(1);
  f.runtime.applyCurrentFrame();
  expect(f.receipt.entries.slice(-2).map(x => x.data?.result)).toEqual([
    'notFinishable',
    'notFound',
  ]);
  expect(f.target.getCountByIds(['signal'])).toBe(1);
});
