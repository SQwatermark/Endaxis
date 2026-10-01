# 公开时间轴性能输入

本目录供[无缓存基线工具](../../README.md)使用。每份项目选一个真实方案，保留原位置、配装、准备期和统计结束线，不复制循环、不补造技能、不为了增加压力拉长结束线。原分享包含的其余同队变体不重复作为独立样本。

`manifest.json` 记录公开页面、标题、公开作者、原始文件 SHA-256、方案索引、来源规模、转换版本、选项、映射摘要和当前游戏数据修订。`*.project.json` 是可以直接导入的当前项目；`*.conversion.json` 是完整转换诊断和旧字段到新字段映射。原始分享码、旧 JSON、旧模拟结果没有进入仓库。

## 来源与选择

| 分享 ID                                                                              | 来源标题                     | 选中原方案序号（0 起） | 干员                                             | 技能块 |
| ------------------------------------------------------------------------------------ | ---------------------------- | ---------------------- | ------------------------------------------------ | -----: |
| [6aba2a13c9fb961339acd766](https://www.end-axis.com/shares/6aba2a13c9fb961339acd766) | 提决佩洁01循环轴无失衡6w4dps | 0                      | typhoeus / arcane / perlica / gilberta           |    104 |
| [6aaa98afecff634734db32cf](https://www.end-axis.com/shares/6aaa98afecff634734db32cf) | 别汤赛决                     | 0                      | xaihi / arcane / last-rite / tangtang            |     75 |
| [6abbd0200ce683bcda839545](https://www.end-axis.com/shares/6abbd0200ce683bcda839545) | Share 2026-09-29             | 0                      | estella / camille / wulfgard / arcane            |     17 |
| [6aa9520520d2d87ecbb2e962](https://www.end-axis.com/shares/6aa9520520d2d87ecbb2e962) | 伊冯碎冰轴                   | 0                      | yvonne / gilberta / estella / mifu               |     36 |
| [6960d9afaf72c0e43d122dfb](https://www.end-axis.com/shares/6960d9afaf72c0e43d122dfb) | 开荒低星碎冰队               | 0                      | chen-qianyu / endministrator / estella / akekuri |     35 |
| [6a91c4241854aefb13172209](https://www.end-axis.com/shares/6a91c4241854aefb13172209) | 庄佩梨杰冷启动               | 1                      | zhuang-fangyi / perlica / liino / arclight       |     39 |

这是 6 份公开项目的代表性选择，不是全部公开轴中最长或最慢的穷举结论。104 和 75 块的长轴承担密集输入覆盖；短方案用于不同干员与机制对照。电队选中间 39 块方案，其余两个 4 块方案未纳入。

## 转换边界

- 旧格式 `1.0.0`，原时间单位是 60 FPS 帧；现格式是 30 FPS。报告逐项记录起点平移和舍入，最大绝对舍入误差约 16.67 ms
- 使用正式转换器的 `timingMode: preserve`。六份均没有未知技能、没有省略技能、没有时间智能修复、没有资源上限修正、没有递归序列展开
- 提决佩洁队有两次按实际状态解析的技能形态替换，详见其 `skillFormAdjustments`；所有方案启用当前转换器的按输入自动切换主控
- 低星队原轴有陈千语普攻自定义 `damageTicks`（offset 3.2、sp 18、stagger 16）。当前转换器明确忽略该自定义并使用现行标准定义。因此它是有已知差异的转换工作负载，不是原版自定义行为的准确复刻
- 六份最终完整时长模拟都返回可用性诊断，其中五份另有连携窗口诊断；均无执行诊断、闪避诊断或拒绝输入。不能把“零拒绝输入”理解成“所有技能都成功命中”或“原生游戏可行性已验证”
- 旧伤害、命中与 Buff 快照不迁移；数值由当前游戏定义重新计算。性能比较使用同一转换文件，不以旧作者标题中的 DPS 为正确性标准

## 重建

在公开页面使用“复制项目数据码”，原样保存 UTF-8 分享码，并按 base64url + gzip 解出旧 JSON，不重写旧 JSON。比对清单中的原始 SHA-256；来源改变时须另立输入版本，不能覆盖既有基线。

仓库不下载或提交原文件。准备本地来源目录，其中 `manifest.json` 含 `samples` 数组；每项提供 `id/title/author/sourceUrl/acquiredDateUtc/version/fps`、`files: [{ name, sha256 }]`（JSON 文件名）与 `scenarios` 元数据，按本目录清单顺序排列。随后运行：

```sh
node --experimental-strip-types tools/performance/convert-public-timelines.ts '<本地来源目录>' tmp/rebuilt-public-timelines 0,0,0,0,0,1
```

输出目录必须不存在。工具核对来源摘要，调用正式转换入口，将项目的非战斗 `createdAt` 规范为采集日零点，输出格式化项目、完整报告和清单。`engineCommit` 记录实际执行时的提交；如引擎或转换器版本改变，须重新核对差异。转换不要求联网，也不修改源文件。
