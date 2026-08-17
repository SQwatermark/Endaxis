# Ability-entity Context target audit

## Scope

This audit covers the four current `ForEachAction` samples whose direct first
child is a sequence guard and whose collection is read from `Context`. The
paired data baseline is AKEDB `1.4.4@9433094-12` with the public JSON
`sharedRevision` from 2026-08-15.

## Native single-target evidence

The desktop installation's `GameAssembly.dll` was checked against the IL2CPP
metadata dump for Gameplay.Beyond 1.4.4. The module SHA-256 is
`0C5573679BC6DEC2D068A14335466DB7CCF20AF9BAE2B983FB9D45677D80FFCE`.
`SetAbilityEntityDuration.ExecuteInternal` is at RVA `0x06D27A54` and
`_ApplyDurationToTarget` is at RVA `0x0158B1C0`.

The control flow distinguishes the two modes directly:

- `setMultipleTarget=true` calls `AbilityActionUtils.GetTargets_Dispose`
  (RVA `0x0354D020`), enumerates the returned handle, and applies the duration
  operation to every item;
- `setMultipleTarget=false` calls the singular
  `AbilityActionUtils.GetActionTarget` (RVA `0x035F1160`) with
  `actionTargetType` and `targetContextKey`, then invokes
  `_ApplyDurationToTarget` exactly once.

This proves that the false branch is single-target. It does not prove which
item native code chooses when a named Context contains multiple entries; that
selection remains intentionally unmodeled.

All four collections are written immediately beforehand by
`FindTargetAction`. The selector is not an enemy finder: it is
`OwnerSpawnedEntityFinder(spawnedObjectType=AbilityEntity)` followed by one
`TagValidator(HasAny)` query.

| SkillData                             | Timeline | Frames | Context group      |  GameplayTag | Guard tail                                            |
| ------------------------------------- | -------: | -----: | ------------------ | -----------: | ----------------------------------------------------- |
| `chr_0012_avywen_normal_skill.json`   |        8 |    0–6 | `lances`           | `-549424863` | apply ready Buff                                      |
| `chr_0012_avywen_normal_skill.json`   |        9 |   7–10 | `ComboLances`      | `1447025331` | apply call Buff, find launch point, launch projectile |
| `chr_0012_avywen_normal_skill.json`   |       10 |   7–10 | `UltiLances`       | `-922203198` | apply call Buff, find launch point, launch projectile |
| `chr_0027_tangtang_normal_skill.json` |       18 |  44–45 | `normalwater_move` |   `77793925` | apply movement Buff                                   |

Each loop compares `Owner` to its current `Target` with
`CheckDistanceCondition(distance=50, lessThan=true, includeTargetRadius=false)`.
The native `lessThan=true` boundary is `<=`, as established by the distance
condition evidence already used by the generator.

## Implemented evidence boundary

`TargetGroupWriteSource` now preserves two facts that were previously reduced
to selector type names:

- `finderSpawnedObjectType`, which is `AbilityEntity` for these writes;
- the ordered native tag queries, including query type and signed GameplayTag
  IDs.

The parser validates the complete observed field shape of
`OwnerSpawnedEntityFinder` and `TagValidator`. Unknown fields, unknown query
types, non-integer tag IDs, or incomplete identities still fail closed. The
helper `target_group_write_ability_entity_collection_identity` recognizes only
owner-spawned AbilityEntity collections whose full validator list consists of
the captured tag queries.

This identity is deliberately distinct from `enemy` and `party`. It does not
assert that any matching entity exists, where it is located, whether it is
alive, or how long it persists.

## Template evidence and minimal model

The desktop VFS manifest `451359` contains 54 of the 55 unique character
AbilityEntity template IDs referenced by the paired SkillData corpus. The
strict extractor in `scripts/extract_next_ability_entities` resolves the raw
Unity assets and records their hashes, born tags, lifetime fields, stacking
metadata and component references in
`src/next/data/ability-entities/ability-entity-templates-1.4.4.json`. The one
explicitly unresolved reference is
`abilityentity_chr_0035_liino_ult_skill_projhit`; it remains absent from the
current manifest and is not synthesized.

The extracted native lifetime values are declared in the artifact as
`limited=0` and `infinite=1`. This mapping is based on the IL2CPP enum ordering
and cross-checked against the corpus: 53 finite templates use native value 0,
while Laevatain's dungeon entity is the only value-1 sample and also carries
the 99999-second sentinel. Blackboard-backed duration and stacking fields are
preserved rather than frozen.

