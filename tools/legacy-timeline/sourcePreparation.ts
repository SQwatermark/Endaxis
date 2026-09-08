import { PROJECT_FPS, type SkillCastDocument } from '../../src/core/project/schema';

export interface ConversionMappings {
  operators?: Record<string, string>;
  weapons?: Record<string, string>;
  gears?: Record<string, string>;
  enemies?: Record<string, string>;
  /** 按旧干员 ID 分组；匹配完整技能身份，段号和变体缺省表示源字段也缺省。 */
  skills?: Record<
    string,
    readonly {
      source: LegacySkillIdentity;
      target: SkillCastDocument['source'];
    }[]
  >;
  /** 精确旧坐标：方案 ID / 轨道下标 / 动作下标，不按名称猜变体。 */
  actions?: Record<string, SkillCastDocument['source']>;
}
export interface LegacySkillIdentity {
  skillId?: string;
  sourceSkillKey?: string;
  type?: string;
  segmentIndex?: number;
  variantKey?: string;
}
export function legacySkillIdentity(action: LegacySkillIdentity): LegacySkillIdentity {
  return {
    skillId: action.skillId,
    sourceSkillKey: action.sourceSkillKey,
    type: action.type,
    segmentIndex: action.segmentIndex,
    variantKey: action.variantKey,
  };
}
export interface ConversionIssue {
  path: string;
  message: string;
}
export interface TimeConversion {
  path: string;
  sourceValue: number;
  sourceFps: number;
  /** 原存档坐标原点；时长为 0，绝对时刻为该方案的原始战前准备时长。 */
  sourceOrigin: number;
  frame: number;
  errorSeconds: number;
}
type Row = Record<string, any>;
function object(value: unknown): Row {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('expected object');
  return value as Row;
}
const timeKeys = new Set([
  'prepDuration',
  'battleDuration',
  'simulationStartline',
  'simulationEndline',
  'staggerBreakDuration',
  'staggerNodeDuration',
  'startTime',
  'logicalStartTime',
  'time',
]);

