import { basename, extname } from 'path';
import ts from 'typescript';
import { DECLARATION_KIND } from '../../../../constants/declaration';
import { AllDeclaration } from '../../../../typings/declaration';
import { resolveModulePath } from '../../../../utils/path';
import { parseTypeScriptPath } from '../../../../utils/typescript';
import { createVirtualVariableDeclarationForExportAssignment } from './create';
import { getNodeDeclaration } from './declaration';
import { isNodeExported } from './export';

export const parseTypeScriptProject = (path: string, parsing?: (filePath: string) => any) => {
  const { checker, sourceFile } = parseTypeScriptPath(path);
  if (!sourceFile) {
    console.warn('Missing sourceFile for:', path);
    return;
  }

  parsing?.(path);

  const declarationList: Array<AllDeclaration> = [];

  ts.forEachChild(sourceFile, function (node) {
    if (ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier) {
        const moduleSpecifierText = node.moduleSpecifier.getText().replace(/['"]/g, '');
        const resolvedModulePath = resolveModulePath(path, moduleSpecifierText);

        if (resolvedModulePath) {
          let list = parseTypeScriptProject(resolvedModulePath, parsing) || [];

          if (node.exportClause && ts.isNamedExports(node.exportClause)) {
            const exportedNames = node.exportClause.elements.map(e => e.name.text);
            if (list.length) list = list.filter(item => exportedNames.includes(item.name));
          }

          declarationList.push(...list);
        } else {
          console.warn('Could not resolve module path for:', moduleSpecifierText);
        }
      }
    } else if (ts.isExportAssignment(node)) {
      const fullPath = sourceFile.fileName;
      const variableName = basename(fullPath, extname(fullPath));
      const virtualVarDecl = createVirtualVariableDeclarationForExportAssignment(node, checker, variableName);
      if (virtualVarDecl) {
        const declaration = getNodeDeclaration(virtualVarDecl, checker);
        if (declaration) declarationList.push(declaration);
      }
    } else {
      if (!isNodeExported(node)) return;

      const declaration = getNodeDeclaration(node, checker);
      if (declaration) declarationList.push(declaration);
    }
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
