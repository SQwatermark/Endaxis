import { describe, expect, it } from 'vitest';
import source from './TimelineEditor.vue?raw';

describe('Next timeline editor layout boundaries', () => {
  it('does not pad the four-track stack vertically', () => {
    expect(source).toMatch(/\.track-stack\s*\{[^}]*min-width: 100%;[^}]*box-sizing: border-box;/s);
    expect(source).not.toMatch(/\.track-stack\s*\{[^}]*padding:/s);
  });

  it('keeps the sticky operator identity above timeline children while scrolling left', () => {
    expect(source).toMatch(
      /\.track-identity\s*\{[^}]*position: sticky;[^}]*left: 0;[^}]*z-index: 80;/s,
    );
    expect(source).toMatch(/\.track-lane\s*\{[^}]*position: relative;[^}]*z-index: 1;/s);
  });

  it('keeps the ruler row above vertically scrolling track content without changing its flow', () => {
    expect(source).toMatch(/\.corner-placeholder\s*\{[^}]*position: sticky;[^}]*z-index: 120;/s);
    expect(source).toMatch(/\.timeline-ruler\s*\{[^}]*position: sticky;[^}]*z-index: 110;/s);
  });

  it('uses the enemy panel emitted event names instead of an obsolete index event', () => {
    expect(source).toContain('@select-definition="selectDefinitionEnemy"');
    expect(source).toContain('@select-custom="selectCustomEnemy"');
    expect(source).not.toContain('@select-index=');
  });
});
