import { test, expect } from './helpers';
import type { Locator, Page } from '@playwright/test';

async function choose(page: Page, control: Locator, option: string) {
  await control.click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/browser/fields/index.html');
  await expect(page.getByRole('heading', { name: 'Real field components' })).toBeVisible();
});

for (const name of ['union', 'optional', 'array', 'record']) {
  test(`${name} keeps reference identity through missing catalogs and host undo`, async ({
    page,
  }) => {
    const field = page.getByTestId(name);
    const reference = field.locator('.reference-field').first();
    await expect(reference).toHaveAttribute('data-reference-state', 'invalid');
    await expect(reference).toContainText('stale-id');
    await expect(reference.getByRole('combobox')).toHaveCount(1);
    await expect(field.locator('textarea')).toHaveCount(0);
    // ElSelect has an internal input; the important invariant is no plain EaInput.
    await expect(reference.locator('.ea-input')).toHaveCount(0);
    for (const [button, catalog, state] of [
      ['Empty catalog', 'empty', 'invalid'],
      ['Unknown catalog', 'contextUnknown', 'contextUnknown'],
    ]) {
      await page.getByRole('button', { name: button, exact: true }).click();
      await expect(reference).toHaveAttribute('data-reference-catalog', catalog!);
      await expect(reference).toHaveAttribute('data-reference-state', state!);
      await expect(reference).toContainText('stale-id');
      await expect(page.getByTestId('commits')).toHaveText('0');
    }
    await page.getByRole('button', { name: 'Available catalog' }).click();
    await choose(page, reference.getByRole('combobox'), 'Known buff · Project');
    await expect(reference).toHaveAttribute('data-reference-state', 'valid');
    await expect(page.getByTestId('commits')).toHaveText('1');
    await page.getByRole('button', { name: 'Host undo' }).click();
    await expect(reference).toHaveAttribute('data-reference-state', 'invalid');
    await expect(reference).toContainText('stale-id');
  });
}

test('optional disable/enable restores its reference draft', async ({ page }) => {
  const optional = page.getByTestId('optional');
  await optional.getByRole('checkbox').uncheck();
  await expect(page.getByTestId('state')).not.toContainText('"optional"');
  await optional.getByRole('checkbox').check();
  await expect(page.getByTestId('state')).toContainText('"optional":"stale-id"');
  await expect(optional.locator('.reference-field')).toHaveAttribute(
    'data-reference-state',
    'invalid',
  );
});

test('creator selects a union reference, cancels without committing, then starts fresh', async ({
  page,
}) => {
  const creator = page.getByTestId('creator');
  await creator.getByRole('button', { name: 'Open creator' }).click();
  const editor = creator.locator('.definition-value-creator');
  await choose(
    page,
    editor.locator('.definition-value-creator__selector').getByRole('combobox'),
    'Text',
  );
  const reference = editor.locator('.reference-field');
  await expect(reference).toHaveAttribute('data-reference-state', 'unset');
  const apply = editor.locator('.definition-value-creator__actions button').first();
  await expect(apply).toBeDisabled();
  await choose(page, reference.getByRole('combobox'), 'Known buff · Project');
  await expect(apply).toBeEnabled();
  await editor.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByTestId('created')).toHaveText('null');
  await creator.getByRole('button', { name: 'Open creator' }).click();
  await expect(editor.locator('.reference-field')).toHaveCount(0);
  await choose(
    page,
    editor.locator('.definition-value-creator__selector').getByRole('combobox'),
    'Text',
  );
  await expect(editor.locator('.reference-field')).toHaveAttribute('data-reference-state', 'unset');
  await choose(
    page,
    editor.locator('.reference-field').getByRole('combobox'),
    'Known buff · Project',
  );
  await editor.locator('.definition-value-creator__actions button').first().click();
  await expect(page.getByTestId('created')).toHaveText('"known"');
});

