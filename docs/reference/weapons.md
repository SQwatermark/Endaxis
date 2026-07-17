# 武器图鉴

## 概览

Endaxis 当前收录了 72 把武器的完整数据，覆盖 5 种武器类型和 4 个稀有度等级。

## 武器类型总览

| 类型 | 中文名 | 标识 | 总数 | ★3 | ★4 | ★5 | ★6 |
|---|---|---|---|---|---|---|
| 单手剑 | Sword | `sword` | 19 | 1 | 2 | 6 | 10 |
| 双手剑 | Greatsword | `greatsword` | 14 | 1 | 2 | 4 | 7 |
| 长柄武器 | Polearm | `polearm` | 11 | 1 | 2 | 3 | 5 |
| 手铳 | Handcannon | `handcannon` | 12 | 1 | 2 | 3 | 6 |
| 施术单元 | Arts Unit | `arts-unit` | 16 | 1 | 2 | 5 | 8 |

---

## ★6 武器一览

### 单手剑（10 把）

| 武器       | 英文             | 武器技前缀    |
| ---------- | ---------------- | ------------- |
| 显赫声名   | Eminent Repute   | 残暴·规行矩止 |
| 熔铸火焰   | Forgeborn Scathe | 迸发·淬火     |
| 光荣记忆   | Glorious Memory  | 压制·光荣战痕 |
| 宏愿       | Grand Vision     | 迸发·不倦宏愿 |
| 狼之绯     | Lupine Scarlet   | 切骨·狼血沸腾 |
| 不知归     | Never Rest       | 迸发·永不休战 |
| 扶摇       | Rapid Ascent     | 压制·扶摇意   |
| 热熔切割器 | Thermite Cutter  | 残暴·热熔锯   |
| 黯色火炬   | Umbral Torch     | 迸发·暗夜炬火 |
| 白夜新星   | White Night Nova | 迸发·新星辉   |

### 双手剑（7 把）

| 武器     | 英文               | 武器技前缀    |
| -------- | ------------------ | ------------- |
| 赤缨     | Amaranthine Tassel | 巧技·赤断     |
| 典范     | Exemplar           | 压制·多层斩断 |
| 昔日精品 | Former Finery      | 迸发·重现辉煌 |
| 赫拉芬格 | Khravengger        | 残暴·噬灵爪   |
| 幻想苦痛 | Phantom Pain       | 迸发·苦痛回忆 |
| 破碎君王 | Sundered Prince    | 残暴·王权破碎 |
| 大雷斑   | Thunderberge       | 迸发·雷斑轰   |

### 长柄武器（5 把）

| 武器         | 英文                         | 武器技前缀    |
| ------------ | ---------------------------- | ------------- |
| 灯火使命     | Beacon of Duty               | 效益·灯火灼身 |
| 灼烁深红之祝 | Blessing of Lustrous Carmine | —             |
| J.E.T.       | JET                          | 残暴·喷气突进 |
| 负山         | Mountain Bearer              | 迸发·负山行   |
| 骁勇         | Valiant                      | 残暴·无畏冲锋 |

### 手铳（6 把）

| 武器     | 英文              | 武器技前缀    |
| -------- | ----------------- | ------------- |
| 艺术暴君 | Artzy Tyrannical  | 切骨·艺术暴论 |
| 落草     | Brigand's Calling | 迸发·荡寇仇   |
| 同类相食 | Clannibal         | 附术·残酷清洗 |
| 望乡     | Home Longing      | 迸发·望乡意   |
| 领航者   | Navigator         | 迸发·领航之志 |
| 楔子     | Wedge             | 迸发·楔入     |

### 施术单元（8 把）

| 武器       | 英文                       | 武器技前缀      |
| ---------- | -------------------------- | --------------- |
| 骑士精神   | Chivalric Virtues          | 医疗·侵蚀性狂热 |
| 使命必达   | Delivery Guaranteed        | 追袭·不辱使命   |
| 爆破单元   | Detonation Unit            | 迸发·冠军威赫   |
| 沧溟星梦   | Dreams of the Starry Beach | 附术·潮汐低语   |
| 雾中微光   | Flickers in the Mist       | 迸发·雾中芒     |
| 孤舟       | Lone Barge                 | 迸发·夜航       |
| 遗忘       | Oblivion                   | 迸发·记忆空缺   |
| 作品：蚀迹 | Opus: Etch Figure          | 迸发·蚀刻纪元   |

---

## 武器数据结构

每把武器包含：

| 字段      | 说明                                |
| --------- | ----------------------------------- |
| `rarity`  | 稀有度（3-6）                       |
| `type`    | 武器类型                            |
| `baseAtk` | 基础攻击力（9 个等级：Lv1-90）      |
| `skill1`  | 通用属性 1（9 个词条等级）          |
| `skill2`  | 通用属性 2（9 个词条等级）          |
| `skill3`  | 专属武器技（含 effects + triggers） |

### 词条等级

武器三个词条在当前 UI 中直接编辑为 1-9 级。武器潜能、基质适配和基质加点最终都会折算到词条等级上，因此模拟层主要消费 `skill1Level`、`skill2Level`、`skill3Level`，不单独推演“选择了哪块基质”。

### 武器技结构

```
skill3:
  effects:        # 常驻属性效果
  triggers:       # 触发型效果
    - trigger: { kind: 'onHit' }
      effects: [...]
```

---

## 武器技前缀

每个专属武器技带前缀标签，标识设计定位：

| 前缀 | 英文         | 定位       | 常见效果模式                 |
| ---- | ------------ | ---------- | ---------------------------- |
| 强攻 | Aggressive   | 纯数值型   | 攻击力+固定值                |
| 压制 | Suppressive  | 叠层增益   | 战技/终结技命中叠攻击力/增伤 |
| 切骨 | Bone-Cutting | 暴击特化   | 暴击后叠增伤                 |
| 残暴 | Brutal       | 消耗型爆发 | 消耗破防/效果层数后获增益    |
| 迸发 | Eruptive     | 触发型     | 施加附着/脆弱/爆发后获增益   |
| 巧技 | Artful       | 条件触发   | 施加物理异常时获增益         |
| 效益 | Efficient    | 团队辅助   | 施加效果后全队增益           |
| 追袭 | Pursuit      | 追击型     | 连携后强化战技/终结技        |
| 附术 | Enchanted    | 法术型     | 消耗法术异常后增伤/易伤      |
| 医疗 | Medical      | 治疗型     | 治疗后全队加攻               |
| 夜幕 | Nightfall    | 终结技特化 | 终结技增伤 + 击飞后额外加成  |

---

## 武器选择对排轴的影响

1. **基础攻击力**：直接影响 ATK 计算中的 `weaponAtk` 项
2. **通用属性**（skill1/skill2）：四维属性、攻击力%、暴击率、终结技充能效率、元素增伤等
3. **专属武器技**（skill3）：提供核心战斗机制增强，与干员技能体系协同

干员只能装备对应类型的武器（由 `operator.weapon` 字段限定）。
