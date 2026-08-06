# Arcane form model in Endaxis Next

## Purpose

Arcane is the first data case used to verify that Endaxis Next can represent condition-dependent skills without duplicating a complete operator definition. The model follows the recovered 1.4.4 game flow while retaining Endaxis-owned semantic names.

## Model layers

The implementation deliberately separates four concerns:

1. `deckAttributeCompare` reads build-derived Deck attributes.
2. The `deckAttributesChanged` event handler derives the operator's current form.
3. `contextFlagEquals` lets shared skill graphs branch on that derived form.
4. `presentationVariants` select form-specific UI content for one stable skill group.

The Arcane-specific form logic is kept with the operator definition in `src/next/data/operators/arcane.ts`. Equal intellect and will select the intellect form because the recovered comparison is `Wisd >= Will`.

## Why the form is not a separate skill

The decoded game data keeps stable IDs such as `chr_0032_lizhiyan_normal_skill` and places multiple form checks inside the same action graph. Splitting the group into multiple skills would incorrectly imply that the two forms are separate cast identities and would force common timing, costs, targeting, and actions to be duplicated.

The V2 project therefore persists the stable skill group and skill key. It does not persist a manually selected Arcane form. Loading or compiling a project derives the form again from its operator, weapon, gear, talent, and potential inputs.

## Runtime boundary

The current change defines and validates the data model. The simulator still needs a compiler that turns `OperatorEventHandlerDefinition`, `conditional`, and `setContextFlag` definitions into runtime steps. Until that compiler exists, these definitions are catalog semantics rather than an alternative ad hoc evaluator.

Detailed reverse-engineering evidence is maintained in the combat specification repository at `vfs-index-browser/combat-spec/docs/arcane-form-selection.md`.
