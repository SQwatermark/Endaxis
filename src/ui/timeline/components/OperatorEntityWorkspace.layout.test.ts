import { expect, it } from 'vitest';
import workspace from './OperatorDefinitionWorkspaceDialog.vue?raw';
import entities from './AbilityEntityDefinitionsDialog.vue?raw';
import graph from './AbilityEntityDefinitionGraphEditor.vue?raw';

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
  expect(graph).toContain('.definition-graph-editor.fill-available');
  expect(graph).toContain('grid-template-columns: minmax(0, 1fr) minmax(220px, 40%)');
  expect(graph).toContain('grid-template-rows: auto minmax(0, 1fr)');
});

it('keeps a bounded editor beside the entity list at narrow widths', () => {
  expect(workspace).toContain('grid-template-rows: auto minmax(0, 1fr)');
  expect(workspace).toContain('.workspace-nav .nav-caption');
  expect(entities).toContain('grid-template-columns: 150px minmax(0, 1fr)');
  expect(entities).not.toContain('max-height: 220px');
  expect(graph).toContain('@container entity-map (max-width: 320px)');
  expect(graph).toContain('overflow-x: auto');
});
