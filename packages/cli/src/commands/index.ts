import { existsSync } from 'fs';
import { join } from 'path';
import { GenerateFlow, GenerateFlowParameters } from '../modules/index';
import { loadExtendedConfig } from '../utils/typescript';

const action = async (options: GenerateFlowParameters) => {
  const { type, output } = options;
  let { input } = options;
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

  const generateFlow = new GenerateFlow({ type, input, output });

  generateFlow.pipeline();
};

export default {
  description: 'create docs by typescript.',
  // option: ['-t, --type [string]', 'api | cmd', 'api'],
  action
};
