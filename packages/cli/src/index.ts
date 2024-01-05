// #!/usr/bin/env node
// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';
// import { Package } from '@lough/npm-operate';
// import { program } from 'commander';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// function start() {
//   const npm = new Package({ dirName: join(__dirname, '..') });
//   program.version(npm.version);

// }

// start();
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';
import { makerDeclarationDocs } from './core/maker';
import { parseTypeScriptAST } from './core/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const path = `E:\\nanzc\\logically-city\\coding\\packages\\advanced\\src\\index.ts`;

// 读取 TypeScript 文件
// const sourceCode = ts.readConfigFile(path, ts.sys.readFile).config;

const parseTypeScriptProject = (path: string) => {
  const program = ts.createProgram([path], {});
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(path);
  return parseTypeScriptAST(sourceFile!, checker);
};

const declarationList = parseTypeScriptProject(path);

writeFileSync(join(__dirname, 'test.md'), makerDeclarationDocs(declarationList), { encoding: 'utf-8' });
