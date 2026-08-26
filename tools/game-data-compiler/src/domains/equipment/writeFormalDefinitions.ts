import { writeGeneratedDefinitionFiles } from '../../compiler/writeGeneratedDefinitionFiles.ts';
import type { RenderedEquipmentDefinitionFileSource } from './renderFormalDefinitions.ts';

/** 装备领域保留稳定入口，原子写盘语义由公共生成器实现。 */
export function writeEquipmentDefinitionFiles(
  outputDirectory: string,
  files: readonly RenderedEquipmentDefinitionFileSource[],
): Promise<void> {
  return writeGeneratedDefinitionFiles(outputDirectory, files);
}
