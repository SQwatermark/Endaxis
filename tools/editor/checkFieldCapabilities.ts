import { readFile } from 'node:fs/promises';
import { definitionSchemas } from '../../src/ui/definition-editor/definitionSchemas.generated.ts';
import {
  actionNodeSchemas,
  dataNodeSchemas,
} from '../../src/ui/action-graph/actionNodeSchemas.generated.ts';
import {
  checkFieldCapabilityCoverage,
  collectFieldCapabilities,
  summarizeFieldCapabilities,
  type FieldCapabilityException,
} from './fieldCapabilities.ts';

const rows = collectFieldCapabilities(definitionSchemas, actionNodeSchemas, dataNodeSchemas);
const baseline = JSON.parse(
  await readFile(new URL('./fieldCapabilityBaseline.json', import.meta.url), 'utf8'),
) as {
  readonly exceptions: readonly FieldCapabilityException[];
  readonly observedJsonPositionsAtAudit: number;
  readonly resolvedObservedJsonPositions?: readonly string[];
};
const failures = checkFieldCapabilityCoverage(rows, baseline.exceptions);
const pendingObserved = baseline.exceptions
  .filter(group => group.observedJsonAtAudit)
  .flatMap(group => group.keys);
const resolvedObserved = baseline.resolvedObservedJsonPositions ?? [];
const observedKeys = [...pendingObserved, ...resolvedObserved];
if (
  observedKeys.length !== baseline.observedJsonPositionsAtAudit ||
  new Set(observedKeys).size !== observedKeys.length
)
  failures.push('historical observed JSON positions must remain accounted for exactly once');
for (const key of resolvedObserved) {
  const row = rows.find(row => row.key === key);
  if (!row || row.fallback)
    failures.push(`historical position marked resolved without an available editor: ${key}`);
}
if (failures.length) throw new Error(`Field capability coverage failed:\n${failures.join('\n')}`);
if (process.argv.includes('--report')) {
  const exceptions = new Map(
    baseline.exceptions.flatMap(group => group.keys.map(key => [key, group] as const)),
  );
  const report = rows.map(row => {
    const exception = exceptions.get(row.key);
    return {
      ...row,
      ...(exception
        ? {
            category: exception.category,
            phase: exception.phase,
            observedJsonAtAudit: exception.observedJsonAtAudit ?? false,
          }
        : {}),
    };
  });
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else
  process.stdout.write(
    `${JSON.stringify(summarizeFieldCapabilities(rows), null, 2)}\nField capability coverage is up to date.\n`,
  );