test('node reference survives absent candidates and numeric drafts can be discarded', async ({
  page,
}) => {
  const node = page.getByTestId('node');
  const reference = node.locator('.reference-field');
  await expect(reference).toHaveAttribute('data-reference-state', 'invalid');
  await page.getByRole('button', { name: 'Empty catalog' }).click();
  await expect(reference).toHaveAttribute('data-reference-catalog', 'empty');
  await expect(reference).toContainText('stale-id');
  await page.getByRole('button', { name: 'Unknown catalog' }).click();
  await expect(reference).toHaveAttribute('data-reference-catalog', 'contextUnknown');
  await page.getByRole('button', { name: 'Available catalog' }).click();
  await choose(page, reference.getByRole('combobox'), 'Known buff · Project');
  await expect(page.getByTestId('node-value')).toContainText('"buffId":"known"');
  const number = node.locator('input[type="number"]');
  await number.fill('7');
  await expect(page.getByTestId('node-pending')).toHaveText('true');
  await number.press('Escape');
  await expect(number).toHaveValue('1');
  await expect(page.getByTestId('node-value')).toContainText('"amount":1');
  await expect(page.getByTestId('node-commits')).toHaveText('1');
});

test('rejected node commit retains the pending draft for correction', async ({ page }) => {
  const node = page.getByTestId('node');
  await node.getByRole('checkbox', { name: 'Reject node commits' }).check();
  const number = node.locator('input[type="number"]');
  await number.fill('7');
  await number.press('Tab');
  await expect(node.getByRole('alert')).toBeVisible();
  await expect(number).toHaveValue('7');
  await expect(page.getByTestId('node-value')).toContainText('"amount":1');
  await expect(page.getByTestId('node-commits')).toHaveText('0');
  await number.focus();
  await number.press('Escape');
  await expect(number).toHaveValue('1');
  await expect(node.getByRole('alert')).toHaveCount(0);
});

test('read-only target navigation is available only for a unique visible identity', async ({
  page,
}) => {
  const scope = page.getByTestId('scoped-reference');
  const reference = scope.locator('.reference-field');
  await expect(reference.getByRole('combobox')).toBeDisabled();
  await expect(reference).toHaveAttribute('data-reference-state', 'valid');
  await expect(reference).toContainText('Read-only target');
  await reference.getByRole('button', { name: 'Open target' }).click();
  await expect(page.getByTestId('navigation-count')).toHaveText('1');
  await scope.getByRole('button', { name: 'Duplicate target' }).click();
  await expect(reference).toHaveAttribute('data-reference-state', 'ambiguous');
  await expect(reference.getByRole('button', { name: 'Open target' })).toHaveCount(0);
  await scope.getByRole('button', { name: 'Invisible target' }).click();
  await expect(reference).toHaveAttribute('data-reference-state', 'invisible');
  await expect(reference.getByRole('button', { name: 'Open target' })).toHaveCount(0);
  await expect(page.getByTestId('navigation-count')).toHaveText('1');
});

test('creator keeps its reference draft but blocks apply after catalog refresh', async ({
  page,
}) => {
  const creator = page.getByTestId('creator');
  await creator.getByRole('button', { name: 'Open creator' }).click();
  const editor = creator.locator('.definition-value-creator');
  await choose(
    page,
    editor.locator('.definition-value-creator__selector').getByRole('combobox'),
    'Text',
  );
  const reference = editor.locator('.reference-field');
  await choose(page, reference.getByRole('combobox'), 'Known buff · Project');
  const apply = editor.locator('.definition-value-creator__actions button').first();
  await expect(apply).toBeEnabled();
  await page.getByRole('button', { name: 'Empty catalog' }).click();
  await expect(apply).toBeDisabled();
  await expect(reference).toContainText('known');
  await expect(page.getByTestId('created')).toHaveText('null');
  await page.getByRole('button', { name: 'Available catalog' }).click();
  await expect(apply).toBeEnabled();
  await apply.click();
  await expect(page.getByTestId('created')).toHaveText('"known"');
});
