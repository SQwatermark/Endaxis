# Generate Next GameplayTag catalog

This legacy path now delegates to the unified TypeScript game-data compiler. It converts the
`_keyData` path list in an AnimeStudio `GameplayTagConfig` TypeTree dump into Next's versioned
tag catalog. IDs are computed from exact paths with the same shared signed CRC-32 implementation
used by the simulator.

```powershell
npm run generate:game-data:gameplay-tags -- `
  D:\Projects\vfs-index-browser\data\internal-cache\97191\manifest-assets\123136\monobehaviour\dump.txt `
  src/next/data/combat/gameplayTagCatalog.generated.ts
```

The known 1.4.4 dump hash is pinned. A different source requires an explicit
`--allow-new-source` and a new evidence audit before its output is committed.
