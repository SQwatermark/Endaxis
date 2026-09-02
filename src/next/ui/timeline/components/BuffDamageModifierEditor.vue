<script setup lang="ts">
import { ref } from 'vue';
import type {
  BuffDuration,
  CombatBuffDefinitionDamageModifier,
  CombatBuffDefinitionDamageProcessor,
} from '../../../../../packages/game-data-contract/src/buffs';
import {
  ATTRIBUTE_MODIFIER_SLOTS,
  DAMAGE_MODIFIER_SIDES,
  DAMAGE_SCALE_ZONES,
  type AttributeModifierSlot,
  type DamageModifierSide,
  type DamageScaleZone,
} from '../../../../../packages/game-data-contract/src/modifiers';
import BuffDefinitionScalarEditor from './BuffDefinitionScalarEditor.vue';
import BuffDamageModifierConditionEditor from './BuffDamageModifierConditionEditor.vue';

const props = defineProps<{ modifiers: readonly CombatBuffDefinitionDamageModifier[] }>();
const emit = defineEmits<{
  update: [modifiers: readonly CombatBuffDefinitionDamageModifier[]];
}>();
const collapsed = ref(true);

function createProcessor(
  kind: CombatBuffDefinitionDamageProcessor['kind'],
): CombatBuffDefinitionDamageProcessor {
  return kind === 'damageScale'
    ? { kind, side: 'attacker', zone: 'normal', addition: 0 }
    : {
        kind,
        targetSide: 'attacker',
        attribute: 'Atk',
        values: { slot: 'baseAddition', value: 0 },
        attributeTiming: 'runtime',
      };
}

function replaceModifier(index: number, modifier: CombatBuffDefinitionDamageModifier): void {
  emit(
    'update',
    props.modifiers.map((item, i) => (i === index ? modifier : item)),
  );
}

function replaceProcessor(
  modifierIndex: number,
  modifier: CombatBuffDefinitionDamageModifier,
  processorIndex: number,
  processor: CombatBuffDefinitionDamageProcessor,
): void {
  replaceModifier(modifierIndex, {
    ...modifier,
    processors: modifier.processors.map((item, i) => (i === processorIndex ? processor : item)),
  });
}

function addModifier(): void {
  emit('update', [
    ...props.modifiers,
    { enabledSide: 'attacker', processors: [createProcessor('damageScale')] },
  ]);
}

function removeModifier(index: number): void {
  emit(
    'update',
    props.modifiers.filter((_, i) => i !== index),
  );
}

function moveModifier(index: number, offset: -1 | 1): void {
  const target = index + offset;
  if (target < 0 || target >= props.modifiers.length) return;
  const next = [...props.modifiers];
  [next[index], next[target]] = [next[target]!, next[index]!];
  emit('update', next);
}

function setEnabledSide(
  index: number,
  modifier: CombatBuffDefinitionDamageModifier,
  event: Event,
): void {
  const enabledSide = (event.target as HTMLSelectElement).value as DamageModifierSide;
  if (!DAMAGE_MODIFIER_SIDES.includes(enabledSide)) return;
  replaceModifier(index, { ...modifier, enabledSide });
}

function toggleCondition(
  index: number,
  modifier: CombatBuffDefinitionDamageModifier,
  event: Event,
): void {
  const next = { ...modifier };
  if ((event.target as HTMLInputElement).checked) next.condition = { kind: 'casterControlled' };
  else delete next.condition;
  replaceModifier(index, next);
}

function addProcessor(index: number, modifier: CombatBuffDefinitionDamageModifier): void {
  replaceModifier(index, {
    ...modifier,
    processors: [...modifier.processors, createProcessor('damageScale')],
  });
}

function removeProcessor(
  modifierIndex: number,
  modifier: CombatBuffDefinitionDamageModifier,
  processorIndex: number,
): void {
  if (modifier.processors.length <= 1) return;
  replaceModifier(modifierIndex, {
    ...modifier,
    processors: modifier.processors.filter((_, i) => i !== processorIndex),
  });
}

function moveProcessor(
  modifierIndex: number,
  modifier: CombatBuffDefinitionDamageModifier,
  processorIndex: number,
  offset: -1 | 1,
): void {
  const target = processorIndex + offset;
  if (target < 0 || target >= modifier.processors.length) return;
  const processors = [...modifier.processors];
  [processors[processorIndex], processors[target]] = [
    processors[target]!,
    processors[processorIndex]!,
  ];
  replaceModifier(modifierIndex, { ...modifier, processors });
}

function setProcessorKind(
  modifierIndex: number,
  modifier: CombatBuffDefinitionDamageModifier,
  processorIndex: number,
  event: Event,
): void {
  replaceProcessor(
    modifierIndex,
    modifier,
    processorIndex,
    createProcessor(
      (event.target as HTMLSelectElement).value as CombatBuffDefinitionDamageProcessor['kind'],
    ),
  );
}