Under Endaxis Next's accepted simplification, the runtime now uses one
scene-wide logical directory with no coordinates, collision, rotation or
navigation. Every range lookup sees every active instance and every distance
comparison uses zero. An instance still preserves stable identity, template,
owner, source, target, child SkillData identity, born tags, remaining and
elapsed lifetime, entity blackboard, and `dieWhenSourceDies`. This is enough to
model state ownership and later queries without introducing a spatial object
hierarchy.

`spawnAbilityEntity` is now a strict DSL/compiler/runtime operation. The
standard simulation owns and ticks the directory, and emits spawn, child-skill
request and finish receipts. The generator emits this operation only when the
native source, target, duration and numeric blackboard assignments fit the
proven zero-space subset. Current production output contains four such spawn
sites across Arclight, Gilberta and Lifeng; audit-only Zhuang Fangyi output also
contains converted sites.

## Remaining behavior boundary

The DSL/runtime now exposes one unified owner/tag lookup operation. It writes
the complete matching group to the cast-local target Context and can write its
count to the action blackboard, where the existing `actionValueCompare`
condition handles native count comparisons. Thus lookup and count no longer
need a second condition system.

The runtime now also exposes synchronous iteration over the stable handles in
a Context group. Each body receives one explicit `currentTarget`; it can read,
compare, and assign that entity's finite remaining lifetime. A body returning
false is rejected because the native rule for continuing or stopping across
items has not yet been proven. This lets the generator use the structure only
after its per-item guard has been proven true under the zero-distance model.

The paired character SkillData corpus contains 10
`SetAbilityEntityDuration`, 2 `CheckAbilityEntityCurDuration`, and 1
`SetAbilityEntityTarget` actions. The duration shapes are unusually narrow:

- both checks are Zhuang Fangyi `LT 3.0`, target the input entity, and do not
  save the current duration to a blackboard key;
- both Zhuang assignments target the input entity, use literal `3.0`, set
  `setMultipleTarget=false`, and use `Assign`;
- Li Zhiyan has eight Context assignments over `bunshin1` through `bunshin4`,
  first assigning `0.5` and later `30.0`; all also use
  `setMultipleTarget=false` and `Assign`;
- Camille supplies the only `SetAbilityEntityTarget` sample. Its mutation
  semantics remain outside this slice.

The generator now strictly parses the two observed duration checks and all 10
duration assignments. Zhuang Fangyi's `Context` ForEach groups are preserved
as stable-handle iteration; their `Target + LT` guard and `InputTarget +
Assign` tail compile to the same minimal runtime operations. Unknown fields,
comparisons, mutations, duration saving, and `setMultipleTarget=true` fail
closed. A generator regression covers the complete parse-to-DSL shape, and a
corpus check validates all 10 assignment payloads.

The compiler now accepts a named `ContextTarget` assignment only with static
singleton provenance. A guaranteed logical `SpawnAbilityEntity` writes one
stable handle through `setSingle`; subsequent actions in native sequence order
may therefore reuse the existing `forEachContextTarget` operation as a 0/1
adapter. The compiler rejects a key with no preceding guaranteed spawn and
conservatively excludes keys also used by ordinary target-group writers. It
does not introduce a first-item rule for a general collection.

Li Zhiyan's `bunshin1` through `bunshin4` each have one unconditional spawn
producer before both sets of duration assignments. The compiler deliberately
does not grant singleton provenance until the corresponding logical spawn can
itself compile; Li's positional spawn target still needs its zero-space
projection closed before the four steps enter formal output. The eight
assignments therefore remain visible in typed audit evidence rather than being
claimed as an end-to-end compiled skill.

The next parser blocker was also narrowed correctly: `effectTargets` belongs
to `TimeDilationAction`, not the presentation-only `EffectAction`. The audit
model now preserves owner-spawned AbilityEntity queries, including optional
GameplayTag filters, while the DSL compiler explicitly rejects them until
entity clocks and their child-skill timing are modeled. This moves Li Zhiyan,
Tangtang, Liino and Yvonne's combo skills from parser failure to the same named
runtime capability gap. The paired full audit is now 318 parsed / 280 compiled.

