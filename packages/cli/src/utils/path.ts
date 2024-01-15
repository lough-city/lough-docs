import { existsSync } from 'fs';
import { dirname, join } from 'path';

export const resolveModulePath = (baseFilePath: string, moduleSpecifier: string): string | undefined => {
  const basePath = dirname(baseFilePath);
  const resolvedPath = join(basePath, moduleSpecifier);

  const extensions = ['.ts', '.tsx', 'index.ts', 'index.tsx'];
  for (const ext of extensions) {
    const testPath = join(resolvedPath, ext);
    if (existsSync(testPath)) return testPath;
  }

  return undefined;
};
