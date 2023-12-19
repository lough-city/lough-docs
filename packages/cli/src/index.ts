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
import { parseTypeScriptAST } from './core/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const path = `E:\\nanzc\\lough-city\\lough-docs\\packages\\cli\\src\\test.ts`;

// 读取 TypeScript 文件
// const sourceCode = ts.readConfigFile(path, ts.sys.readFile).config;

// 创建程序
const program = ts.createProgram([path], {});

// 获取类型检查器
const checker = program.getTypeChecker();

// 获取源文件的语法树
const sourceFile = program.getSourceFile(path);

const declarationList = parseTypeScriptAST(sourceFile!, checker);

writeFileSync(join(__dirname, 'a.txt'), JSON.stringify(declarationList, undefined, 4), { encoding: 'utf-8' });

// TODO: 建立引用关系
// TODO: 检测流程：先基础类型 再复杂类型 然后复杂引用基础
