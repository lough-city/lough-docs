import ts from 'typescript';
import { AllDeclaration } from '../../typings/declaration';
import { getNodeDeclaration } from './declaration';

function isNodeExported(node: any) {
  // 检查该节点是否直接带有 'export' 修饰符
  const isDirectExport = (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;

  // 检查该节点的父节点是否是 'ExportDeclaration'
  const isExportDeclaration = node.parent && node.parent.kind === ts.SyntaxKind.ExportDeclaration;

  return isDirectExport || isExportDeclaration;
}

export const parseTypeScriptAST = (source: ts.SourceFile, checker: ts.TypeChecker) => {
  const declarationList: Array<AllDeclaration> = [];

  ts.forEachChild(source, node => {
    if (!isNodeExported(node)) return;

    declarationList.push(getNodeDeclaration(node, checker));
  });

  return declarationList;
};
