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
import ts from 'typescript';

const path = `E:\\nanzc\\lough-city\\lough-docs\\packages\\cli\\src\\test.ts`;

// 读取 TypeScript 文件
// const sourceCode = ts.readConfigFile(path, ts.sys.readFile).config;

// 创建程序
const program = ts.createProgram([path], {});

// 获取类型检查器
const checker = program.getTypeChecker();

// 获取源文件的语法树
const sourceFile = program.getSourceFile(path);

function visit(node: any) {
  if (ts.isClassDeclaration(node)) {
    // 如果这是一个类定义，打印类的名称
    const symbol = checker.getSymbolAtLocation(node.name!);
    console.log('Class:', symbol!.name);
  } else if (ts.isInterfaceDeclaration(node)) {
    // 如果这是一个接口定义，打印接口的名称
    const symbol = checker.getSymbolAtLocation(node.name);
    console.log('Interface:', symbol!.name);
  } else if (ts.isFunctionDeclaration(node)) {
    // 如果这是一个函数定义，打印函数的名称
    const symbol = checker.getSymbolAtLocation(node.name!);
    console.log('Function:', symbol!.name);
  } else if (ts.isVariableDeclaration(node)) {
    // 如果这是一个变量定义，打印变量的名称和类型
    const symbol = checker.getSymbolAtLocation(node.name);
    const type = checker.getTypeOfSymbolAtLocation(symbol!, symbol!.valueDeclaration!);
    console.log('Variable:', symbol!.name, 'Type:', checker.typeToString(type));
  }

  // 检查是否有 JSDoc 注释

  if (node.jsDoc && node.jsDoc.length > 0) {
    debugger;
    for (const doc of node.jsDoc) {
      console.log('JSDoc:', doc.comment);
    }
  }

  // 继续遍历语法树的其他部分
  ts.forEachChild(node, visit);
}

// 遍历语法树
ts.forEachChild(sourceFile as any, visit);
