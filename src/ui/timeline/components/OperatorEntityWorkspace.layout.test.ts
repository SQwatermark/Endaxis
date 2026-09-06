import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import workspace from './OperatorDefinitionWorkspaceDialog.vue?raw';
import entities from './AbilityEntityDefinitionsDialog.vue?raw';
import graph from './AbilityEntityDefinitionGraphEditor.vue?raw';
import buffGraph from './BuffDefinitionGraphEditor.vue?raw';
import buffForm from './BuffStepEditor.vue?raw';
const layout = readFileSync(new URL('./definitionGraphViewport.css', import.meta.url), 'utf8');

it('allocates entity editing inside the shared viewport shell without fixed graph dimensions', () => {
  expect(workspace).toContain("import './definitionWorkspaceLayout.css'");
  expect(workspace).toContain('operator-definition-workspace definition-workspace-dialog');
  expect(workspace).toContain('top="24px"');
  expect(workspace).not.toContain('min-height: 520px');
  expect(workspace).toContain("section === 'entities' && showEntityEditor");
  expect(workspace).toContain('entity-editing-section');
  expect(entities).toContain('fill-available');
  expect(entities).not.toContain('grid-template-columns: 320px');
  expect(graph).toContain('fillAvailable?: boolean');
  expect(layout).toContain('.definition-graph-editor.fill-available');
  expect(layout).toContain('grid-template-columns: minmax(0, 1fr) minmax(220px, 40%)');
  expect(layout).toContain('grid-template-rows: auto minmax(0, 1fr)');
});

it('keeps a bounded editor beside the entity list at narrow widths', () => {
  expect(workspace).toContain('grid-template-rows: auto minmax(0, 1fr)');
  expect(workspace).toContain('.workspace-nav .nav-caption');
  expect(entities).toContain('grid-template-columns: 150px minmax(0, 1fr)');
  expect(entities).not.toContain('max-height: 220px');
  expect(layout).toContain('@container definition-map (max-width: 320px)');
  expect(layout).toContain('overflow-x: auto');
});
it('shares graph viewport constraints while keeping Buff form fields responsive', () => {
  for (const source of [graph, buffGraph])
    expect(source).toContain('<style scoped src="./definitionGraphViewport.css">');
  expect(workspace).toContain('buff-editing-section');
  expect(buffForm).toContain('@container (max-width: 360px)');
  expect(buffForm).toContain('min-inline-size: 0');
});