/** 只规格化迁移使用的输入；旧派生结果不作为目标项目的数据源。 */
export function prepareLegacySource(input: unknown, mappings: ConversionMappings = {}) {
  const root = object(JSON.parse(JSON.stringify(input)));
  if (root.version !== '1.0.0' || !Array.isArray(root.scenarioList))
    throw new Error('仅支持 version=1.0.0 的 scenarioList 项目');
  if (root.timeUnit !== undefined && root.timeUnit !== 'frame')
    throw new Error('未知 timeUnit，不能猜测时间单位');
  const sourceFps = root.timeUnit === 'frame' ? root.fps : 1;
  if (!Number.isFinite(sourceFps) || sourceFps <= 0) throw new Error('帧存档必须明确提供有效 fps');
  const issues: ConversionIssue[] = [];
  const times: TimeConversion[] = [];
  const identityChanges: { path: string; from: string; to: string }[] = [];
  const unresolvedSkills: { path: string; operator: string; source: LegacySkillIdentity }[] = [];
  const seen = new Set<string>();
  for (const [si, wrapper] of root.scenarioList.entries()) {
    object(wrapper);
    if (typeof wrapper.id !== 'string' || seen.has(wrapper.id))
      throw new Error('方案 ID 缺失或重复');
    seen.add(wrapper.id);
    const d = object(wrapper.data);
    const sourceOrigin = d.prepDuration ?? 0;
    if (!Number.isFinite(sourceOrigin) || sourceOrigin < 0) throw new Error('非法战前准备时长');
    const prefix = 'scenarioList[' + si + '].data';
    const enemyTarget = mappings.enemies?.[d.activeEnemyId];
    if (enemyTarget) {
      identityChanges.push({
        path: prefix + '.activeEnemyId',
        from: d.activeEnemyId,
        to: enemyTarget,
      });
      d.activeEnemyId = enemyTarget;
    }
    for (const key of [
      'characterOverrides',
      'weaponOverrides',
      'equipmentCategoryOverrides',
      'connections',
      'inheritedInitialEffects',
      'inheritedInitialEnemyState',
      'contingencyContractTags',
    ]) {
      if (d[key] != null && Object.keys(Object(d[key])).length)
        issues.push({
          path: prefix + '.' + key,
          message: '存在尚不支持的用户配置，不生成完整项目',
        });
    }
    if (d.globalConfig?.presetId || d.globalConfig?.customModifiers?.length)
      issues.push({ path: prefix + '.globalConfig', message: '全局配置尚未转换' });
    const constants = object(d.systemConstants);
    if (constants.linkCdReduction)
      issues.push({
        path: prefix + '.systemConstants.linkCdReduction',
        message: '连携冷却修正尚未转换',
      });
    if (
      constants.finisherDamageTakenMultiplier != null &&
      constants.finisherDamageTakenMultiplier !== 1
    )
      issues.push({
        path: prefix + '.systemConstants.finisherDamageTakenMultiplier',
        message: '处决承伤修正尚未转换',
      });
    if (!Array.isArray(d.tracks) || d.tracks.length > 4) throw new Error('只支持最多四条轨道');
    // 旧 SwitchEvent 保存的是轨道 characterId，必须在干员身份重映射之前解析。
    for (const [index, event] of (d.switchEvents ?? []).entries()) {
      object(event);
      const matches = d.tracks
        .map((track: Row, trackIndex: number) => ({ id: track.id, trackIndex }))
        .filter((track: { id: unknown }) => track.id === event.characterId);
      if (event.characterId !== undefined) {
        if (
          matches.length !== 1 ||
          (event.trackIndex !== undefined && event.trackIndex !== matches[0]!.trackIndex)
        ) {
          issues.push({
            path: `${prefix}.switchEvents[${index}]`,
            message: '切入目标不唯一、不存在或与轨道下标冲突',
          });
          continue;
        }
        event.trackIndex = matches[0]!.trackIndex;
      }
      if (
        !Number.isInteger(event.trackIndex) ||
        event.trackIndex < 0 ||
        event.trackIndex >= d.tracks.length
      )
        issues.push({
          path: `${prefix}.switchEvents[${index}]`,
          message: '切入标记缺少有效目标轨道',
        });
    }
    for (const [ti, t] of d.tracks.entries()) {
      object(t);
      const oldOperator = t.id;
      const mappedOperator = mappings.operators?.[oldOperator];
      if (mappedOperator) {
        identityChanges.push({
          path: prefix + '.tracks[' + ti + '].id',
          from: oldOperator,
          to: mappedOperator,
        });
        t.id = mappedOperator;
      }
      if (!Array.isArray(t.actions)) throw new Error('轨道缺少 actions 数组');
      for (const [ai, action] of t.actions.entries()) {
        object(action);
        delete action.convertedSource;
        const path = wrapper.id + '/' + ti + '/' + ai;
        const identity = legacySkillIdentity(action);
        const candidates = (mappings.skills?.[oldOperator] ?? []).filter(
          rule => JSON.stringify(legacySkillIdentity(rule.source)) === JSON.stringify(identity),
        );
        const override = mappings.actions?.[path];
        if (override) action.convertedSource = override;
        else if (candidates.length === 1) action.convertedSource = candidates[0]!.target;
        else {
          issues.push({ path, message: candidates.length ? '技能映射不唯一' : '缺少显式技能映射' });
          unresolvedSkills.push({ path, operator: oldOperator, source: identity });
        }
        if (action.startTime !== action.logicalStartTime && action.logicalStartTime != null)
          issues.push({
            path: prefix + '.tracks[' + ti + '].actions[' + ai + ']',
            message: '显示/逻辑起点不同，需先核实旧时间编译语义',
          });
      }
    }
    for (const op of d.operators ?? []) {
      const target = mappings.operators?.[op.operatorSlug];
      if (target) op.operatorSlug = target;
    }
    for (const [collection, key, map] of [
      ['weapons', 'weaponSlug', mappings.weapons],
      ['gears', 'gearPieceId', mappings.gears],
    ] as const) {
      for (const [index, row] of (d[collection] ?? []).entries()) {
        const target = map?.[row[key]];
        if (target) {
          identityChanges.push({
            path: prefix + '.' + collection + '[' + index + '].' + key,
            from: row[key],
            to: target,
          });
          row[key] = target;
        }
      }
    }
    // 旧 timeSerialization.ts 明确按字段名保存时间。只遍历迁移消费的区域，
    // 不量化 hits、效果、面板等派生快照，也不经旧版毫秒显示值二次取整。
    function convert(row: Row, path: string) {
      for (const key of Object.keys(row)) {
        const value = row[key];
        if (!timeKeys.has(key) || value == null) continue;
        if (typeof value !== 'number' || !Number.isFinite(value))
          throw new Error(path + '.' + key + ': 非法时间');
        // 旧轴从战前准备开始计时，新轴以开战为 0；先平移源坐标再取整，
        // 不能用两个已经分别取整的时刻相减，否则奇数源帧会额外偏移一帧。
        const origin = [
          'startTime',
          'logicalStartTime',
          'simulationStartline',
          'simulationEndline',
          'time',
        ].includes(key)
          ? sourceOrigin
          : 0;
        const seconds = (value - origin) / sourceFps;
        const frame = Math.round(seconds * PROJECT_FPS);
        times.push({
          path: path + '.' + key,
          sourceValue: value,
          sourceFps,
          sourceOrigin: origin,
          frame,
          errorSeconds: frame / PROJECT_FPS - seconds,
        });
        row[key] = frame;
      }
    }
    convert(d, prefix);
    convert(constants, prefix + '.systemConstants');
    d.tracks.forEach((t: Row, ti: number) =>
      t.actions.forEach((a: Row, ai: number) =>
        convert(a, prefix + '.tracks[' + ti + '].actions[' + ai + ']'),
      ),
    );
    for (const key of ['cycleBoundaries', 'switchEvents'])
      (d[key] ?? []).forEach((row: Row, index: number) =>
        convert(row, prefix + '.' + key + '[' + index + ']'),
      );
  }
  return { source: root, issues, times, identityChanges, unresolvedSkills };
}
