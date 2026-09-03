import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  requireArray,
  requireBoolean,
  requireNonEmptyString,
  requireRecord,
} from '../src/source/primitives.ts';
import { writeAtomicBytes } from './downloadVfsSources.ts';

/** 从当前 VFS ProjectileData 直接生成投射物实体黑板目录，不维护人工版本快照。 */
export async function generateProjectileEntityBlackboardCatalog(
  inputRoot: string,
  output: string,
  check = false,
) {
  const missing: string[] = [];
  const projectiles = fs
    .readdirSync(inputRoot)
    .filter(file => file.endsWith('.json') && file !== 'manifest.json')
    .sort()
    .flatMap(file => {
      const sourcePath = path.join(inputRoot, file);
      const source = requireRecord(JSON.parse(fs.readFileSync(sourcePath, 'utf8')), sourcePath);
      const projectileId = requireNonEmptyString(source.id, `${sourcePath}.id`);
      if (!Array.isArray(source.entityBlackboard)) {
        missing.push(projectileId);
        return [];
      }
      const entityBlackboard = requireArray(
        source.entityBlackboard,
        `${sourcePath}.entityBlackboard`,
      ).map((value, index) => {
        const item = requireRecord(value, `${sourcePath}.entityBlackboard[${index}]`);
        const numericValue = item.valueDouble;
        if (typeof numericValue !== 'number' || !Number.isFinite(numericValue)) {
          throw new Error(`${sourcePath}.entityBlackboard[${index}].valueDouble must be finite`);
        }
        return {
          key: requireNonEmptyString(item.key, `${sourcePath}.entityBlackboard[${index}].key`),
          value: numericValue,
          isDynamic: requireBoolean(
            item.isDynamic,
            `${sourcePath}.entityBlackboard[${index}].isDynamic`,
          ),
        };
      });
      return [{ projectileId, entityBlackboard }];
    });
  if (new Set(projectiles.map(projectile => projectile.projectileId)).size !== projectiles.length) {
    throw new Error('ProjectileData contains duplicate projectile identities');
  }
  const content =
    JSON.stringify(
      {
        format: 'EndaxisProjectileEntityBlackboards',
        projectiles,
        missingEntityBlackboards: missing,
      },
      null,
      2,
    ) + '\n';
  if (check) {
    if (
      !fs.existsSync(output) ||
      fs.readFileSync(output, 'utf8').replaceAll('\r\n', '\n') !== content
    ) {
      throw new Error(`projectile entity blackboard catalog is stale: ${output}`);
    }
  } else {
    await writeAtomicBytes(output, new TextEncoder().encode(content));
  }
  return { projectileCount: projectiles.length, missingEntityBlackboardCount: missing.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const check = args.at(-1) === '--check';
  if (check) args.pop();
  if (args.length !== 2) throw new Error('expected <ProjectileData root> <output JSON> [--check]');
  console.log(await generateProjectileEntityBlackboardCatalog(args[0]!, args[1]!, check));
}
