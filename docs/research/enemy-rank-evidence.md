# Enemy rank evidence

## Conclusion

`CheckEnemyRank` reads the native `EnemyTemplateData.rank`, not Endaxis's legacy
five-level display `tier`. Endfield 1.4.4 uses three native values:

| Serialized `EnemyRank` | Next identity | `EnemyRankSet` bit |
| ---------------------: | ------------- | -----------------: |
|                      0 | `mob`         |                  1 |
|                      1 | `boss`        |                  4 |
|                      2 | `elite`       |                  2 |

The non-numeric ordering of the flags is deliberate. It is supported by the
`CheckEnemyRank` static initializer, rather than inferred from display labels.

## Evidence chain

- Desktop VFS effective manifest: `451359` (Endfield 1.4.4).
- `EnemyTemplateDataSummary.json` VFS record: `242479`; it provides the exact
  per-enemy asset identity used to resolve each template.
- IL2CPP dump: `Gameplay.Beyond.dll.cs` declares `EnemyTemplateData.rank` and
  the `Mob`, `Boss`, and `Elite` enum members.
- Static disassembly of `GameAssembly.dll` at
  `CheckEnemyRank..cctor` RVA `0x0718FA24` proves the three list entries are
  constructed from native enum values `0`, `2`, and `1` for Mob, Elite, and
  Boss respectively. The corresponding execute method is at RVA `0x0718F81C`.
- Decoded native condition data uses the flag values independently and in
  combination; for example mask `6` means `Elite | Boss`. AKEDB projects these
  values as names such as `"Elite, Boss"`, while some real conditions retain
  integer `0`; the latter is an empty set and therefore never matches.
- Raw MonoBehaviour exports place the serialized rank immediately after the
  root `EnemyTemplateData.modelKey`. The extractor validates the managed type,
  root RID, component list, model key, and known enum range before accepting it.

The checked dataset is `src/next/data/enemies/enemy-ranks-1.4.4.json`; each row
records its raw payload SHA-256. It covers all 82 enemy `gameId` values currently
adapted by Next: 37 mob, 32 elite, and 13 boss. `eny_0007_mimicw` is native
`elite` while its legacy display tier is `advanced`, directly disproving a
tier-to-rank alias.

## Scope and failure boundary

The dataset proves only the 82 current Next enemy definitions for game version
1.4.4 and manifest 451359. New enemies, a new manifest, a changed serialized
layout, an unknown enum value, or a missing asset must fail extraction or
adaptation; none may fall back to a tier mapping. Custom project enemies carry
an explicit project-owned rank and default to `mob` when created.

Reproduction and parser tests are documented in
`tools/game-data-compiler/legacy/enemy-ranks/README.md`.

## Generator audit

AKEDB's 2026-08-15 public JSON snapshot contains 15 `CheckEnemyRank` occurrences
across seven operators. It is paired with the manifest's current
`1.4.4@9433094-12` TableCfg baseline. Tangtang power attack, Wulfa ultimate,
and Last Rite ultimate all reach DSL compilation, with no remaining
`CheckEnemyRank` blocker. The paired full audit covers 30 operators and 320
entry skills: 312 parse strictly and 280 compile to the current DSL.
