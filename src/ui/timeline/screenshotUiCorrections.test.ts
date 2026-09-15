import { describe, expect, it } from 'vitest';
import router from '../../router/index.ts?raw';
import editor from './TimelineEditor.vue?raw';
import ruler from './components/TimelineRuler.vue?raw';

describe('annotated timeline UI corrections', () => {
  it('preloads enemy names before the synchronous selector renders', () => {
    const timelineRoute = router.slice(
      router.indexOf("path: '/timeline'"),
      router.indexOf("path: '/timeline/preview/:legacyShareId'"),
    );
    expect(timelineRoute).toContain('ALL_GAME_TEXT_FAMILIES');
  });
  it('removes only the cursor white line, retaining keycaps and automatic simulation', () => {
    expect(ruler).not.toContain('<span class="cursor"');
    expect(ruler).toContain('v-for="operation in operationMarkers"');
    expect(editor).not.toContain("{{ t('timeline.reSimulate') }}");
    expect(editor).toContain('useScenarioSimulation');
  });
});
