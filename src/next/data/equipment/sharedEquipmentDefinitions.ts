/**
 * 从现有只读武器、装备与套装定义建立 Next 定义候选。
 *
 * 每个源文件独立适配。实际定义采用宽松模式：可靠的身份和静态字段会注册，尚未支持的
 * 战斗逻辑作为结构化问题保留；源数据骨架无效时才拒绝注册。该模块不依赖旧版聚合 index。
 */
import type { GearPieceSheet, GearSetSheet, WeaponSheet } from '../../../data/types';
import type {
  GearDefinition,
  GearSetDefinition,
  WeaponDefinition,
} from '../../core/game-data/equipmentDefinition';
import {
  adaptSharedGear,
  adaptSharedGearSet,
  adaptSharedWeapon,
  type SharedEquipmentAdaptationIssue,
  type SharedEquipmentAdaptationResult,
} from './adaptSharedEquipment';
import { akedbWeaponDefinitions } from './akedbWeaponDefinitions';
import { generatedGearDefinitions } from './generated/index.generated';
import { generatedGearSetDefinitions } from './generated-gear-sets/index.generated';
import { registerGeneratedGearDefinitions } from './generatedGearRegistration';
import { registerGeneratedGearSetDefinitions } from './generatedGearSetRegistration';

const weaponModules = import.meta.glob('../../../data/weapons/**/*.ts', {
  eager: true,
  import: 'default',
}) as Record<string, WeaponSheet>;
const gearModules = import.meta.glob('../../../data/gearpieces/**/*.ts', {
  eager: true,
  import: 'default',
}) as Record<string, GearPieceSheet>;
const gearSetModules = import.meta.glob('../../../data/gearsets/**/*.ts', {
  eager: true,
  import: 'default',
}) as Record<string, GearSetSheet>;

function slugFromModulePath(path: string): string {
  const fileName = path.replaceAll('\\', '/').split('/').at(-1);
  if (!fileName?.endsWith('.ts')) throw new Error(`unexpected equipment module path '${path}'`);
  return fileName.slice(0, -3);
}

function adaptDirectory<TSource, TDefinition>(
  sourceKind: SharedEquipmentSupport['sourceKind'],
  modules: Readonly<Record<string, TSource>>,
  adapt: (slug: string, source: TSource) => SharedEquipmentAdaptationResult<TDefinition>,
): {
  readonly definitions: readonly TDefinition[];
  readonly issues: readonly SharedEquipmentAdaptationIssue[];
  readonly support: readonly SharedEquipmentSupport[];
} {
  const definitions: TDefinition[] = [];
  const issues: SharedEquipmentAdaptationIssue[] = [];
  const support: SharedEquipmentSupport[] = [];
  for (const [path, source] of Object.entries(modules).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const slug = slugFromModulePath(path);
    const result = adapt(slug, source);
    issues.push(...result.issues);
    if (result.ok) {
      definitions.push(result.definition);
      support.push({
        sourceKind,
        slug,
        completeness: result.completeness,
        issues: result.issues,
      });
    }
  }
  return {
    definitions: Object.freeze(definitions),
    issues: Object.freeze(issues),
    support: Object.freeze(support),
  };
}

export interface SharedEquipmentSupport {
  readonly sourceKind: 'weapon' | 'gear' | 'gearSet';
  readonly slug: string;
  readonly completeness: 'complete' | 'partial';
  readonly issues: readonly SharedEquipmentAdaptationIssue[];
}

const weaponEntries = adaptDirectory('weapon', weaponModules, (slug, source) =>
  adaptSharedWeapon(slug, source, { mode: 'permissive' }),
);
const gearEntries = adaptDirectory('gear', gearModules, (slug, source) =>
  adaptSharedGear(slug, source, { mode: 'permissive' }),
);
// `no-set-bonuses` 是无套装归属的旧定义哨兵，不是可触发的三件套定义。
const gearSetEntries = adaptDirectory(
  'gearSet',
  Object.fromEntries(
    Object.entries(gearSetModules).filter(
      ([path]) => slugFromModulePath(path) !== 'no-set-bonuses',
    ),
  ),
  (slug, source) => adaptSharedGearSet(slug, source, { mode: 'permissive' }),
);

export const sharedWeaponDefinitions: readonly WeaponDefinition[] = Object.freeze([
  ...weaponEntries.definitions,
  ...akedbWeaponDefinitions,
]);
export const sharedGearDefinitions: readonly GearDefinition[] = gearEntries.definitions;
/**
 * 当前版本原生定义取代能按图标身份精确关联的旧模板；退出现行表的模板仍保留给旧项目。
 * 注册结果同时提供旧单件 slug 和原生套装 ID 的兼容映射。
 */
export const nextGearDefinitionRegistration = registerGeneratedGearDefinitions(
  generatedGearDefinitions,
  sharedGearDefinitions,
);
export const nextGearDefinitions: readonly GearDefinition[] =
  nextGearDefinitionRegistration.definitions;
export const nextGearSetDefinitionRegistration = registerGeneratedGearSetDefinitions(
  generatedGearSetDefinitions,
  gearSetEntries.definitions,
  nextGearDefinitionRegistration.gearSetAliasesToLegacyDefinitions,
);
export const sharedGearSetDefinitions: readonly GearSetDefinition[] =
  nextGearSetDefinitionRegistration.definitions;
/** 未进入 Next 正式定义的全部原因；新增源数据出现陌生语义时测试应直接暴露。 */
export const sharedEquipmentAdaptationIssues: readonly SharedEquipmentAdaptationIssue[] =
  Object.freeze([...weaponEntries.issues, ...gearEntries.issues, ...gearSetEntries.issues]);

const supportByIdentity = new Map(
  [
    ...weaponEntries.support,
    ...akedbWeaponDefinitions.map(
      definition =>
        ({
          sourceKind: 'weapon',
          slug: definition.slug,
          completeness: 'complete',
          issues: [],
        }) satisfies SharedEquipmentSupport,
    ),
    ...gearEntries.support,
    ...gearSetEntries.support,
    ...generatedGearSetDefinitions.map(
      definition =>
        ({
          sourceKind: 'gearSet',
          slug: definition.slug,
          completeness: 'complete',
          issues: [],
        }) satisfies SharedEquipmentSupport,
    ),
  ].map(item => [`${item.sourceKind}:${item.slug}`, item]),
);

/** UI 可据此提示定义项仅完成基础转换；返回值不参与项目持久化。 */
export function getSharedEquipmentSupport(
  sourceKind: SharedEquipmentSupport['sourceKind'],
  slug: string,
): SharedEquipmentSupport | null {
  const direct = supportByIdentity.get(`${sourceKind}:${slug}`);
  if (direct !== undefined) return direct;
  if (sourceKind !== 'gearSet') return null;
  const canonical = nextGearSetDefinitionRegistration.aliases[slug];
  return canonical === undefined ? null : (supportByIdentity.get(`gearSet:${canonical}`) ?? null);
}
