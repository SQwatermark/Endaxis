import { describe, expect, it } from 'vitest';
import { validateComboSkillConditions } from './validateComboSkillConditions';
import {
  COMBO_SKILL_CONDITION_EVENTS,
  type ComboSkillConditionDefinition,
} from './operatorDefinition';
import { perlica } from '../../data/operators/perlica';
import { compileOperatorComboSkillConditions } from '../compiler/compileOperatorComboSkillConditions';
import { createEmptyProject } from '../project/createProject';
import { deriveProjectOperatorTemplate } from '../project/projectDefinitionLibrary';
import { parseProjectDocument, serializeProjectDocument } from '../project/serialization';

const entry: ComboSkillConditionDefinition = {
  key: 'condition',
  skillGroupKey: 'comboSkill',
  event: 'beforeTakeInfliction',
  initialValues: { count: 1, label: 'local', empty: null },
  sequence: { steps: [] },
};
const build = {
  operatorSlug: perlica.slug,
  level: 90,
  promoted: true,
  potential: 0,
  trustLevel: 4,
  skillLevels: { comboSkill: 2 },
  talentStates: {},
};
function project(condition: ComboSkillConditionDefinition = entry) {
  return deriveProjectOperatorTemplate(
    createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' }),
    {
      id: 'project:operator:conditions',
      name: 'conditions',
      baseTemplateId: perlica.slug,
      definition: { ...perlica, comboSkillConditions: [condition] },
    },
  );
}

describe('正式原生连携条件结构与绑定', () => {
  it.each(COMBO_SKILL_CONDITION_EVENTS)('%s 接受独立原生事件及现有动作树', event => {
    expect(validateComboSkillConditions([{ ...entry, event }])).toEqual([]);
  });
  it.each(
    [undefined, [], [{ ...entry, initialValues: null }], [{ ...entry, initialValues: {} }]].map(
      value => ({ value }),
    ),
  )('缺省/空列表/禁用板/空板均可表示：%j', ({ value }) => {
    expect(validateComboSkillConditions(value)).toEqual([]);
  });
  it.each(
    [
      null,
      {},
      [null],
      [{ ...entry, key: '' }],
      [entry, entry],
      [{ ...entry, skillGroupKey: 1 }],
      [{ ...entry, event: 'elementalInflictionApplied' }],
      [{ ...entry, event: 121 }],
      [{ ...entry, initialValues: undefined }],
      [{ ...entry, initialValues: { x: [0, 1] } }],
      [{ ...entry, initialValues: { x: NaN } }],
      [{ ...entry, initialValues: { '': 0 } }],
      [{ ...entry, initialValues: { x: false } }],
      [{ ...entry, immediately: true }],
      [{ ...entry, sequence: { steps: [{ kind: 'unknown', parameters: {} }] } }],
    ].map(value => ({ value })),
  )('损坏或尚未支持的字段给出可定位路径：%j', ({ value }) => {
    const issues = validateComboSkillConditions(value, '$.operator.comboSkillConditions');
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.every(issue => issue.path.startsWith('$.operator.comboSkillConditions'))).toBe(
      true,
    );
  });
  it('序列按绑定组等级展开，局部字面板不混进实体板或被当作等级数组', () => {
    const definition = {
      ...perlica,
      comboSkillConditions: [
        {
          ...entry,
          sequence: {
            steps: [
              {
                kind: 'changeResource' as const,
                parameters: { resource: 'sp' as const, amount: [4, 9], recipient: 'team' as const },
              },
            ],
          },
        },
      ],
    };
    const [compiled] = compileOperatorComboSkillConditions(definition, build);
    expect(compiled?.sequence.steps[0]).toMatchObject({
      kind: 'changeResource',
      parameters: { amount: 9 },
    });
    expect(compiled?.initialValues).toEqual(entry.initialValues);
    expect(compiled?.initialValues).not.toBe(entry.initialValues);
    expect(Object.isFrozen(compiled?.initialValues)).toBe(true);
  });
  it.each(['missing', 'battleSkill'])(
    '引用 %s 可保存编辑草稿，但编译场景时严格拒绝',
    skillGroupKey => {
      const condition = { ...entry, skillGroupKey };
      expect(parseProjectDocument(serializeProjectDocument(project(condition))).ok).toBe(true);
      expect(() =>
        compileOperatorComboSkillConditions(
          { ...perlica, comboSkillConditions: [condition] },
          build,
        ),
      ).toThrow('must resolve to exactly one combo skill group');
    },
  );
  it.each([undefined, 0, 1.5, -1])('空序列也不能绕过缺失/非法组等级 %s', level => {
    const invalidBuild: import('../project/schema').OperatorInstanceDocument = {
      ...build,
      skillLevels: level === undefined ? {} : { comboSkill: level },
    };
    expect(() =>
      compileOperatorComboSkillConditions(
        { ...perlica, comboSkillConditions: [entry] },
        invalidBuild,
      ),
    ).toThrow('requires a positive integer level');
  });
  it('重复组身份不能悄悄绑定第一组', () => {
    const combo = perlica.skillGroups.find(group => group.key === 'comboSkill')!;
    expect(() =>
      compileOperatorComboSkillConditions(
        { ...perlica, skillGroups: [combo, combo], comboSkillConditions: [entry] },
        build,
      ),
    ).toThrow('exactly one combo skill group');
  });
  it('项目模板保存加载保留原生条件和 null/字符串，不污染内置定义', () => {
    const loaded = parseProjectDocument(serializeProjectDocument(project()));
    expect(loaded.ok).toBe(true);
    if (!loaded.ok) throw new Error('invalid project');
    expect(
      loaded.value.definitionLibrary?.operators['project:operator:conditions']?.definition
        .comboSkillConditions,
    ).toEqual([entry]);
    expect(perlica.comboSkillConditions).toBeUndefined();
    const raw = JSON.parse(serializeProjectDocument(project()));
    raw.definitionLibrary.operators[
      'project:operator:conditions'
    ].definition.comboSkillConditions[0].initialValues = { count: [0, 1] };
    const rejected = parseProjectDocument(raw);
    expect(rejected.ok).toBe(false);
    if (rejected.ok || rejected.kind !== 'invalid-document')
      throw new Error('expected structure failure');
    expect(rejected.issues[0]?.path).toContain('comboSkillConditions[0].initialValues');
  });
});
