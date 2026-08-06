# Perlica definition in Endaxis Next

`src/next/data/operators/perlica.ts` is the first operator definition written against the ordered action model. It is intentionally separate from the current `OperatorSheet` and does not affect `/timeline`.

## Naming boundary

Endaxis names describe stable domain meaning: `SkillCast`, `ScheduledSequence`, `CombatStep`, `applyElementalReaction`, and `dealDamage`. Decompiled class names are not treated as our public API. Original skill IDs remain as source identities; raw projectile and Buff IDs belong to evidence, not to the executable definition.

## Execution structure

- Basic attacks currently schedule direct damage at the recovered timeline frames. Those frames are known projectile-launch points, so their use as hit offsets is an explicit approximation until projectile travel is modeled.
- The battle skill applies infliction to the single simulated enemy before damage, then gains ultimate energy according to the actual skill-cost conversion rule.
- The combo skill currently applies electrification, damage, and resource gain at frame 24 in recovered source order. Projectile travel remains unresolved and is not represented by a raw resource ID.
- The talent that bounces this projectile to another enemy is documented as source behavior but omitted from the executable model because Endaxis simulates exactly one enemy.
- The ultimate damages the single simulated enemy at frame 58. Its target-selection, interruption, and separate visual/audio behavior are outside Endaxis's simulation scope.

The evidence document records which offsets are launch frames, preventing this approximation from being mistaken for a recovered impact-time rule.

## Evidence boundary

Evidence and unresolved derivation notes do not belong to the runtime operator definition. They are maintained separately in `docs/research/perlica-next-evidence.md`; the production configuration contains only values and executable semantics.
