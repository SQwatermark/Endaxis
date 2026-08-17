# Next enemy rank evidence extractor

This script extracts the native `EnemyTemplateData.rank` field for every enemy
currently adapted into Endaxis Next. It uses the desktop VFS index service to
resolve the exact manifest asset and AnimeStudio raw export, then validates the
managed-reference prefix before reading the rank value.

The script is intentionally strict: missing assets, unexpected serialized types,
unknown enum values, or a changed component-list layout stop the run. Output is
written to `src/next/data/enemies/enemy-ranks-1.4.4.json`; raw exports use the OS
temporary directory and are not committed.

```powershell
python scripts/extract_next_enemy_ranks/extract_enemy_ranks.py
python -m unittest discover scripts/extract_next_enemy_ranks -p "test_*.py"
```

The default environment assumes `vfs-index-browser` is adjacent to this
repository and its service is listening on `http://127.0.0.1:8765`.
