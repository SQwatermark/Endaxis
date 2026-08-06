# Buff 语义目录

本目录保存由 `combat-spec` 从游戏数据投影出的版本化语义目录。JSON 是生成产物，不应手工编辑；Endaxis 只通过严格解析器读取，未知字段和未支持的动作会直接报错。

四系元素附着目录的生成命令：

```powershell
dotnet run --project CombatSpec.Cli -- export-elemental-attachment-catalog `
  --revision combat-1.4.4 `
  --output elemental-attachments.combat-1.4.4.json `
  <fire-buff.json> <pulse-buff.json> <cryst-buff.json> <natural-buff.json>
```

源 BuffData 必须与目标游戏版本一致。当前 CDN 文件已与本地 1.4.4 快照按字节哈希核对；重新生成其他版本时需要重新完成该核对，不能只依赖文件名。