function updateDamageScale(
  modifierIndex: number,
  modifier: CombatBuffDefinitionDamageModifier,
  processorIndex: number,
  processor: Extract<CombatBuffDefinitionDamageProcessor, { kind: 'damageScale' }>,
  patch: Partial<Extract<CombatBuffDefinitionDamageProcessor, { kind: 'damageScale' }>>,
): void {
  replaceProcessor(modifierIndex, modifier, processorIndex, { ...processor, ...patch });
}

function updateInstantAttribute(
  modifierIndex: number,
  modifier: CombatBuffDefinitionDamageModifier,
  processorIndex: number,
  processor: Extract<CombatBuffDefinitionDamageProcessor, { kind: 'instantAttribute' }>,
  patch: Partial<Extract<CombatBuffDefinitionDamageProcessor, { kind: 'instantAttribute' }>>,
): void {
  replaceProcessor(modifierIndex, modifier, processorIndex, { ...processor, ...patch });
}

function sparseValues(
  processor: Extract<CombatBuffDefinitionDamageProcessor, { kind: 'instantAttribute' }>,
): { readonly slot: AttributeModifierSlot; readonly value: BuffDuration } | undefined {
  return 'slot' in processor.values ? processor.values : undefined;
}

function setFullValue(
  modifierIndex: number,
  modifier: CombatBuffDefinitionDamageModifier,
  processorIndex: number,
  processor: Extract<CombatBuffDefinitionDamageProcessor, { kind: 'instantAttribute' }>,
  slot: AttributeModifierSlot,
  event: Event,
): void {
  if ('slot' in processor.values) return;
  const value = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(value)) return;
  updateInstantAttribute(modifierIndex, modifier, processorIndex, processor, {
    values: { ...processor.values, [slot]: value },
  });
}

function fullValue(
  processor: Extract<CombatBuffDefinitionDamageProcessor, { kind: 'instantAttribute' }>,
  slot: AttributeModifierSlot,
): number {
  return 'slot' in processor.values ? 0 : processor.values[slot];
}
</script>

