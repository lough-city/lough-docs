import { dirname, join } from 'path';
import ts from 'typescript';

export const parseTypeScriptPath = (path: string) => {
  const program = ts.createProgram([path], {});
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(path);

  return {
    checker,
    sourceFile
  };
};

export const loadExtendedConfig = (configFileName: string): ts.ParsedCommandLine => {
  const content = ts.readConfigFile(configFileName, ts.sys.readFile);
  const extendedConfigFile = join(dirname(configFileName), content.config.extends || '');
  if (content.config.extends && ts.sys.fileExists(extendedConfigFile)) {
    const extendedConfig = loadExtendedConfig(extendedConfigFile);
    return ts.parseJsonConfigFileContent(
      {
        ...extendedConfig.options,
        ...content.config
      },
      ts.sys,
      dirname(configFileName)
    );
  } else {
    return ts.parseJsonConfigFileContent(content.config, ts.sys, dirname(configFileName));
  }
};
