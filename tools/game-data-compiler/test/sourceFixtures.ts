export function targetFixture(
  targetSource: string,
  selectorData: Record<string, unknown> = {
    validatorData: [],
    postProcessorData: [],
  },
  targetGroupKey = '',
): Record<string, unknown> {
  return {
    targetSource,
    targetGroupKey,
    selectorOwner: 'ActionOwner',
    ownerContextKey: '',
    centerType: 'ActionSource',
    centerContextKey: '',
    centerToGround: false,
    selectorData,
    enableAdvancedDirection: false,
    advancedDirection: {},
    selectorDirection: 'SourceForward',
    target: 'ActionSource',
    targetContextKey: '',
  };
}

export function scalarFixture(value: number, blackboardKey = ''): Record<string, unknown> {
  return {
    value,
    useBlackboardKey: blackboardKey.length > 0,
    blackboardKey,
  };
}