Direct IL2CPP evidence now closes the first half of that runtime gap.
`TimeDilationAction.ExecuteInternal` is at RVA `0x042D8710`,
`TimeDilationManager.StartEntityTimeDilation` at RVA `0x038CF9B0`,
`EntityTimeDilationInst.Reset` at RVA `0x038CF810`, and
`EntityTimeDilationInst.OnTick` at RVA `0x038D08D0` in the same hashed desktop
module. When `layer == Entity`, the action enumerates every resolved
`effectTargets` selection, obtains each target Entity, and starts a distinct
entity time-dilation instance. The instance retains the target Entity,
duration, curve, slot, priority and elapsed time; each tick evaluates the curve
and installs the resulting time-scale handle on that Entity. This is gameplay
entity time, not a visual-only curve.

The shared time-dilation runtime therefore now keys local instances by a
generic stable entity ID. Existing operator clocks use the same API through a
compatibility method, while a logical AbilityEntity uses
`ability-entity:<instanceId>`. The standard combat assembly consumes that
entity's composed local/global scale when advancing its finite lifetime. An
assembly-level regression proves that a constant 0.5 entity scale consumes
only 0.5 seconds of a one-second logical lifetime over 30 raw frames.

The same source actions also exposed a second, previously inert boundary:
global and ultimate time dilation frequently list owner-spawned AbilityEntities
in `ignoreTargets`. Dropping those targets had no effect before logical entity
time existed, but would now incorrectly slow their lifetime. The parser and
generated audit model therefore preserve the full ignored queries rather than
only an omitted count. The formal DSL/runtime accepts both owner-spawned
queries (with an optional single native tag validator) and stable handles from
a named cast Context. Queries are resolved when the action executes, and every
resolved entity ID is added to the global exclusion set. Existing generated
operator skills have been regenerated with these exclusions.

The same query protocol is available to entity-scope time dilation and is
covered through the standard combat assembly, including owner/tag filtering.
This closes target selection and finite-lifetime participation without adding
space or a second entity hierarchy.

The formal DSL, compiler and runtime now close the execution half of this gap.
A spawn may carry an embedded, level-resolved child timeline with no separate
cast, cost or cooldown model. Every logical entity owns an independent
timeline cursor and sequence interpreter, reads its entity blackboard as the
child action-blackboard fallback, advances on the same composed local/global
delta as its lifetime, and ends active interval sequences when the entity is
finished. Assembly regressions prove that a child action at local frame 2 fires
after four raw frames under a constant 0.5 entity scale.

The generator now performs that ownership transfer for one strict subset: the
child must inherit its source action blackboard, have no cycle, projectile,
nested entity, Aura, Buff, resource or other unowned action, and its remaining
actions must be damage, already-projected fixed interval damage, infliction or
a condition tree accepted by the shared compiler. Interval condition carriers
whose execution frames were already projected are omitted rather than executed
twice. Arclight's ultimate child now owns local
frames 7 and 63; Lifeng's owns 6, 66, 67 and 121, including its local
blackboard branch. Their old parent-absolute entries are removed in the same
generation pass, and a generated contract asserts the absence of both old
Arclight frames. Native `assignBlackboard=true` is represented explicitly by
copying the spawning action blackboard before applying per-key entity
assignments. The same migration now covers Zhuang Fangyi basic attacks 2 and 4
in audit output, preserving their float32-projected local interval frames while
removing parent frames 24, 26 and 29 from basic attack 2.

This partial migration still does not justify generator compilation of
`effectAbilityEntityTargets` for the four blocked combo skills. An owner/tag
query can select entities created by other skills, so the compiler needs an
operator-wide proof that every matching spawn uses dynamic child ownership;
the current per-skill subset is insufficient. Enabling the target earlier
would still leave some selected child actions on parent clocks. The generator
therefore continues to fail closed and audit coverage remains 318 parsed / 280
compiled.

The four owner-spawned Context guards still cannot compile end to end because
their tails apply Buffs to, or launch projectiles from, the selected entity.
Entity-target Buff ownership, projectile source identity, explicit entity
finish, and target mutation are not yet exposed. Child SkillData requests currently produce receipts only;
their already-proven damage remains statically projected so the runtime does
not double execute it.

The next safe slice is dynamic child-SkillData ownership/scheduling or Li
Zhiyan's positional spawn-target projection, followed by entity-target Buff
ownership. Avywenna's projectile launch-point semantics, Camille's target
mutation, replacement/stacking policy, and non-numeric entity blackboard
values remain blocked until direct native evidence and consumers are closed.
`maxStackingCount` is evidence only and must not be treated as a guessed
replacement rule.
