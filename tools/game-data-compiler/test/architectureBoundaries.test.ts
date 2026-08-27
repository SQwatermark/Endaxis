import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';
import ts from 'typescript';

const sourceRoot = fileURLToPath(new URL('../src', import.meta.url));
const strictSourceRoot = join(sourceRoot, 'source');
const compilerRoot = join(sourceRoot, 'compiler');
const commonRoots = [join(sourceRoot, 'source'), join(sourceRoot, 'compiler')];
const domainsRoot = join(sourceRoot, 'domains');

describe('游戏数据编译器架构边界', () => {
  it('工具自身仍只允许 Node 可直接擦除的语法，正式类型的间接依赖不扩大执行边界', () => {
    // 正式 Operator 类型间接引用运行引擎的类。共享类型时 tsc 会检查这些文件，
    // 但它们不在 Node 工具执行路径中；不能为避开这种类型依赖再复制一套正式协议。
    const configPath = join(sourceRoot, '..', 'tsconfig.json');
    const config = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, join(sourceRoot, '..'));
    const program = ts.createProgram(parsed.fileNames, {
      ...parsed.options,
      erasableSyntaxOnly: true,
    });
    const violations = program
      .getSemanticDiagnostics()
      .filter(
        diagnostic =>
          diagnostic.code === 1294 &&
          diagnostic.file &&
          !relative(join(sourceRoot, '..'), diagnostic.file.fileName).startsWith('..'),
      );
    expect(
      violations.map(diagnostic => `${diagnostic.file!.fileName}: ${diagnostic.messageText}`),
    ).toEqual([]);
  }, 20_000);

  it('禁止公共层反向依赖领域适配器', () => {
    const violations = commonRoots.flatMap(root =>
      sourceFiles(root).flatMap(path => {
        const content = readFileSync(path, 'utf8');
        return /from\s+['"][^'"]*domains\//.test(content) ? [display(path)] : [];
      }),
    );
    expect(violations).toEqual([]);
  });

  it('禁止严格来源层依赖编译器，并禁止领域之间横向耦合', () => {
    const sourceViolations = sourceFiles(strictSourceRoot).flatMap(path => {
      const content = readFileSync(path, 'utf8');
      return /from\s+['"][^'"]*compiler\//.test(content) ? [display(path)] : [];
    });
    const domainViolations = sourceFiles(domainsRoot).flatMap(path => {
      const content = readFileSync(path, 'utf8');
      const ownDomain = relative(domainsRoot, path).split(/[\\/]/)[0];
      const imports = [...content.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(match => match[1]!);
      const importsSibling = imports.some(specifier =>
        ['operator', 'weapon', 'equipment'].some(
          domain =>
            domain !== ownDomain &&
            (specifier.includes(`/domains/${domain}/`) || specifier.startsWith(`../${domain}/`)),
        ),
      );
      return importsSibling ? [display(path)] : [];
    });
    expect([...sourceViolations, ...domainViolations]).toEqual([]);
    expect(sourceFiles(compilerRoot).length).toBeGreaterThan(0);
  });

  it('禁止领域层重新声明公共战斗步骤、条件、序列或 Buff 定义', () => {
    const declaration =
      /export\s+(?:type|interface)\s+Compiled(?:Buff|Combat|Action|Condition|Sequence)(?:\w)*(?:Step|Condition|Sequence|Definition)(?:Source)?\b/;
    const violations = sourceFiles(domainsRoot).flatMap(path => {
      const content = readFileSync(path, 'utf8');
      return declaration.test(content) ? [display(path)] : [];
    });
    expect(violations).toEqual([]);
  });

  it('禁止领域层按原生 Action 类型建立第二个分派入口', () => {
    const violations = sourceFiles(domainsRoot).flatMap(path => {
      const content = readFileSync(path, 'utf8');
      const dispatchesNativeAction =
        /switch\s*\([^)]*(?:\$type|actionType|nativeType)[^)]*\)/.test(content) ||
        /(?:parse|compile)(?:Known)?NativeAction(?:Leaf|Node|Source)/.test(content);
      return dispatchesNativeAction ? [display(path)] : [];
    });
    expect(violations).toEqual([]);
  });

  it('禁止领域层直接取得公共原生属性解释能力', () => {
    const violations = sourceFiles(domainsRoot).flatMap(path => {
      const content = readFileSync(path, 'utf8');
      const importsCommonNativeAttributeSource = [...content.matchAll(/from\s+['"]([^'"]+)['"]/g)]
        .map(match => match[1]!)
        .some(specifier => /(?:^|\/)source\/attributeModifiers\.ts$/.test(specifier));
      return importsCommonNativeAttributeSource ? [display(path)] : [];
    });
    expect(violations).toEqual([]);
  });
});

function sourceFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return extname(entry.name) === '.ts' ? [path] : [];
  });
}

function display(path: string): string {
  return relative(sourceRoot, path).replaceAll('\\', '/');
}
