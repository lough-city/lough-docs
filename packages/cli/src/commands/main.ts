import { existsSync, lstatSync } from 'fs';
import { join } from 'path';
import { GenerateFlow, GenerateFlowParameters } from '../modules/index';
import { GENERATE_TYPE } from '../modules/index/const';
import { startLoadingSpinner, succeedLoadingSpinner, textLoadingSpinner } from '../utils/spinner';
import { loadExtendedConfig } from '../utils/typescript';

/**
 * 生成流参数
 */
export interface GenerateOptions {
  /**
   * 生成类型
   */
  type: GENERATE_TYPE;
  /**
   * 入口文件或目录
   * @description 相对于 `process.cwd()`
   */
  input: string;
  /**
   * 输出文件或目录
   * @description 相对于 `process.cwd()`
   */
  output: string;
}

const action = async (options: GenerateFlowParameters) => {
  const { type } = options;
  let { input, output } = options;
  const rootDir = process.cwd();

  if (input) {
    input = join(rootDir, input);
  } else {
    if (type === GENERATE_TYPE.api) {
      const tsconfigPath = join(rootDir, 'tsconfig.json');
      if (existsSync(tsconfigPath)) {
        const parsedConfig = loadExtendedConfig(tsconfigPath);
        input = parsedConfig.fileNames[0];
      }
    } else {
      input = join(rootDir, 'src/commands');
    }
  }

  if (!existsSync(input)) {
    console.warn('Missing input for:', input);
    return;
  }

  output = output
    ? lstatSync(output).isDirectory()
      ? join(rootDir, output, 'README.md')
      : join(rootDir, output)
    : join(rootDir, 'README.md');

  const generateFlow = new GenerateFlow({
    type,
    input,
    output,
    cycle: {
      parse: () => {
        startLoadingSpinner('parse: start');
      },
      parsing: (filePath: string) => {
        textLoadingSpinner(`parse: ${filePath}`);
      },
      parsed: () => {
        succeedLoadingSpinner('parse: succeed');
      },
      make: () => {
        startLoadingSpinner('make: start');
      },
      made: () => {
        succeedLoadingSpinner('make: succeed');
      },
      save: () => {
        startLoadingSpinner('save: start');
      },
      saved: (filePath: string) => {
        succeedLoadingSpinner(`save: succeed ${filePath}`);
      }
    }
  });

  generateFlow.pipeline();
};

export default {
  description: 'generate docs by typescript.',
  options: [
    ['-t, --type [string]', 'generate type: api | cmd', 'api'],
    [
      '-i, --input [string]',
      'generate file input directory or typescript file, if type is api default is tsconfig input, else default is src/commands.'
    ],
    ['-o, --output [string]', 'generate file output directory or markdown file, default is README.md.']
  ],
  action
};
