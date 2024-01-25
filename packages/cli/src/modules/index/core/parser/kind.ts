import ts from 'typescript';
import { DECLARATION_KIND } from '../../constants/declaration';

export const getNodeDeclarationKind = (node: ts.Node): DECLARATION_KIND | undefined => {
  if (ts.isEnumDeclaration(node)) return DECLARATION_KIND.ENUM;
  if (ts.isInterfaceDeclaration(node)) return DECLARATION_KIND.INTERFACE;
  if (ts.isTypeAliasDeclaration(node)) return DECLARATION_KIND.TYPE_ALIAS;
  if (ts.isClassDeclaration(node)) return DECLARATION_KIND.CLASS;
  if (ts.isFunctionDeclaration(node)) return DECLARATION_KIND.FUNCTION;
  if (ts.isVariableDeclaration(node) || ts.isVariableStatement(node)) return DECLARATION_KIND.VARIABLE;
  return;
};
