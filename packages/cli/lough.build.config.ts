import { defineConfig } from '@lough/build-cli';

export default defineConfig({
  external: ['@lough/npm-operate', 'chalk', 'commander', 'execa', 'inquirer', 'ora'],
  terser: false,
  style: false,
  input: 'src/index.ts'
});