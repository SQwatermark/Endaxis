<script setup lang="ts">
import type { OperatorDefinition } from '../../../core/game-data/operatorDefinition';
import type { OperatorWorkspaceTarget, OperatorWorkspaceArea } from '../operatorWorkspaceStructure';

defineProps<{ definition: OperatorDefinition; displayName: string }>();
const emit = defineEmits<{ navigate: [target: OperatorWorkspaceTarget] }>();
const talents = [0, 1] as const;
const potentials = [0, 1, 2, 3, 4] as const;
const logic: readonly { area: OperatorWorkspaceArea; title: string; description: string }[] = [
  { area: 'blackboard', title: '角色黑板', description: '跨技能共享的初值' },
  { area: 'initialization', title: '构筑初始化', description: '根据构筑计算角色初值' },
  { area: 'passives', title: '常驻被动', description: '随角色安装，不依赖天赋解锁' },
  { area: 'listeners', title: '事件响应', description: '角色监听的事件与后续行为' },
  { area: 'combo', title: '连携条件', description: '连携触发与窗口条件' },
];
function open(area: OperatorWorkspaceArea) {
  emit('navigate', { kind: 'area', area });
}
</script>

<template>
  <main class="operator-overview">
    <header>
      <div>
        <h2>{{ displayName }}</h2>
        <p>干员定义 · 修改由引用此模板的实例共享</p>
      </div>
      <button @click="open('identity')">身份与来源</button>
    </header>
    <div class="overview-columns">
      <section>
        <h3>基本信息与成长</h3>
        <button class="entry" @click="open('profile')">
          <span>干员信息</span><small>名称、资源、职业与属性类型</small><b>›</b>
        </button>
        <button class="entry" @click="open('growth')">
          <span>属性成长</span><small>Lv.1 · 20 · 40 · 60 · 80 · 90 / 信赖</small><b>›</b>
        </button>
        <button class="entry" @click="open('defaults')">
          <span>实例默认值</span><small>创建与拉满时的默认潜能</small><b>›</b>
        </button>
      </section>
      <section>
        <h3>技能</h3>
        <button class="entry" @click="open('skills')">
          <span>技能定义与技能库组织</span><small>执行体直接编辑；放置分组独立组织</small><b>›</b>
        </button>
        <button class="entry" @click="open('actionRouting')">
          <span>技能操作规则</span><small>决定操作对应什么技能，与显示分组无关</small><b>›</b>
        </button>
      </section>
      <section class="full-width">
        <h3>天赋与潜能</h3>
        <div class="progression-slots">
          <button
            v-for="slot in talents"
            :key="`talent-${slot}`"
            @click="emit('navigate', { kind: 'talent', slot })"
          >
            <span>天赋 {{ slot + 1 }}</span
            ><small>{{
              definition.talents[slot] ? `${definition.talents[slot].levels} 级天赋` : '待填写'
            }}</small
            ><b>›</b>
          </button>
          <button
            v-for="slot in potentials"
            :key="`potential-${slot}`"
            @click="emit('navigate', { kind: 'potential', slot })"
          >
            <span>潜能 {{ slot + 1 }}</span
            ><small>该档解锁效果</small><b>›</b>
          </button>
        </div>
      </section>
      <section class="full-width">
        <h3>角色逻辑</h3>
        <div class="logic-grid">
          <button v-for="item in logic" :key="item.area" class="entry" @click="open(item.area)">
            <span>{{ item.title }}</span
            ><small>{{ item.description }}</small
            ><b>›</b>
          </button>
        </div>
      </section>
      <section>
        <h3>附属定义</h3>
        <button class="entry" @click="open('buffs')">
          <span>Buff</span><small>状态及其行为</small><b>›</b>
        </button>
        <button class="entry" @click="open('entities')">
          <span>能力实体</span><small>实体生命周期及子技能</small><b>›</b>
        </button>
      </section>
      <section>
        <h3>表现与诊断</h3>
        <button class="entry" @click="open('presentation')">
          <span>状态栏表现</span><small>角色专属 HUD 与状态来源</small><b>›</b>
        </button>
        <button class="entry" @click="open('provenance')">
          <span>转换与兼容信息</span><small>只读取证结论与旧身份映射</small><b>›</b>
        </button>
      </section>
    </div>
  </main>
</template>

<style scoped>
.operator-overview {
  color: #ddd;
  background: #202022;
  padding: 20px 24px;
  font: 13px/1.5 sans-serif;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
}
h2 {
  margin: 0;
  font-size: 19px;
}
p {
  margin: 4px 0 0;
  color: #999;
}
h3 {
  color: #c5c5c5;
  font-size: 12px;
  margin: 0 0 8px;
}
.overview-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 24px;
}
.full-width {
  grid-column: 1 / -1;
}
button {
  color: inherit;
  font: inherit;
  border: 1px solid #444;
  background: #29292c;
  padding: 6px 10px;
  cursor: pointer;
}
button:hover,
button:focus-visible {
  border-color: #d9c842;
  outline: none;
  background: #33322c;
}
.entry {
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
  text-align: left;
  margin-top: 5px;
  padding: 8px 12px;
}
small {
  color: #999;
  font-size: 11px;
}
.entry small {
  grid-column: 1;
}
b {
  grid-column: 2;
  grid-row: 1 / 3;
  align-self: center;
  font-size: 18px;
  color: #999;
  font-weight: normal;
}
.progression-slots {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}
.progression-slots button {
  display: grid;
  grid-template-columns: 1fr auto;
  text-align: left;
  padding: 10px;
}
.progression-slots small {
  grid-column: 1;
}
.logic-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 8px;
}
@media (max-width: 760px) {
  .overview-columns {
    grid-template-columns: 1fr;
  }
  .progression-slots {
    grid-template-columns: repeat(2, 1fr);
  }
  .logic-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
