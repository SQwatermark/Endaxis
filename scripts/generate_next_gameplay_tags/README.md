# Generate Next GameplayTag catalog

This generator converts the `_keyData` path list in an AnimeStudio
`GameplayTagConfig` TypeTree dump into Next's versioned tag catalog. IDs are not
copied from usage sites: the generated module computes each native signed CRC-32
identity from its exact path.

```powershell
python scripts/generate_next_gameplay_tags/generate_gameplay_tag_catalog.py `
  D:\Projects\vfs-index-browser\data\internal-cache\97191\manifest-assets\123136\monobehaviour\dump.txt `
  src/next/data/combat/gameplayTagCatalog.generated.ts
```

The known 1.4.4 dump hash is pinned. A different source requires an explicit
`--allow-new-source` and a new evidence audit before its output is committed.
