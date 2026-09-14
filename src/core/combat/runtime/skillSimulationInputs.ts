/** 一次人工施放的模拟参数，不属于技能定义。 */
export interface SkillSimulationInputs {
  readonly cameraToTargetSignedAngleDegrees?: number;
  readonly randomSeed?: number;
  readonly criticalOverrides?: Readonly<Record<string, boolean>>;
}

export function sameSkillSimulationInputs(
  left: SkillSimulationInputs = {},
  right: SkillSimulationInputs = {},
): boolean {
  const a = left.criticalOverrides ?? {};
  const b = right.criticalOverrides ?? {};
  return (
    left.cameraToTargetSignedAngleDegrees === right.cameraToTargetSignedAngleDegrees &&
    left.randomSeed === right.randomSeed &&
    Object.keys(a).length === Object.keys(b).length &&
    Object.entries(a).every(([key, value]) => Object.hasOwn(b, key) && b[key] === value)
  );
}
