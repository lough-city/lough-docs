import ts from 'typescript';
import { AllDeclaration } from '../../typings/declaration';
import { getNodeDeclaration } from './declaration';
import { isNodeExported } from './export';
import { DECLARATION_KIND } from '/src/constants/declaration';

export const parseTypeScriptAST = (source: ts.SourceFile, checker: ts.TypeChecker) => {
  const declarationList: Array<AllDeclaration> = [];

  ts.forEachChild(source, node => {
    if (ts.isExportDeclaration(node)) {
      //
    }
    if (!isNodeExported(node)) return;

    const declaration = getNodeDeclaration(node, checker);
    if (declaration) declarationList.push(declaration);
  });

  return declarationList;
};

// export const parseTypeScriptProject = (path: string) => {
//   const program = ts.createProgram([path], {});
//   const checker = program.getTypeChecker();
//   const sourceFile = program.getSourceFile(path);
//   return parseTypeScriptAST(sourceFile!, checker);
// };

export const groupDeclarationByKind = (declarationList: Array<AllDeclaration>) => {
  return declarationList.reduce((map, declaration) => {
    if (!map[declaration.kind]) map[declaration.kind] = [declaration];
    else map[declaration.kind].push(declaration);
    return map;
  }, {} as Record<DECLARATION_KIND, Array<AllDeclaration>>);
};
