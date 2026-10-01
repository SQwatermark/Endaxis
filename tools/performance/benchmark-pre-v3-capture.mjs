// Build-only adapter: capture the original store's fully hydrated dependencies.
// No production source file is edited, and the original composable is delegated unchanged.
import { useTimelineSimulation as original } from 'legacy-simulation-composable';
export let capturedDeps;
export function useTimelineSimulation(deps) {
  capturedDeps = deps;
  return original(deps);
}
export { original as createFreshSimulation };
