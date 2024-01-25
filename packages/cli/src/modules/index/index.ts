import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { AllDeclaration } from '../../typings/declaration';
import { GENERATE_TYPE } from './const';
import { makerDeclarationDocs } from './core/maker';
import { parseTypeScriptProject } from './core/parser';

/**
 * 生成流参数
 */
export interface GenerateFlowParameters {
  /**
   * 生成类型
   */
  type: GENERATE_TYPE;
  /**
   * 入口文件
   * @description 完整路径
   */
  input: string;
  /**
   * 输出目录
   * @description 完整路径
   */
  output: string;
}

/**
 * 生成流
 */
export class GenerateFlow {
  private options: GenerateFlowParameters;

  private get typeLabel() {
    return this.options.type === GENERATE_TYPE.api ? 'API' : 'CMD';
  }

  constructor(parameters: GenerateFlowParameters) {
    this.options = parameters;
  }

  /**
   * 解析文件
   * @returns 类型描述列表
   */
  parse() {
    return parseTypeScriptProject(this.options.input) || [];
  }

  /**
   * 制作文档
   * @returns 文档
   */
  make(declarationList: Array<AllDeclaration>) {
    return `## ${this.typeLabel}` + makerDeclarationDocs(declarationList);
  }

  /**
   * 保存文件
   */
  save(markdown: string) {
    const fileName = join(this.options.output, 'README.md');
    let content = '';

    if (existsSync(fileName)) {
      const readme = readFileSync(fileName, { encoding: 'utf-8' });
      const reg = new RegExp(`##\s*${this.typeLabel}([\s\S]*?)(?=\n## [^\n]+|$)`);

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

  /**
   * 流水线
   */
  pipeline() {
    const declarationList = this.parse();
    const markdown = this.make(declarationList);
    this.save(markdown);
  }
}
