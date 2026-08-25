export interface GameplayTagConfigDumpSource {
  readonly paths: readonly string[];
}

/** 严格读取 AnimeStudio TypeTree dump 中 GameplayTagConfig._keyData 的有序路径。 */
export function parseGameplayTagConfigDumpSource(
  bytes: Uint8Array,
  sourcePath: string,
): GameplayTagConfigDumpSource {
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error(`${sourcePath}: expected UTF-8 TypeTree dump`);
  }
  const header = /vector _keyData\s+Array Array\s+int size = (\d+)/.exec(text);
  if (!header || header.index === undefined) {
    throw new Error(`${sourcePath}: GameplayTagConfig _keyData vector was not found`);
  }
  const expectedCount = Number(header[1]);
  if (!Number.isSafeInteger(expectedCount) || expectedCount <= 0) {
    throw new Error(`${sourcePath}: invalid GameplayTagConfig path count ${header[1]}`);
  }
  const tail = text.slice(header.index + header[0].length);
  const paths = [...tail.matchAll(/string data = "([^"]+)"/g)]
    .slice(0, expectedCount)
    .map(match => match[1]!);
  if (paths.length !== expectedCount) {
    throw new Error(`${sourcePath}: expected ${expectedCount} tag paths, found ${paths.length}`);
  }
  if (new Set(paths).size !== paths.length) {
    throw new Error(`${sourcePath}: GameplayTagConfig contains duplicate paths`);
  }
  return { paths };
}
