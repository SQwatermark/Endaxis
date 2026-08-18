# Shatter damage decorate mask evidence

## Scope

This note records why native `DamageDecorateMask` value `134217728` is compiled
as the Next damage feature `shatter`. The data baseline is AKEDB
`1.4.4@9433094-12` and the matching desktop `GameAssembly.dll` whose SHA-256 is
`0C5573679BC6DEC2D068A14335466DB7CCF20AF9BAE2B983FB9D45677D80FFCE`.

## Native enum evidence

The hash-matched IL2CPP dump declares both related enums in
`Gameplay.Beyond.dll.cs`:

- `DamageDecorateType` orders `DashAttack` at value position 18,
  `Shatter` at position 28, `Dot` at position 29, and `RemainArea` at position
  30 (`None` occupies position 0).
- `DamageDecorateMask` uses a signed 64-bit backing value and declares the same
  names as flags. Its declaration order is not a safe value source because
  `Fracture` is placed earlier than its corresponding decorate type.

The mask bit for a non-`None` decorate type is `1 << (typeValue - 1)`. This
reproduces already independently identified values:

- `DashAttack`: `1 << 17 = 131072`;
- `Dot`: `1 << 28 = 268435456`;
- `RemainArea`: `1 << 29 = 536870912`.

It therefore fixes `Shatter` exactly as `1 << 27 = 134217728`, without deriving
the name from a skill description.

## AKEDB carrier evidence

Across the downloaded `SkillData` and `BuffData` snapshot, the exact mask is
carried by `buff_common_cryst_triggered_physical_break` and no other record. Its
health-damage unit is physical damage. The game-localized `ba.crystbreak` term
names this mechanic `Shatter` / `碎冰` and describes it as physical damage
triggered by applying vulnerability or a physical status to a solidified
target.

The generator therefore preserves this bit as a damage feature rather than a
skill-type tag. This lets damage event conditions distinguish Shatter while
keeping it independent of normal attack, battle skill, combo skill, and
ultimate classifications.
