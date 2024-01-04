import ts from 'typescript';
import { AllDeclaration } from '../../typings/declaration';
import { getNodeDeclaration } from './declaration';
import { isNodeExported } from './export';
import { DECLARATION_KIND } from '/src/constants/declaration';

export const parseTypeScriptAST = (source: ts.SourceFile, checker: ts.TypeChecker) => {
  const declarationList: Array<AllDeclaration> = [];

  ts.forEachChild(source, node => {
    if (!isNodeExported(node)) return;

    const declaration = getNodeDeclaration(node, checker);
    if (declaration) declarationList.push(declaration);
  });

  return declarationList;
};

export const groupDeclarationByKind = (declarationList: Array<AllDeclaration>) => {
  return declarationList.reduce((map, declaration) => {
    if (!map[declaration.kind]) map[declaration.kind] = [declaration];
    else map[declaration.kind].push(declaration);
    return map;
  }, {} as Record<DECLARATION_KIND, Array<AllDeclaration>>);
};
