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

The four owner-spawned Context guards still cannot compile end to end because
their tails apply Buffs to, or launch projectiles from, the selected entity.
Entity-target Buff ownership, projectile source identity, explicit entity
finish, and target mutation are not yet exposed. Child SkillData requests currently produce receipts only;
their already-proven damage remains statically projected so the runtime does
not double execute it.

The next safe slice is ability-entity time dilation and Li Zhiyan's positional
spawn-target projection, followed by entity-target Buff ownership. Avywenna's projectile
launch-point semantics, Camille's target mutation, entity-local time dilation, replacement/stacking
policy, and non-numeric entity blackboard values remain blocked until direct
native evidence and consumers are closed. `maxStackingCount` is evidence only
and must not be treated as a guessed replacement rule.
