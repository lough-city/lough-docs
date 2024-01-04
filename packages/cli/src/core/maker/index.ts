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
import { groupDeclarationByKind } from '../parser';
import {
  makeByClass,
  makeByEnum,
  makeByFunction,
  makeByInterface,
  makeByTypeAlias,
  makeByVariable
} from './declaration';

export const makerDeclarationDocs = (declarationList: Array<AllDeclaration>) => {
  const declarationMap = groupDeclarationByKind(declarationList);
  let markdown = '';

  if (declarationMap[DECLARATION_KIND.VARIABLE]) {
    markdown += makeByVariable(declarationMap[DECLARATION_KIND.VARIABLE] as Array<VariableDeclaration>);
  }
  if (declarationMap[DECLARATION_KIND.FUNCTION]) {
    markdown += makeByFunction(declarationMap[DECLARATION_KIND.FUNCTION] as Array<FunctionDeclaration>);
  }
  if (declarationMap[DECLARATION_KIND.CLASS]) {
    markdown += makeByClass(declarationMap[DECLARATION_KIND.CLASS] as Array<ClassDeclaration>);
  }
  if (declarationMap[DECLARATION_KIND.ENUM]) {
    markdown += makeByEnum(declarationMap[DECLARATION_KIND.ENUM] as Array<EnumDeclaration>);
  }
  if (declarationMap[DECLARATION_KIND.INTERFACE]) {
    markdown += makeByInterface(declarationMap[DECLARATION_KIND.INTERFACE] as Array<InterfaceDeclaration>);
  }
  if (declarationMap[DECLARATION_KIND.TYPE_ALIAS]) {
    markdown += makeByTypeAlias(declarationMap[DECLARATION_KIND.TYPE_ALIAS] as Array<TypeAliasDeclaration>);
  }

  return markdown;
};
