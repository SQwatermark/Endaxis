<script setup lang="ts">
import { ref } from 'vue';
import type {
  BuffDuration,
  BuffSustainedProtectionDefinition,
  CombatBuffSemanticRole,
  CombatBuffSpellBurstDefinition,
} from '../../../../packages/game-data-contract/src/buffs';
import {
  DAMAGE_TYPES,
  INFLICTION_ELEMENTS,
  type DamageType,
  type InflictionElement,
} from '../../../../packages/game-data-contract/src/primitives';
import BuffDefinitionScalarEditor from './BuffDefinitionScalarEditor.vue';
import { BUFF_OPTIONAL_OBJECTS, type BuffOptionalObjectKey } from '../buffOptionalObjectGraph';

const props = defineProps<{
  sustainedProtection?: BuffSustainedProtectionDefinition;
  role?: CombatBuffSemanticRole;
  spellBurst?: CombatBuffSpellBurstDefinition;
  affixSkillCastIdentity?: 'sourceSkillCast';
  layer?: BuffOptionalObjectKey | 'affix';
}>();
const emit = defineEmits<{
  updateSustainedProtection: [value: BuffSustainedProtectionDefinition | undefined];
  updateRole: [value: CombatBuffSemanticRole | undefined];
  updateSpellBurst: [value: CombatBuffSpellBurstDefinition | undefined];
  updateAffixSkillCastIdentity: [value: 'sourceSkillCast' | undefined];
}>();
const collapsed = ref(true);
function roleKind(role: CombatBuffSemanticRole | undefined): CombatBuffSemanticRole['kind'] {
  return role?.kind ?? 'elementalAttachment';
}
function createRole(kind: CombatBuffSemanticRole['kind']): CombatBuffSemanticRole {
  if (props.role?.kind === kind) return props.role;
  return kind === 'elementalAttachment' || kind === 'elementalBurst'
    ? { kind, element: 'heat' }
    : { kind, consumedElement: 'heat', incomingElement: 'electric' };
}
function finiteNumber(event: Event): number | undefined {
  const value = Number((event.target as HTMLInputElement).value);
  return Number.isFinite(value) ? value : undefined;
}
function setSustainedProtectionScalar(
  field: 'superArmor' | 'impactResistance',
  value: BuffDuration | undefined,
): void {
  if (value === undefined || !props.sustainedProtection) return;
  emit('updateSustainedProtection', { ...props.sustainedProtection, [field]: value });
}
</script>

