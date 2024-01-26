import ts from 'typescript';
import { DECLARATION_KIND } from '../../../../constants/declaration';
import {
  AllDeclaration,
  ClassDeclaration,
  EnumDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  VariableDeclaration
} from '../../../../typings/declaration';
import { ClassMemberDeclaration } from '../../../../typings/item';
import { parseJSDocComments } from './comment';
import { getNodeDeclarationKind } from './kind';

const getDeclarationCommon = <T extends DECLARATION_KIND>(kind: T, node: ts.Node, checker: ts.TypeChecker) => {
  const symbol = checker.getSymbolAtLocation((node as any).name)!;

  return {
    kind: kind,
    name: ((node as any).name && ts.isIdentifier((node as any).name) ? (node as any).name.text : symbol?.name) || '',
    comments: symbol ? parseJSDocComments(symbol, checker) : { title: '', description: '', tags: {} }
  };
};

const getEnumDeclaration = (node: ts.EnumDeclaration, checker: ts.TypeChecker): EnumDeclaration => {
  return {
    ...getDeclarationCommon(DECLARATION_KIND.ENUM, node, checker),
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
    ...getDeclarationCommon(DECLARATION_KIND.INTERFACE, node, checker),
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
    ...getDeclarationCommon(DECLARATION_KIND.TYPE_ALIAS, node, checker),
    type: checker.typeToString(type)
  };
};

const getFunctionDeclaration = (
  node: ts.FunctionDeclaration | ts.ArrowFunction | ts.FunctionExpression,
  checker: ts.TypeChecker
): FunctionDeclaration => {
  const signature = checker.getSignatureFromDeclaration(node);
  const returnType = checker.getReturnTypeOfSignature(signature!);

  const commonResult = getDeclarationCommon(DECLARATION_KIND.FUNCTION, node, checker);

  return {
    kind: DECLARATION_KIND.FUNCTION,
    name: commonResult.name || 'anonymous function',
    comments: commonResult.comments,
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

const getClassDeclaration = (node: ts.ClassDeclaration, checker: ts.TypeChecker): ClassDeclaration => {
  let constructor;
  const members = node.members
    .map(member => {
      if (ts.isConstructorDeclaration(member)) {
        constructor = getFunctionDeclaration(member as any, checker);
        return null;
      }

      if (!member.name) return null;

      const symbol = checker.getSymbolAtLocation(member.name);
      if (!symbol) return null;

      const flags: Array<string> = [];

      // static
      if ((ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Static) === 32) {
        flags.push('static');
      }

      // scope
      if (ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Private) {
        return null;
        // flags.push('private');
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
    })
    .filter(Boolean) as Array<ClassMemberDeclaration>;

  return {
    ...getDeclarationCommon(DECLARATION_KIND.CLASS, node, checker),
    constructor: constructor,
    members: members
  };
};

const getVariableDeclaration = (node: ts.VariableDeclaration, checker: ts.TypeChecker): VariableDeclaration => {
  if (ts.isVariableStatement(node)) {
    node = (node as ts.VariableStatement).declarationList.declarations[0];
  }

  const commonInfo = getDeclarationCommon(DECLARATION_KIND.VARIABLE, node, checker);

  if (node.initializer) {
    const type = checker.getTypeAtLocation(node.initializer);

    if (ts.isObjectLiteralExpression(node.initializer)) {
      return {
        ...commonInfo,
        type: 'Object',
        members: node.initializer.properties.map(prop => {
          let propName = '';
          let propType = 'any';

          if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
            propName = prop.name.text;
            propType = checker.typeToString(checker.getTypeAtLocation(prop.initializer));
          } else if (ts.isShorthandPropertyAssignment(prop)) {
            // 处理属性简写
            propName = prop.name.text;
            const symbol = checker.getSymbolAtLocation(prop.name);
            propType = symbol ? checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, prop)) : 'unknown';
          }

          return {
            name: propName,
            type: propType,
            comments: parseJSDocComments(checker.getSymbolAtLocation(prop.name!)!, checker)
          };
        })
      };
    } else if (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer)) {
      return {
        ...getFunctionDeclaration(node.initializer, checker),
        name: commonInfo.name,
        comments: commonInfo.comments
      } as any;
    }

    return {
      ...commonInfo,
      type: checker.typeToString(type)
    };
  }

  return {
    ...commonInfo,
    type: 'any'
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
