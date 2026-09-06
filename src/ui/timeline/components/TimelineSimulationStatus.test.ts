import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createI18n } from 'vue-i18n';
import { expect, it } from 'vitest';
import messages from '../../../i18n/locales/zh-CN.json';
import TimelineSimulationStatus from './TimelineSimulationStatus.vue';

it.each([
  [false, false, null, true, [], ['等待模拟', '上次结果', '模拟失败']],
  [false, true, null, false, ['等待模拟'], ['上次结果']],
  [false, true, null, true, ['等待模拟', '上次结果（已过期）'], ['模拟失败']],
  [true, true, null, true, ['模拟中', '上次结果（已过期）'], ['等待模拟']],
  [false, true, 'bad data', true, ['模拟失败', 'bad data', '上次结果（已过期）'], ['等待模拟']],
  [false, false, 'bad data', false, ['模拟失败'], ['上次结果', '等待模拟']],
] as const)(
  'renders feedback for running=%s stale=%s error=%s result=%s',
  async (running, stale, error, hasResult, includes, excludes) => {
    const app = createSSRApp(TimelineSimulationStatus, { running, stale, error, hasResult });
    app.use(createI18n({ legacy: false, locale: 'zh-CN', messages: { 'zh-CN': messages } }));
    const html = await renderToString(app);
    for (const text of includes) expect(html).toContain(text);
    for (const text of excludes) expect(html).not.toContain(text);
  },
);
