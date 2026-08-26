/** 1.4.4 ObjectType 身份；证据：combat-spec Runtime/CombatEntity.cs、CheckObjectTypeMatchAction.cs。 */
const OBJECT_TYPES: Readonly<Record<string, number>> = {
  All: -1,
  Invalid: 1,
  Character: 8,
  Enemy: 16,
  Interactive: 32,
  Projectile: 64,
  FactoryRegion: 128,
  Npc: 256,
  AbilityEntity: 512,
  CinematicEntity: 1024,
  RemoteFactoryEntity: 2048,
  Creature: 4096,
  GodEntity: 8192,
  EnemyPart: 16384,
  EnemyAll: 16400,
  SocialBuilding: 32768,
};

export function parseObjectTypeMask(value: unknown, path: string): number {
  if (typeof value === 'number') {
    if (Number.isInteger(value) && value >= -2147483648 && value <= 2147483647) return value;
  } else if (typeof value === 'string' && value.trim() !== '') {
    if (/^-?\d+$/.test(value.trim())) return parseObjectTypeMask(Number(value), path);
    let mask = 0;
    for (const name of value.split(',').map(part => part.trim())) {
      if (!Object.hasOwn(OBJECT_TYPES, name))
        throw new Error(`${path}: unknown ObjectType '${name}'`);
      mask |= OBJECT_TYPES[name]!;
    }
    return mask;
  }
  throw new Error(`${path}: expected ObjectType names or signed int32 mask`);
}
