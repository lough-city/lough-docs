import { existsSync, lstatSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { LifeCycle } from '@logically/coding-model';
import { Package } from '@lough/npm-operate';
import { LINE_BREAK } from '../../constants';
import { GENERATE_TYPE } from './const';
import { makerDeclarationDocs } from './maker/api';
import { makerCommandDeclarationDocs } from './maker/cmd';
import { parseTypeScriptProject } from './parser';
import { AllDeclaration } from './typings/declaration';

/**
 * 生成流生命周期
 */
export interface GenerateFlowLifeCycle {
  /**
   * 解析开始
   */
  parse: () => any;
  /**
   * 解析中
   */
  parsing: (filePath: string) => any;
  /**
   * 解析结束
   */
  parsed: () => any;
  /**
   * 制作开始
   */
  make: () => any;
  /**
   * 制作结束
   */
  made: () => any;
  /**
   * 保存结束
   */
  save: () => any;
  /**
   * 保存开始
   */
  saved: (filePath: string) => any;
}

/**
 * 生成流参数
 */
export interface GenerateFlowParameters {
  /**
   * 生成类型
   */
  type: GENERATE_TYPE;
  /**
   * 入口文件或目录
   * @description 完整路径
   */
  input: string;
  /**
   * 输出目录
   * @description 完整路径
   */
  output: string;
  /**
   * 生命周期
   */
  cycle?: GenerateFlowLifeCycle;
}

/**
 * 生成流
 */
export class GenerateFlow {
  private options: Omit<GenerateFlowParameters, 'cycle'>;

  private cycle = new LifeCycle<GenerateFlowLifeCycle>();

  private npm: Package;

  private get typeLabel() {
    return this.options.type === GENERATE_TYPE.api ? 'API' : 'CMD';
  }

  constructor(parameters: GenerateFlowParameters) {
    const { cycle, ..._parameters } = parameters;

    if (cycle) this.cycle.on(cycle);

    this.options = _parameters;

    this.npm = new Package();
  }

  /**
   * 解析文件
   * @returns 类型描述列表
   */
  parse() {
    const { input } = this.options;
    const inputList = lstatSync(input).isDirectory() ? readdirSync(input).map(file => join(input, file)) : [input];

    this.cycle.emit('parse');

    const declarationList: Array<AllDeclaration> = [];

    for (const _input of inputList) {
      const list = parseTypeScriptProject(_input, filePath => this.cycle.emit('parsing', filePath)) || [];
      declarationList.push(...list);
    }

    this.cycle.emit('parsed');

    return declarationList;
  }

  /**
   * 制作文档
   * @returns 文档
   */
  make(declarationList: Array<AllDeclaration>) {
    this.cycle.emit('make');

    if (this.options.type === GENERATE_TYPE.api) {
      const markdown = `## ${this.typeLabel}\n\n` + makerDeclarationDocs(declarationList) + LINE_BREAK;

      this.cycle.emit('made');

      return markdown;
    }

    const markdown =
      `## ${this.typeLabel}\n\n` +
      makerCommandDeclarationDocs(Object.keys(this.npm.readConfig()?.bin || {})[0] || '', declarationList) +
      LINE_BREAK;

    this.cycle.emit('made');

    return markdown;
  }

  /**
   * 保存文件
   */
  save(markdown: string) {
    const filePath = this.options.output;
    let content = '';

    this.cycle.emit('save');

    if (existsSync(filePath)) {
      const readme = readFileSync(filePath, { encoding: 'utf-8' });
      const reg = new RegExp(`##\\s*${this.typeLabel}([\\s\\S]*?)(?=\\n## [^\\n]+|$)`);

      if (reg.test(readme)) {
        content = readme.replace(reg, markdown);
      } else {
        content = readme ? `${readme}${LINE_BREAK}${markdown}` : markdown;
      }

      const config = this.npm.readConfig();
      if (!content.includes(`# ${config.name}`)) {
        content =
          `# ${config.name}${LINE_BREAK}${LINE_BREAK}> ${config.description}${LINE_BREAK}${LINE_BREAK}${LINE_BREAK}${LINE_BREAK}` +
          content;
      }

      writeFileSync(filePath, content, { encoding: 'utf-8' });
    } else {
      const config = this.npm.readConfig();

      writeFileSync(
        filePath,
        `# ${config.name}${LINE_BREAK}${LINE_BREAK}> ${config.description}${LINE_BREAK}${LINE_BREAK}${LINE_BREAK}${LINE_BREAK}${markdown}`,
        {
          encoding: 'utf-8'
        }
      );
    }

    this.cycle.emit('saved', filePath);
  }

  /**
   * 流水线
   */
  pipeline() {
    const declarationList = this.parse();
    const markdown = this.make(declarationList);
    this.save(markdown);
  }
}

export * from './const';
