import { join } from 'path';
import { LifeCycle } from '@logically/coding-model';
import { Package } from '@lough/npm-operate';
import { PROJECT_TYPE } from './const';

/**
 * 初始化流生命周期
 */
export interface InitFlowLifeCycle {
  /**
   * 安装开始
   */
  install: () => any;
  /**
   * 安装结束
   */
  installed: () => any;
  /**
   * 配置开始
   */
  configure: () => any;
  /**
   * 配置结束
   */
  configured: () => any;
}

/**
 * 初始化流参数
 */
export interface InitFlowParameters {
  /**
   * 项目类型
   * @default `PROJECT_TYPE.classLib`
   */
  projectType: PROJECT_TYPE;
  /**
   * 生命周期
   */
  cycle?: InitFlowLifeCycle;
}

/**
 * 初始化流
 */
export class InitFlow {
  private options: InitFlowParameters;

  private cycle = new LifeCycle<InitFlowLifeCycle>();

  private npm: Package;

  private self: Package;

  constructor(parameters: InitFlowParameters) {
    const { cycle, ..._parameters } = parameters;

    if (cycle) this.cycle.on(cycle);

    this.options = _parameters;

    this.npm = new Package();
    this.self = new Package({ dirName: join(__dirname, '../../../') });
  }

  /**
   * 安装
   */
  install() {
    this.cycle.emit('install');

    if (this.npm.readConfig().dependencies?.[this.self.name]) {
      this.npm.uninstall(this.self.name);
    }

    this.npm.installDev(this.self.name);

    this.cycle.emit('installed');
  }

  /**
   * 配置
   */
  configure() {
    this.cycle.emit('configure');

    const config = this.npm.readConfig();
    if (!config.scripts) config.scripts = {};
    config.scripts.docs = this.options.projectType === PROJECT_TYPE.cli ? `lough-docs --type cmd api` : 'lough-docs';
    this.npm.writeConfig(config);

    this.cycle.emit('configured');
  }

  /**
   * 流水线
   */
  pipeline() {
    this.install();
    this.configure();
  }
}

export * from './const';
