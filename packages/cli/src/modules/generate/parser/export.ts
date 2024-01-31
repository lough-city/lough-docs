import ts from 'typescript';

export const isNodeExported = (node: ts.Node) => {
  // 检查该节点是否直接带有 'export' 修饰符
  const isDirectExport = (ts.getCombinedModifierFlags(node as any) & ts.ModifierFlags.Export) !== 0;

  // 检查该节点的父节点是否是 'ExportDeclaration'
  const isExportDeclaration = node.parent && node.parent.kind === ts.SyntaxKind.ExportDeclaration;

  return isDirectExport || isExportDeclaration;
};
