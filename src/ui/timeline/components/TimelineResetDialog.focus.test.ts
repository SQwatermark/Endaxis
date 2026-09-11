import { describe, expect, it } from 'vitest';
import source from './TimelineResetDialog.vue?raw';

describe('reset dialog focus integration', () => {
  it('uses the existing dialog-library focus stack with a safe initial target', () => {
    expect(source).toContain(
      "import ElFocusTrap from 'element-plus/es/components/focus-trap/index'",
    );
    expect(source).toContain(':focus-trap-el="dialogElement"');
    expect(source).toContain(':focus-start-el="cancelButton"');
    expect(source).toContain("querySelector<HTMLElement>('[data-reset-cancel]')");
    expect(source).toContain('data-reset-cancel');
    expect(source).toMatch(/<ElFocusTrap\s+:trapped="modelValue"\s+loop/);
    expect(source).toContain('tabindex="-1"');
  });

  it('keeps Escape on the command router instead of registering a second close path', () => {
    expect(source).toContain(
      'useDialogInteractionBoundary(session, () => props.modelValue, close, region)',
    );
    expect(source).not.toContain('@release-requested');
    expect(source).not.toContain("addEventListener('keydown'");
  });
});
