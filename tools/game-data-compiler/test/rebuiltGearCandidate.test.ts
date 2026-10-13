import { equipmentFixture } from './sourceFixtures.ts';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import {
  generateGearDefinitions,
  compileGearDefinitionsFromFiles,
} from '../scripts/generateGearDefinitions.ts';
import { loadSourceCatalog } from '../scripts/downloadGameDataSources.ts';
import { verifyGameDataSnapshot } from '../scripts/verifyGameDataSnapshot.ts';
import { validateGearDefinition } from '../../../src/core/game-data/equipmentDefinitionValidation';
import { compileGearContributions } from '../../../src/core/compiler/compileEquipment';
import type { GearDefinition } from '../../../src/core/game-data/equipmentDefinition';
import { OPERATOR_ATTRIBUTES } from '../../../packages/game-data-contract/src/primitives.ts';

// 默认用构造的最小装备表行；指定完整报告时逐件验证该批候选，不复制其文件到正式目录。
const reportPath = process.env.ENDAXIS_GAME_DATA_REBUILD_REPORT;
let temporary: string | undefined;
let tablesDirectory: string;
if (reportPath) {
  const report = JSON.parse(await fs.readFile(reportPath, 'utf8'));
  const sourceStage = report.stages.find((s: { id: string }) => s.id === 'sources');
  const gearStage = report.stages.find((s: { id: string }) => s.id === 'gears');
  if (sourceStage?.status !== 'passed' || gearStage?.status !== 'passed')
    throw new Error('report has no valid source/gear candidate');
  const snapshot = await verifyGameDataSnapshot(
    report.sourceRoot,
    await loadSourceCatalog('tools/game-data-compiler/game-data-sources.json'),
  );
  if (snapshot.snapshotSha256 !== sourceStage.detail.snapshotSha256)
    throw new Error('candidate input snapshot no longer matches report');
  tablesDirectory = path.join(report.sourceRoot, 'TableCfg-current');
  await generateGearDefinitions({
    tablesDirectory,
    outputDirectory: gearStage.detail.outputDirectory,
    check: true,
  });
} else {
  const fixture = equipmentFixture();
  temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'endaxis-gear-runtime-'));
  tablesDirectory = temporary;
  await fs.writeFile(
    path.join(temporary, 'EquipTable.json'),
    JSON.stringify({ [fixture.equipmentId]: fixture.equipTableEntry }),
  );
  await fs.writeFile(
    path.join(temporary, 'ItemTable.json'),
    JSON.stringify({ [fixture.equipmentId]: fixture.itemTableEntry }),
  );
}
afterAll(async () => {
  if (temporary) await fs.rm(temporary, { recursive: true, force: true });
});

const batch = await compileGearDefinitionsFromFiles(tablesDirectory);
const candidates: readonly GearDefinition[] = batch.definitions;
if (!candidates.length) throw new Error('empty gear candidate cannot pass coverage');
const attributePairs = OPERATOR_ATTRIBUTES.flatMap(main =>
  OPERATOR_ATTRIBUTES.map(secondary => ({ main, secondary })),
);

describe('重建单件装备候选的契约与配装修正编译', () => {
  it.each(candidates)('$slug 严格契约与所有主副属性组合均可编译', gear => {
    expect(validateGearDefinition(gear)).toEqual([]);
    for (const attributes of attributePairs) {
      for (const levels of [
        gear.traits.map(() => 0),
        gear.traits.map(trait => trait.levelCount - 1),
      ]) {
        const contributions = compileGearContributions(gear, levels, attributes);
        expect(contributions).toHaveLength(gear.traits.length);
        for (const contribution of contributions) {
          expect(contribution.source).toMatchObject({ kind: 'gearTrait', slug: gear.slug });
          expect(contribution.modifiers.every(modifier => Number.isFinite(modifier.value))).toBe(
            true,
          );
        }
      }
    }
  });
});
