import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { Package } from '@lough/npm-operate';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { InitFlow } from '../modules/init';
import { PROJECT_TYPE } from '../modules/init/const';
import { startLoadingSpinner, succeedLoadingSpinner, succeedSpinner } from '../utils/spinner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_TYPE_LABEL = {
  [PROJECT_TYPE.classLib]: '类库',
  [PROJECT_TYPE.componentLib]: '组件库',
  [PROJECT_TYPE.nodeClassLib]: 'Node 类库',
  [PROJECT_TYPE.cli]: '脚手架'
};

const getProjectType = () =>
  inquirer
    .prompt<{ type: string }>([
      {
        type: 'list',
        name: 'type',
        message: `Please select project type:`,
        choices: Object.keys(PROJECT_TYPE).map(key => ({
          name: `${key} ${PROJECT_TYPE_LABEL[key as keyof typeof PROJECT_TYPE]}`,
          value: PROJECT_TYPE[key as keyof typeof PROJECT_TYPE]
        }))
      }
    ])
    .then(res => res.type);

/**
 * 初始化选项
 */
export interface InitOptions {
  /**
   * 项目类型
   * @default `PROJECT_TYPE.classLib`
   */
  projectType: PROJECT_TYPE;
  /**
   * 静默
   * @description 是否开启静默模式
   * @default false
   */
  quite: boolean;
}

/**
 * 初始化文档工具
 */
const action = async (options: InitOptions) => {
  const self = new Package({ dirName: join(__dirname, '../../') });
  const selfConfig = self.readConfig();

  const npm = new Package();

  const projectType = options.projectType || (await getProjectType());

  const initFlow = new InitFlow({
    projectType,
    cycle: options.quite
      ? undefined
      : {
          install() {
            startLoadingSpinner('install: start');
          },
          installed() {
            succeedLoadingSpinner('install: succeed');
          },
          configure() {
            startLoadingSpinner('configure: start');
          },
          configured() {
            succeedLoadingSpinner('configured: succeed');
          }
        }
  });

  initFlow.pipeline();

  startLoadingSpinner(`开始安装 ${selfConfig.name}`);
  if (npm.readConfig().dependencies?.[selfConfig.name]) {
    npm.uninstall(selfConfig.name);
  }
  npm.installDev(selfConfig.name);
  succeedLoadingSpinner('安装成功');

  startLoadingSpinner(`开始写入 package.json`);
  const config = npm.readConfig();
  if (!config.scripts) config.scripts = {};
  config.scripts.docs = projectType === PROJECT_TYPE.cli ? `lough-docs --type cmd api` : 'lough-docs';
  npm.writeConfig(config);
  succeedLoadingSpinner('写入 package.json 成功');

  succeedSpinner(`${chalk.blue('Lough Docs:')} ${chalk.green('succeed')}`);
};

export default {
  name: 'init',
  description: 'init lough-docs in project.',
  options: [
    [
      '-pt, --projectType [string]',
      `classLib | componentLib | nodeClassLib | cli, default is \`classLib\`.`,
      PROJECT_TYPE.classLib
    ],
    ['-q, --quite [boolean]', 'execute the program silently.', false]
  ],
  action
};
