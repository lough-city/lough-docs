import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { makerDeclarationDocs } from '../core/maker';
import { parseTypeScriptProject } from '../core/parser';
import { loadExtendedConfig } from '../utils/typescript';

interface IOptions {
  mode: 'mounted' | 'independent';
}

// TODO: 一些待实现
// 1. 进度展示
// 2. 新增占位代替正则
// 3. 思考打包跟随版本怎么做：
//    - 使用 git 查看更改
//    - 每次打包加上当前版本，查看上一一次打包版本，有就不加
// 4. 文档内跳转
// 5. location

const action = async (input = '', options: IOptions) => {
  const { mode } = options;
  const rootDir = process.cwd();

  if (input) {
    input = join(rootDir, input);
  } else {
    const tsconfigPath = join(rootDir, 'tsconfig.json');
    if (existsSync(tsconfigPath)) {
      const parsedConfig = loadExtendedConfig(tsconfigPath);
      input = parsedConfig.fileNames[0];
    }
  }

  if (!existsSync(input)) {
    console.warn('Missing input for:', input);
    return;
  }

  const declarationList = parseTypeScriptProject(input) || [];
  if (!declarationList) {
    console.warn('Not export declaration list.');
    return;
  }

  const markdown = makerDeclarationDocs(declarationList);

  if (mode === 'independent') {
    const fileName = join(rootDir, 'API.md');

    writeFileSync(fileName, markdown, { encoding: 'utf-8' });
  } else {
    const fileName = join(rootDir, 'README.md');
    let content = '';

    if (existsSync(fileName)) {
      const readme = readFileSync(fileName, { encoding: 'utf-8' });
      const reg = /##\s*API([\s\S]*?)(?=\n## [^\n]+|$)/;

      if (reg.test(readme)) {
        content = readme.replace(reg, markdown);
      } else {
        content = readme ? `${readme}\\n${markdown}` : markdown;
      }
      writeFileSync(fileName, content, { encoding: 'utf-8' });
    } else {
      writeFileSync(fileName, markdown, { encoding: 'utf-8' });
    }
  }
};

export default {
  command: 'docs',
  description: 'create docs by typescript.',
  action
};
