import ts from 'typescript';
import { DECLARATION_KIND } from '../../constants/declaration';
import {
  AllDeclaration,
  ClassDeclaration,
  EnumDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  VariableDeclaration
} from '../../typings/declaration';
import { parseJSDocComments } from './comment';
import { getNodeDeclarationKind } from './kind';

const getDeclarationCommon = <T = DECLARATION_KIND>(node: ts.Node, checker: ts.TypeChecker) => {
  const symbol = checker.getSymbolAtLocation((node as any).name)!;

  return {
    kind: getNodeDeclarationKind(node) as T,
    name: symbol?.name || '',
    comments: symbol ? parseJSDocComments(symbol, checker) : { title: '', tags: {} }
  };
};

const getEnumDeclaration = (node: ts.EnumDeclaration, checker: ts.TypeChecker): EnumDeclaration => {
  return {
    ...getDeclarationCommon<DECLARATION_KIND.ENUM>(node, checker),
    members: node.members.map(member => {
      return {
        name: member.name.getText(),
        value: member.initializer?.getText() || '',
        comments: parseJSDocComments(checker.getSymbolAtLocation(member.name)!, checker)
      };
    })
  };
};

const getInterfaceDeclaration = (node: ts.InterfaceDeclaration, checker: ts.TypeChecker): InterfaceDeclaration => {
  const symbol = checker.getSymbolAtLocation(node.name)!;
  const type = checker.getDeclaredTypeOfSymbol(symbol);

  return {
    ...getDeclarationCommon<DECLARATION_KIND.INTERFACE>(node, checker),
    members: type.getProperties().map(prop => {
      const propType = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration as any);
      return {
        name: prop.name,
        type: checker.typeToString(propType),
        comments: parseJSDocComments(prop, checker)
      };
    })
  };
};

const getTypeAliasDeclaration = (node: ts.TypeAliasDeclaration, checker: ts.TypeChecker): TypeAliasDeclaration => {
  const symbol = checker.getSymbolAtLocation(node.name)!;
  const type = checker.getDeclaredTypeOfSymbol(symbol);

  return {
    ...getDeclarationCommon<DECLARATION_KIND.TYPE_ALIAS>(node, checker),
    type: checker.typeToString(type)
  };
};

const getClassDeclaration = (node: ts.ClassDeclaration, checker: ts.TypeChecker): ClassDeclaration => {
  return {
    ...getDeclarationCommon<DECLARATION_KIND.CLASS>(node, checker),
    parameters: [],
    members: node.members.map(member => {
      const symbol = checker.getSymbolAtLocation(member.name!)!;

      const flags: Array<string> = [];

      // static
      if ((ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Static) === 32) {
        flags.push('static');
      }

      // scope
      if (ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Private) {
        flags.push('private');
      }
      if (ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Protected) {
        flags.push('protected');
      }
      if (ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Public) {
        flags.push('public');
      }

      // type
      if (ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Abstract) {
        flags.push('abstract');
      }
      if (ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Readonly) {
        flags.push('readonly');
      }

      const type = checker.getTypeOfSymbolAtLocation(symbol, member);
      return {
        name: symbol.getName(),
        type: checker.typeToString(type),
        flags: flags,
        comments: parseJSDocComments(symbol, checker)
      };
    }),
    return: ''
  };
};

const getFunctionDeclaration = (node: ts.FunctionDeclaration, checker: ts.TypeChecker): FunctionDeclaration => {
  const signature = checker.getSignatureFromDeclaration(node);
  const returnType = checker.getReturnTypeOfSignature(signature!);

  return {
    ...getDeclarationCommon<DECLARATION_KIND.FUNCTION>(node, checker),
    parameters: node.parameters.map(param => {
      const paramSymbol = checker.getSymbolAtLocation(param.name) as any;
      const paramType = checker.getTypeOfSymbolAtLocation(paramSymbol, param);
      return {
        name: paramSymbol.name,
        type: checker.typeToString(paramType),
        required: !param.questionToken && !param.initializer,
        default: param.initializer ? param.initializer.getText() : undefined,
        comments: parseJSDocComments(paramSymbol, checker)
      };
    }),
    return: checker.typeToString(returnType)
  };
};

const getVariableDeclaration = (node: ts.VariableDeclaration, checker: ts.TypeChecker): VariableDeclaration => {
  if (ts.isVariableStatement(node)) {
    node = (node as ts.VariableStatement).declarationList.declarations[0];
  }

  const symbol = checker.getSymbolAtLocation(node.name)!;

  return {
    ...getDeclarationCommon<DECLARATION_KIND.VARIABLE>(node, checker),
    type: symbol
      ? checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration || node))
      : 'any'
  };
};

export const getNodeDeclaration = (node: ts.Node, checker: ts.TypeChecker): AllDeclaration | undefined => {
  const kind = getNodeDeclarationKind(node);

  switch (kind) {
    case DECLARATION_KIND.ENUM:
      return getEnumDeclaration(node as ts.EnumDeclaration, checker);
    case DECLARATION_KIND.INTERFACE:
      return getInterfaceDeclaration(node as ts.InterfaceDeclaration, checker);
    case DECLARATION_KIND.TYPE_ALIAS:
      return getTypeAliasDeclaration(node as ts.TypeAliasDeclaration, checker);
    case DECLARATION_KIND.CLASS:
      return getClassDeclaration(node as ts.ClassDeclaration, checker);
    case DECLARATION_KIND.FUNCTION:
      return getFunctionDeclaration(node as ts.FunctionDeclaration, checker);
    case DECLARATION_KIND.VARIABLE:
      return getVariableDeclaration(node as ts.VariableDeclaration, checker);
    default:
      return undefined;
  }
};
