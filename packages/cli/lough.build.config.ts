import { defineConfig } from '@lough/build-cli';

export default defineConfig({
  external: [
    '@logically/coding-model',
    '@lough/npm-operate',
    'chalk',
    'commander',
    'execa',
    'inquirer',
    'ora',
    'typescript'
  ],
  terser: false,
  style: false,
  input: ['src/index.ts', 'src/bin.ts', 'src/commands']
});