<template>
  <section class="advanced-editor" :class="{ 'layer-only': layer }">
    <header v-if="!layer">
      <button type="button" @click="collapsed = !collapsed">
        {{ collapsed ? '▸' : '▾' }} 高级原生语义
      </button>
    </header>
    <div v-if="layer || !collapsed" class="advanced-content">
      <fieldset v-if="!layer || layer === 'affix'">
        <legend>
          <label>
            <input
              type="checkbox"
              :checked="affixSkillCastIdentity === 'sourceSkillCast'"
              @change="
                emit(
                  'updateAffixSkillCastIdentity',
                  ($event.target as HTMLInputElement).checked ? 'sourceSkillCast' : undefined,
                )
              "
            />启用时记录来源技能的施法身份（SkillAffix）
          </label>
        </legend>
        <p>供同一次施法限定的伤害条件使用；它不会覆盖 Buff 的普通来源身份。</p>
      </fieldset>
      <fieldset v-if="!layer || layer === 'sustainedProtection'">
        <legend v-if="!layer">
          <label
            ><input
              type="checkbox"
              :checked="sustainedProtection !== undefined"
              @change="
                emit(
                  'updateSustainedProtection',
                  ($event.target as HTMLInputElement).checked
                    ? BUFF_OPTIONAL_OBJECTS.sustainedProtection.create()
                    : undefined,
                )
              "
            />持续保护</label
          >
        </legend>
        <template v-if="sustainedProtection"
          ><label
            ><span>目标</span
            ><select
              :value="sustainedProtection.target"
              @change="
                emit('updateSustainedProtection', {
                  ...sustainedProtection,
                  target: ($event.target as HTMLSelectElement).value as 'owner' | 'buffSource',
                })
              "
            >
              <option value="owner">Buff 持有者</option>
              <option value="buffSource">Buff 来源</option>
            </select></label
          ><label
            ><span>霸体</span
            ><BuffDefinitionScalarEditor
              :value="sustainedProtection.superArmor"
              @update="setSustainedProtectionScalar('superArmor', $event)" /></label
          ><label
            ><span>冲击抗性</span
            ><BuffDefinitionScalarEditor
              :value="sustainedProtection.impactResistance"
              @update="setSustainedProtectionScalar('impactResistance', $event)" /></label
        ></template>
      </fieldset>
      <fieldset v-if="!layer || layer === 'role'">
        <legend v-if="!layer">
          <label
            ><input
              type="checkbox"
              :checked="role !== undefined"
              @change="
                emit(
                  'updateRole',
                  ($event.target as HTMLInputElement).checked
                    ? createRole('elementalAttachment')
                    : undefined,
                )
              "
            />语义角色</label
          >
        </legend>
        <template v-if="role"
          ><p v-if="layer">元素附着、爆发或异常的运行时语义。更换类型会替换对应参数，可撤销。</p>
          <label
            ><span>角色类型</span
            ><select
              :value="roleKind(role)"
              @change="
                emit(
                  'updateRole',
                  createRole(
                    ($event.target as HTMLSelectElement).value as CombatBuffSemanticRole['kind'],
                  ),
                )
              "
            >
              <option value="elementalAttachment">元素附着</option>
              <option value="elementalBurst">法术爆发</option>
              <option value="compoundStatus">法术异常</option>
            </select></label
          >
          <label v-if="role.kind === 'elementalAttachment' || role.kind === 'elementalBurst'"
            ><span>元素</span
            ><select
              :value="role.element"
              @change="
                emit('updateRole', {
                  ...role,
                  element: ($event.target as HTMLSelectElement).value as InflictionElement,
                })
              "
            >
              <option v-for="element in INFLICTION_ELEMENTS" :key="element" :value="element">
                {{ element }}
              </option>
            </select></label
          >
          <template v-else
            ><label
              ><span>已消费元素</span
              ><select
                :value="role.consumedElement"
                @change="
                  emit('updateRole', {
                    ...role,
                    consumedElement: ($event.target as HTMLSelectElement)
                      .value as InflictionElement,
                  })
                "
              >
                <option v-for="element in INFLICTION_ELEMENTS" :key="element" :value="element">
                  {{ element }}
                </option>
              </select></label
            ><label
              ><span>输入元素</span
              ><select
                :value="role.incomingElement"
                @change="
                  emit('updateRole', {
                    ...role,
                    incomingElement: ($event.target as HTMLSelectElement)
                      .value as InflictionElement,
                  })
                "
              >
                <option v-for="element in INFLICTION_ELEMENTS" :key="element" :value="element">
                  {{ element }}
                </option>
              </select></label
            ></template
          >
        </template>
      </fieldset>
      <fieldset v-if="!layer || layer === 'spellBurst'">
        <legend v-if="!layer">
          <label
            ><input
              type="checkbox"
              :checked="spellBurst !== undefined"
              @change="
                emit(
                  'updateSpellBurst',
                  ($event.target as HTMLInputElement).checked
                    ? BUFF_OPTIONAL_OBJECTS.spellBurst.create()
                    : undefined,
                )
              "
            />法术爆发参数</label
          >
        </legend>
        <template v-if="spellBurst"
          ><label
            ><span>爆发类型</span
            ><input
              type="text"
              :value="spellBurst.burstType"
              @input="
                emit('updateSpellBurst', {
                  ...spellBurst,
                  burstType: ($event.target as HTMLInputElement).value,
                })
              " /></label
          ><label
            ><span>伤害类型</span
            ><select
              :value="spellBurst.damageType"
              @change="
                emit('updateSpellBurst', {
                  ...spellBurst,
                  damageType: ($event.target as HTMLSelectElement).value as DamageType,
                })
              "
            >
              <option v-for="damageType in DAMAGE_TYPES" :key="damageType" :value="damageType">
                {{ damageType }}
              </option>
            </select></label
          ><label
            ><span>SkillSetting 数据键</span
            ><input
              type="text"
              :value="spellBurst.skillSettingDataKey"
              @input="
                emit('updateSpellBurst', {
                  ...spellBurst,
                  skillSettingDataKey: ($event.target as HTMLInputElement).value,
                })
              " /></label
          ><label
            ><span>列号（1 基）</span
            ><input
              type="number"
              min="1"
              step="1"
              :value="spellBurst.skillSettingColumn"
              @input="
                finiteNumber($event) !== undefined &&
                emit('updateSpellBurst', {
                  ...spellBurst,
                  skillSettingColumn: Math.max(1, Math.trunc(finiteNumber($event)!)),
                })
              " /></label
          ><label
            ><span>原始基础倍率（仅作证据保留）</span
            ><input
              type="number"
              step="0.01"
              :value="spellBurst.atkScaleBase"
              @input="
                finiteNumber($event) !== undefined &&
                emit('updateSpellBurst', { ...spellBurst, atkScaleBase: finiteNumber($event)! })
              " /></label
        ></template>
      </fieldset>
    </div>
  </section>
</template>

<style scoped>
.layer-only.advanced-editor {
  border: 0;
  margin: 0;
  padding: 0;
}
.layer-only .advanced-content {
  margin: 0;
}
.layer-only .advanced-content fieldset {
  border: 0;
  padding: 0;
  margin: 0;
  grid-template-columns: minmax(0, 1fr);
}
.layer-only .advanced-content fieldset > label {
  grid-template-columns: minmax(0, 1fr);
  gap: 4px;
}
.layer-only p {
  color: var(--ea-fg-muted);
  margin: 0;
}
.advanced-editor {
  margin-top: 12px;
  border-top: 1px solid var(--ea-border-soft);
  padding-top: 10px;
}
.advanced-editor > header button {
  width: 100%;
  text-align: left;
}
.advanced-editor button,
.advanced-editor input,
.advanced-editor select {
  min-width: 0;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
.advanced-content {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}
.advanced-content fieldset {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 12px;
  border: 1px solid var(--ea-border-soft);
}
.advanced-content legend label {
  display: flex;
  align-items: center;
  gap: 6px;
}
.advanced-content legend input {
  width: 15px;
  height: 15px;
}
.advanced-content fieldset > label {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}
</style>
