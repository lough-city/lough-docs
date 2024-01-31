import { existsSync, lstatSync } from 'fs';
import { join } from 'path';
import { GenerateFlow } from '../modules/generate';
import { GENERATE_TYPE } from '../modules/generate/const';
import { startLoadingSpinner, succeedLoadingSpinner, textLoadingSpinner } from '../utils/spinner';
// import { loadExtendedConfig } from '../utils/typescript';

/**
 * 生成选项
 */
export interface GenerateOptions {
  /**
   * 生成类型
   * @default `[GENERATE_TYPE.api]`
   */
  type: Array<GENERATE_TYPE>;
  /**
   * 入口文件或目录
   * @description 相对于 `process.cwd()`
   */
  input?: string;
  /**
   * 输出文件或目录
   * @description 相对于 `process.cwd()`
   * @default `README.md`
   */
  output?: string;
  /**
   * 静默
   * @description 是否开启静默模式
   * @default false
   */
  quite: boolean;
}

/**
 * 生成文档
 */
const action = async (options: GenerateOptions) => {
  const { type: types, quite } = options;
  const rootDir = process.cwd();

  for (const type of types) {
    let { input, output } = options;

    if (input) {
      input = join(rootDir, input);
    } else {
      if (type === GENERATE_TYPE.api) {
        // const tsconfigPath = join(rootDir, 'tsconfig.json');
        // if (existsSync(tsconfigPath)) {
        //   const parsedConfig = loadExtendedConfig(tsconfigPath);
        //   input = parsedConfig.fileNames[0];
        // } else {
        //   input = '';
        // }
        input = join(rootDir, 'src/index.ts');
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
      cycle: quite
        ? undefined
        : {
            parse() {
              startLoadingSpinner(`${type} parse: start`);
            },
            parsing(filePath: string) {
              textLoadingSpinner(`${type} parse: ${filePath}`);
            },
            parsed() {
              succeedLoadingSpinner(`${type} parse: succeed`);
            },
            make() {
              startLoadingSpinner(`${type} make: start`);
            },
            made() {
              succeedLoadingSpinner(`${type} make: succeed`);
            },
            save() {
              startLoadingSpinner(`${type} save: start`);
            },
            saved(filePath: string) {
              succeedLoadingSpinner(`${type} save: succeed ${filePath}`);
            }
          }
    });

    generateFlow.pipeline();
  }
};

export default {
  description: 'generate docs by typescript.',
  options: [
    ['-t, --type [string...]', 'generate type: Array<api | cmd>', ['api']],
    [
      '-i, --input [string]',
      'generate file input directory or typescript file, if type is api default is tsconfig input, else default is src/commands.'
    ],
    ['-o, --output [string]', 'generate file output directory or markdown file, default is README.md.'],
    ['-q, --quite [boolean]', 'execute the program silently.', false]
  ],
  action
};
