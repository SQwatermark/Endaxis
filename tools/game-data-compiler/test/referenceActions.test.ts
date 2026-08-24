import { describe, expect, it } from 'vitest';

import {
  parseAbilityEntitySpawnActionSource,
  parseProjectileLaunchActionSource,
  parseSkillCastActionSource,
} from '../src/index.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';

const META = {
  $type: 'Example.Action+Data, Example',
  isEnable: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 1,
} as const;

const VECTOR_ZERO = { x: 0, y: 0, z: 0 } as const;
const DIRECTION = {
  directionType: 'SourceForward',
  sourceMountPoint: 'None',
  targetMountPoint: 'None',
  customSourceAndTarget: false,
  clampToXZ: true,
  invertDirection: false,
} as const;

describe('引用闭包动作来源载荷', () => {
  it('投射物保留关闭回调的残留 ID，且不会把它伪装成启用引用', () => {
    const source = parseProjectileLaunchActionSource(
      {
        ...META,
        projectileId: 'projectile_fixture',
        projectileSkillId: '',
        projectileSource: targetFixture('Source'),
        syncTimeScale: true,
        assignEntityBlackboard: true,
        assignPairs: [assignmentFixture('damage_scale', 'atk_scale')],
        assignBlackboard: true,
        emitPos: targetFixture('Source'),
        emitMountPoint: 'None',
        useWeaponMp: false,
        weaponIndex: 0,
        weaponMp: 'Root',
        overrideEmitBone: false,
        emitPosFixedOffset: VECTOR_ZERO,
        emitPosOffsetForward: 'SourceForward',
        emitPosRandomOffset: VECTOR_ZERO,
        targetSettings: targetFixture('Target'),
        overrideHitBone: false,
        hitMountPoint: 'None',
        hitBoneFixedOffset: VECTOR_ZERO,
        hitBoneOffsetForward: 'TargetForward',
        hitBoneRandomOffset: VECTOR_ZERO,
        presetPoints: [{ presetPointKey: 'first', presetPoint: targetFixture('Context') }],
        castSkillOnBlock: false,
        skillIdOnBlock: 'disabled_residue',
        castSkillOnFinish: false,
        skillIdOnFinish: '',
        castSkillOnHit: true,
        castSkillOnReach: false,
        skillIdOnReach: '',
      },
      'fixture.launchProjectile',
    );
    expect(source).toMatchObject({
      kind: 'projectileLaunch',
      projectileSource: { targetSource: 'Source' },
      assignments: [{ targetKey: 'damage_scale', inputValueKey: 'atk_scale' }],
      callbacks: [
        { event: 'block', enabled: false, skillId: 'disabled_residue' },
        { event: 'finish', enabled: false, skillId: '' },
        { event: 'hit', enabled: true, skillId: '' },
        { event: 'reach', enabled: false, skillId: '' },
      ],
      presetPoints: [{ key: 'first', point: { targetSource: 'Context' } }],
    });
  });

  it('能力实体保留关闭赋值的编辑器空占位和未启用目标', () => {
    const source = parseAbilityEntitySpawnActionSource(
      {
        ...META,
        abilityEntityId: 'abilityentity_fixture',
        setAbilityEntitySource: false,
        abilityEntitySource: 'ActionSource',
        abilityEntitySourceContextKey: '',
        setAbilityEntityTarget: false,
        abilityEntityTarget: targetFixture('Target'),
        bornAt: targetFixture('Source'),
        bornMountPoint: 'None',
        bornPosOffset: VECTOR_ZERO,
        checkNavmeshAreaName: false,
        forbiddenAreaNames: [],
        attachToClosestMeshPoint: false,
        yRotateFromBoneToCurPos: false,
        bornRotation: 'SourceForward',
        bornRotationContextTarget: '',
        useAdvancedDirectionSetting: false,
        advancedDirectionSetting: DIRECTION,
        clampToXZPlane: false,
        applyBornRotationOffset: false,
        bornRotationOffset: { x: 0, y: 0, z: 0, w: 1 },
        assignEntityBlackboard: false,
        assignPairs: [assignmentFixture('', '')],
        assignBlackboard: false,
        abilityEntitySkillId: '',
        overrideDuration: false,
        duration: scalarFixture(62),
        saveToContext: false,
        contextKey: '',
        pauseEffectOnEnd: false,
        inheritSourceSkillCastId: true,
        dieWhenSourceDie: true,
        forceSyncInit: false,
        dieOnEnd: true,
      },
      'fixture.spawnAbilityEntity',
      {},
    );
    expect(source).toMatchObject({
      kind: 'abilityEntitySpawn',
      setSource: false,
      setTarget: false,
      target: { targetSource: 'Target' },
      assignEntityBlackboard: false,
      assignments: [{ targetKey: '', inputValueKey: '' }],
      overrideDuration: false,
      duration: { value: 62 },
    });
  });

  it('技能调用保留动态 ID 包装和完整施法者、目标引用', () => {
    expect(
      parseSkillCastActionSource(
        {
          ...META,
          caster: targetFixture('Owner'),
          target: targetFixture('Target'),
          skillId: { value: 'fallback_skill', useBlackboardKey: true, blackboardKey: 'next_skill' },
          skipApplyCost: true,
          inheritSourceSkillCastId: false,
        },
        'fixture.castSkill',
      ),
    ).toMatchObject({
      kind: 'skillCast',
      caster: { targetSource: 'Owner' },
      target: { targetSource: 'Target' },
      skillId: { value: 'fallback_skill', blackboardKey: 'next_skill' },
      skipApplyCost: true,
    });
  });
});

function assignmentFixture(targetKey: string, inputValueKey: string): Record<string, unknown> {
  return {
    targetKey,
    inputValueKey,
    useDirectValue: false,
    directValueType: 'Numeric',
    numericValue: 0,
    stringValue: '',
  };
}
