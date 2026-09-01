import { describe, expect, it } from 'vitest';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { COMBO_WINDOW_DURATION_FRAMES, ComboWindowRuntime } from './comboWindowRuntime';

function advance(clock: CombatClock, runtime: ComboWindowRuntime, frames: number): void {
  for (let index = 0; index < frames; index += 1) {
    clock.advanceFrame();
    runtime.advanceFrame();
  }
}

describe('ComboWindowRuntime', () => {
  it('uses the fixed five-second lifetime', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const runtime = new ComboWindowRuntime(clock, receipt);

    const window = runtime.open('rossi', 'comboSkillStage2');
    expect(COMBO_WINDOW_DURATION_FRAMES).toBe(150);
    expect(window.remainingFrames).toBe(150);

    advance(clock, runtime, 149);
    expect(runtime.first).toBe(window);
    advance(clock, runtime, 1);
    expect(window.remainingFrames).toBe(0);
    expect(runtime.first).toBe(window);
    advance(clock, runtime, 1);
    expect(runtime.first).toBeUndefined();
    expect(receipt.entries.map(entry => entry.event)).toEqual([
      'ComboWindowOpened',
      'ComboWindowExpired',
    ]);
  });

  it('freezes remaining time while globally or individually paused', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const runtime = new ComboWindowRuntime(clock, receipt);

    const perlica = runtime.open('perlica', 'comboSkill');
    const rossi = runtime.open('rossi', 'comboSkill');
    runtime.setOperatorPaused('perlica', true);
    advance(clock, runtime, 10);
    expect(perlica.remainingFrames).toBe(150);
    expect(rossi.remainingFrames).toBe(140);

    runtime.setGloballyPaused(true);
    advance(clock, runtime, 10);
    expect(perlica.remainingFrames).toBe(150);
    expect(rossi.remainingFrames).toBe(140);
  });

  it('orders same-frame records by configured track order', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const runtime = new ComboWindowRuntime(clock, receipt, ['perlica', 'rossi']);

    runtime.open('rossi', 'comboSkill');
    runtime.open('perlica', 'comboSkill');

    expect(runtime.first?.operatorId).toBe('perlica');
    expect(runtime.tryConsume('rossi', 'comboSkill')).toBe(false);
    expect(runtime.tryConsume('perlica', 'comboSkill')).toBe(true);
    expect(runtime.first?.operatorId).toBe('rossi');
  });

  it('clears every candidate recorded for the consumed operator', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const runtime = new ComboWindowRuntime(clock, receipt);

    runtime.open('perlica', 'comboSkill');
    runtime.open('perlica', 'comboSkill');

    expect(runtime.pending).toHaveLength(2);
    expect(runtime.tryConsume('perlica', 'comboSkill')).toBe(true);
    expect(runtime.pending).toHaveLength(0);
  });

  it('only consumes the queue head with the matching operator and stage', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const runtime = new ComboWindowRuntime(clock, receipt);

    runtime.open('perlica', 'comboSkill');
    runtime.open('rossi', 'comboSkillStage2');

    expect(runtime.tryConsume('rossi', 'comboSkillStage2')).toBe(false);
    expect(runtime.tryConsume('perlica', 'battleSkill')).toBe(false);
    expect(runtime.tryConsume('perlica', 'comboSkill')).toBe(true);
    expect(runtime.tryConsume('rossi', 'comboSkillStage2')).toBe(true);
    expect(runtime.pending).toHaveLength(0);
  });
});
