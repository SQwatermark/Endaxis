import { describe, expect, it } from 'vitest';
import mindMapSource from '../timeline/components/SkillStructureMindMap.vue?raw';
import source from './OperatorEditorWorkspaceDemo.vue?raw';

describe('OperatorEditorWorkspaceDemo structure', () => {
  it('uses one-level drilldown instead of nested dialogs', () => {
    expect(source).toContain('class="breadcrumbs"');
    expect(source).toContain('class="node-list"');
    expect(source).toContain('class="inspector"');
    expect(source).toContain('class="problems-panel"');
    expect(source).toContain('class="structure-preview"');
    expect(source).toContain('class="flow-sequence"');
    expect(source).toContain('class="flow-control flow-condition"');
    expect(source).toContain('class="flow-control flow-loop"');
    expect(source).toContain('class="flow-branches"');
    expect(source).toContain('ExpandedFlowSequence');
    expect(source).toContain('SkillMindMap');
    expect(source).toContain('class="expanded-skill-structure"');
    expect(source).toContain('默认展开全部序列、条件分支和循环 Body');
    expect(source).toContain("'TRUE / Then'");
    expect(source).toContain("'FALSE / Else'");
    expect(source).not.toContain('@dblclick');
    expect(source).not.toContain('<el-dialog');
  });

  it('projects real operator definitions and supports reference and problem jumps', () => {
    expect(source).toContain("import { rossi, tangtang } from '../../data/operators'");
    expect(source).toContain('class="skill-map"');
    expect(source).toContain('class="timeline-lanes"');
    expect(source).toContain('openComplexSample');
    expect(source).toContain('jumpToReference');
    expect(source).toContain('revealIssue');
    expect(source).toContain('validateSkillDefinition');
  });

  it('provides a free-roaming map with per-node expansion state', () => {
    expect(mindMapSource).toContain('startPan');
    expect(mindMapSource).toContain('zoomAtPointer');
    expect(mindMapSource).toContain('toggleNode');
    expect(mindMapSource).toContain('collapsedIds');
    expect(mindMapSource).toContain('expandTwoLevels');
    expect(mindMapSource).toContain('仅显示根节点');
  });
});
