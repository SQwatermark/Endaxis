import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { expect, it } from 'vitest';
import Editor from './BuffAdvancedPropertiesEditor.vue';
import { BUFF_OPTIONAL_OBJECTS } from '../buffOptionalObjectGraph';

it.each(['sustainedProtection', 'role', 'spellBurst'] as const)(
  'renders only the selected %s fields without collection framing',
  async layer => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Editor, {
            layer,
            sustainedProtection: BUFF_OPTIONAL_OBJECTS.sustainedProtection.create(),
            role: BUFF_OPTIONAL_OBJECTS.role.create(),
            spellBurst: BUFF_OPTIONAL_OBJECTS.spellBurst.create(),
          }),
      }),
    );
    expect(html).not.toContain('高级原生语义');
    expect(html).not.toContain('<legend');
    expect(html).not.toContain('SkillAffix');
    expect(html.includes('冲击抗性')).toBe(layer === 'sustainedProtection');
    expect(html.includes('角色类型')).toBe(layer === 'role');
    expect(html.includes('SkillSetting 数据键')).toBe(layer === 'spellBurst');
  },
);