<template>
  <section class="damage-modifier-editor">
    <header>
      <button type="button" @click="collapsed = !collapsed">
        {{ collapsed ? '▸' : '▾' }} 伤害修正器 <span>{{ modifiers.length }}</span>
      </button>
      <button type="button" title="添加伤害修正器" @click="addModifier">＋</button>
    </header>
    <p v-if="!collapsed">处理器和递归条件树直接编辑公共伤害修正协议，不会转换成技能条件。</p>
    <article
      v-for="(modifier, modifierIndex) in modifiers"
      v-show="!collapsed"
      :key="modifierIndex"
      class="damage-modifier"
    >
      <header>
        <strong>伤害修正 {{ modifierIndex + 1 }}</strong>
        <button
          type="button"
          :disabled="modifierIndex === 0"
          @click="moveModifier(modifierIndex, -1)"
        >
          ↑
        </button>
        <button
          type="button"
          :disabled="modifierIndex === modifiers.length - 1"
          @click="moveModifier(modifierIndex, 1)"
        >
          ↓
        </button>
        <button type="button" @click="removeModifier(modifierIndex)">×</button>
      </header>
      <label>
        <span>启用侧</span>
        <select
          :value="modifier.enabledSide"
          @change="setEnabledSide(modifierIndex, modifier, $event)"
        >
          <option v-for="side in DAMAGE_MODIFIER_SIDES" :key="side" :value="side">
            {{ side }}
          </option>
        </select>
      </label>
      <label class="condition-toggle">
        <input
          type="checkbox"
          :checked="modifier.condition !== undefined"
          @change="toggleCondition(modifierIndex, modifier, $event)"
        />
        <span>启用专用伤害条件</span>
      </label>
      <BuffDamageModifierConditionEditor
        v-if="modifier.condition"
        :condition="modifier.condition"
        @update="replaceModifier(modifierIndex, { ...modifier, condition: $event })"
      />
      <section class="processor-list">
        <header>
          <strong>处理器 {{ modifier.processors.length }}</strong>
          <button type="button" @click="addProcessor(modifierIndex, modifier)">＋</button>
        </header>
        <article
          v-for="(processor, processorIndex) in modifier.processors"
          :key="processorIndex"
          class="processor"
        >
          <div class="processor-heading">
            <select
              :value="processor.kind"
              @change="setProcessorKind(modifierIndex, modifier, processorIndex, $event)"
            >
              <option value="damageScale">伤害倍率区间</option>
              <option value="instantAttribute">即时属性</option>
            </select>
            <button
              type="button"
              :disabled="processorIndex === 0"
              @click="moveProcessor(modifierIndex, modifier, processorIndex, -1)"
            >
              ↑
            </button>
            <button
              type="button"
              :disabled="processorIndex === modifier.processors.length - 1"
              @click="moveProcessor(modifierIndex, modifier, processorIndex, 1)"
            >
              ↓
            </button>
            <button
              type="button"
              :disabled="modifier.processors.length <= 1"
              @click="removeProcessor(modifierIndex, modifier, processorIndex)"
            >
              ×
            </button>
          </div>
          <template v-if="processor.kind === 'damageScale'">
            <label>
              <span>作用侧</span>
              <select
                :value="processor.side"
                @change="
                  updateDamageScale(modifierIndex, modifier, processorIndex, processor, {
                    side: ($event.target as HTMLSelectElement).value as DamageModifierSide,
                  })
                "
              >
                <option v-for="side in DAMAGE_MODIFIER_SIDES" :key="side" :value="side">
                  {{ side }}
                </option>
              </select>
            </label>
            <label>
              <span>倍率区间</span>
              <select
                :value="processor.zone"
                @change="
                  updateDamageScale(modifierIndex, modifier, processorIndex, processor, {
                    zone: ($event.target as HTMLSelectElement).value as DamageScaleZone,
                  })
                "
              >
                <option v-for="zone in DAMAGE_SCALE_ZONES" :key="zone" :value="zone">
                  {{ zone }}
                </option>
              </select>
            </label>
            <label>
              <span>增量</span>
              <BuffDefinitionScalarEditor
                :value="processor.addition"
                @update="
                  $event !== undefined &&
                  updateDamageScale(modifierIndex, modifier, processorIndex, processor, {
                    addition: $event,
                  })
                "
              />
            </label>
          </template>
          <template v-else>
            <label>
              <span>目标侧</span>
              <select
                :value="processor.targetSide"
                @change="
                  updateInstantAttribute(modifierIndex, modifier, processorIndex, processor, {
                    targetSide: ($event.target as HTMLSelectElement).value as DamageModifierSide,
                  })
                "
              >
                <option v-for="side in DAMAGE_MODIFIER_SIDES" :key="side" :value="side">
                  {{ side }}
                </option>
              </select>
            </label>
            <label>
              <span>属性键</span>
              <input
                type="text"
                :value="processor.attribute"
                @input="
                  updateInstantAttribute(modifierIndex, modifier, processorIndex, processor, {
                    attribute: ($event.target as HTMLInputElement).value,
                  })
                "
              />
            </label>
            <template v-if="sparseValues(processor)">
              <label>
                <span>聚合槽位</span>
                <select
                  :value="sparseValues(processor)!.slot"
                  @change="
                    updateInstantAttribute(modifierIndex, modifier, processorIndex, processor, {
                      values: {
                        slot: ($event.target as HTMLSelectElement).value as AttributeModifierSlot,
                        value: sparseValues(processor)!.value,
                      },
                    })
                  "
                >
                  <option v-for="slot in ATTRIBUTE_MODIFIER_SLOTS" :key="slot" :value="slot">
                    {{ slot }}
                  </option>
                </select>
              </label>
              <label>
                <span>数值</span>
                <BuffDefinitionScalarEditor
                  :value="sparseValues(processor)!.value"
                  @update="
                    $event !== undefined &&
                    updateInstantAttribute(modifierIndex, modifier, processorIndex, processor, {
                      values: { slot: sparseValues(processor)!.slot, value: $event },
                    })
                  "
                />
              </label>
            </template>
            <fieldset v-else class="full-attribute-values">
              <legend>完整八槽值</legend>
              <label v-for="slot in ATTRIBUTE_MODIFIER_SLOTS" :key="slot">
                <span>{{ slot }}</span>
                <input
                  type="number"
                  step="0.01"
                  :value="fullValue(processor, slot)"
                  @input="
                    setFullValue(modifierIndex, modifier, processorIndex, processor, slot, $event)
                  "
                />
              </label>
            </fieldset>
          </template>
        </article>
      </section>
    </article>
  </section>
</template>

<style scoped>
.damage-modifier-editor {
  margin-top: 12px;
  border-top: 1px solid var(--ea-border-soft);
  padding-top: 10px;
}

.damage-modifier-editor > header,
.damage-modifier > header,
.processor-list > header,
.processor-heading {
  display: flex;
  justify-content: space-between;
  gap: 6px;
}

.damage-modifier-editor > header button:first-child {
  flex: 1;
  text-align: left;
}

.damage-modifier-editor button,
.damage-modifier-editor input,
.damage-modifier-editor select {
  min-width: 0;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}

.damage-modifier-editor > p,
.readonly-values {
  color: var(--ea-fg-muted);
  font-size: 11px;
}

.damage-modifier,
.processor {
  display: grid;
  gap: 8px;
  margin-top: 8px;
  padding: 10px;
  border: 1px solid var(--ea-border-soft);
}

.damage-modifier > label,
.processor > label {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}

.damage-modifier > .condition-toggle {
  display: flex;
}

.condition-toggle input {
  width: 15px;
  height: 15px;
}

.processor-list {
  padding-left: 10px;
  border-left: 2px solid var(--ea-border-soft);
}

.processor-heading select {
  flex: 1;
}

.full-attribute-values {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 10px;
  border: 1px solid var(--ea-border-soft);
}

.full-attribute-values label {
  display: grid;
  grid-template-columns: minmax(100px, 1fr) minmax(70px, 0.7fr);
  align-items: center;
  gap: 6px;
}
</style>
