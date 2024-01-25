import { defineConfig } from '@lough/build-cli';

export default defineConfig({
  external: ['@lough/npm-operate', 'chalk', 'commander', 'execa', 'inquirer', 'ora', 'typescript'],
  terser: false,
  style: false,
  input: ['src/bin.ts', 'src/index.ts']
});
