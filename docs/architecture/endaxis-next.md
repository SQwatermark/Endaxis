# Endaxis Next architecture

## Goal

`src/next` is a parallel implementation of the editor and combat simulator. It is built without changing the current `/timeline` entry and will replace that entry only after compatibility and behavior checks pass.

The new implementation shares game data with the existing application, but it does not share the current timeline store, simulation engine, persistence types, or UI state.

## Dependency boundary

```text
src/data
   |
   v
src/next/adapters        legacy sheet -> normalized game definition
   |
   v
src/next/core            framework-independent project/compiler/simulator
   |
   v
src/next application UI
```

Only modules under `src/next/adapters` may import the current `src/data` implementation. The core declares `GameDataRepository` and depends on that interface.

## Persisted state

The V2 project document is an authoring document, not a runtime snapshot. It stores:

- stable identities and references;
- operator, weapon, gear, enemy, and battle inputs;
- logical action placement;
- complete values exposed by the editor;
- an `edited` marker for values explicitly changed by the user;
- connections and scenario-level layout choices.

It does not store:

- computed operator or enemy status;
- applied stat deltas;
- compiled effects, requisites, or trigger registrations;
- projected resource curves and warnings;
- expected damage and damage breakdowns;
- simulation logs;
- transient selection, hover, or undo state.

## Ordered action model

The editor block is a `SkillCast`. Its authored gameplay payload follows the recovered execution hierarchy, using Endaxis-owned semantic names rather than copied implementation class names:

```text
SkillCast
  -> ScheduledSequence(startFrame, endFrame)
     -> ActionSequence
        -> CombatStep[]
```

`ActionSequence.steps` is authoritative and executes synchronously in array order. Buff application, damage, resource changes, event dispatch, and wrappers are represented as combat steps; the new model does not contain `beforeDamage` or `afterDamage` timing flags. Legacy import translates those flags into ordered sequence entries.

`conditional` is a first-class combat step. It owns `whenTrue` and optional `whenFalse` action sequences, so a condition may guard an ordered group of operations rather than being copied onto every leaf effect. Conditions that depend on build data read Deck attributes explicitly; derived runtime choices may be cached through `setContextFlag` and consumed by later branches.

Combat-step definitions are ordered operations, not independently named entities. A step has a catalog `key` only when an upgrade or another definition must address it. In the project document, only a rendered `dealDamage` occurrence receives a persistent `hitId`; connections target `{ kind: 'damageHit', skillCastId, hitId }`. Buff application, resource changes, conditions, and other unrendered child steps do not receive ceremonial IDs. Renderer-only keys are transient UI state.

A damage hit owns its element, per-level multiplier, stagger value, target context, and eventual instance `hitId`. These values are not stored in a separate damage-group registry. Source code may reuse the same immutable value object for repeated hits, but the serialized model has no `damageGroupKey` indirection.

Operator definitions use the shared constructors in `src/next/data/operators/definitionHelpers.ts` for recurring syntax such as ordered sequences, conditional branches, status and reaction conditions, level-value conversion, damage scaling, and normal-attack segments. `basicAttackOfType` requires the definition to bind a concrete damage type instead of inferring it from the operator's element. These helpers only construct typed core definitions; they do not evaluate combat rules or contain operator-specific mechanics. Character concepts such as Zhuang Fangyi's Sunderblades remain in that operator's definition.

Operator skills are nested under typed skill groups. A group's `skills` value is either one skill or an ordered skill array; an array such as a basic-attack chain expands into multiple skill casts in one placement command. Every combat-step `kind` is a discriminated union member with its own parameter type. Enumerated domain values such as element, weapon type, role, target, resource, and skill type use exported finite types and runtime constant lists. Strings remain open only for identities such as skill keys, catalog Buff keys, blackboard keys, and user-defined custom action types. A raw resource ID is not executable behavior: an adapter must translate a known game-data construct into an Endaxis semantic step before the simulator may consume it.

Talents and potentials separate static definition modifiers from runtime event handlers. A modifier rewrites or augments the compiled skill definition, while an event handler listens for a semantic combat event and executes an ordered action sequence. Trigger-shaped behavior is never encoded as a pseudo effect. Native implementation events and tag IDs stay in evidence records; operator definitions use stable domain events such as `reactionApplied`.

`presentationVariants` describe condition-selected names, descriptions, and icons for one stable skill group. They do not create another skill identity and do not select combat behavior. This distinction is required for operators such as Arcane: the game exposes two descriptions while the underlying skill graph remains shared and branches internally.

Editable defaults are stored to preserve the exact project result. The separate `edited` marker allows a future explicit “refresh from current game data” operation to update untouched defaults without overwriting user changes.

## Version boundary

- `schemaVersion` identifies the project document structure.
- `gameDataRevision` records which data revision supplied editable defaults.
- `createdWith` is diagnostic metadata only.
- All persisted time values use integer logical frames at 30 FPS.

The current project format has no meaningful schema version and is classified as legacy input. A dedicated importer will convert it into a V2 document. New code reads legacy documents through that importer and writes V2 documents only.

Both current and legacy documents enter through `parseProjectDocument`. Legacy conversion is injected through the `LegacyProjectImporter` port, and the migrated result must pass the same V2 validation before it reaches application state.

## Implementation stages

1. Define and validate the V2 project document.
2. Implement a conservative legacy importer using real exported fixtures.
3. Add a game-data adapter and compile one operator action end to end.
4. Build V2 timeline commands and undo/redo over the authoring document.
5. Implement panel calculation and combat simulation as derived state.
6. Add the parallel internal UI entry.
7. Compare migrated projects and simulation receipts against the current implementation.
8. Switch `/timeline` to the new entry and retain the old code only for a bounded fallback period.
