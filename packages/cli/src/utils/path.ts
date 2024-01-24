import { existsSync } from 'fs';
import { dirname, join } from 'path';

export const resolveModulePath = (baseFilePath: string, moduleSpecifier: string): string | undefined => {
  const basePath = dirname(baseFilePath);
  const resolvedPath = join(basePath, moduleSpecifier);

  const extensions = ['.ts', '.tsx'];
  for (const ext of extensions) {
    const testPath = resolvedPath + ext;
    if (existsSync(testPath)) return testPath;
  }

  const subDirs = ['index.ts', 'index.tsx'];

  for (const dir of subDirs) {
    const testPath = join(resolvedPath, dir);
    if (existsSync(testPath)) return testPath;
  }

  return undefined;
};
