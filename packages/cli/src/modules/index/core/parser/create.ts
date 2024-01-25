import ts from 'typescript';

export const createVirtualVariableDeclarationForExportAssignment = (
  node: ts.ExportAssignment,
  checker: ts.TypeChecker,
  variableName = 'default'
): ts.VariableDeclaration | undefined => {
  if (!node.expression) return undefined;

  const name = ts.factory.createIdentifier(variableName);

  // 尝试创建类型节点
  let typeNode;
  try {
    typeNode = checker.typeToTypeNode(
      checker.getTypeAtLocation(node.expression),
      undefined,
      ts.NodeBuilderFlags.NoTruncation
    );
  } catch (error) {
    console.error('Error creating type node:', error);
    typeNode = undefined;
  }

  // 如果无法确定类型节点，则默认为 'any'
  typeNode = typeNode || ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);

  // 创建虚拟的变量声明
  const virtualVarDecl = ts.factory.createVariableDeclaration(name, undefined, typeNode, node.expression);

  return virtualVarDecl as ts.VariableDeclaration;
};
