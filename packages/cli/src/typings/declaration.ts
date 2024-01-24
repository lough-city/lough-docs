import { DECLARATION_KIND } from '../constants/declaration';
import { JSDocComments } from './comment';
import {
  ClassMemberDeclaration,
  EnumMemberDeclaration,
  InterfaceMemberDeclaration,
  ParameterDeclaration
} from './item';

export interface EnumDeclaration {
  kind: DECLARATION_KIND.ENUM;
  name: string;
  comments: JSDocComments;
  members: Array<EnumMemberDeclaration>;
}

export interface InterfaceDeclaration {
  kind: DECLARATION_KIND.INTERFACE;
  name: string;
  comments: JSDocComments;
  members: Array<InterfaceMemberDeclaration>;
}

export interface TypeAliasDeclaration {
  kind: DECLARATION_KIND.TYPE_ALIAS;
  name: string;
  comments: JSDocComments;
  type: string;
}

export interface ClassDeclaration {
  kind: DECLARATION_KIND.CLASS;
  name: string;
  comments: JSDocComments;
  constructor?: FunctionDeclaration;
  members: Array<ClassMemberDeclaration>;
}

export interface FunctionDeclaration {
  kind: DECLARATION_KIND.FUNCTION;
  name: string;
  comments: JSDocComments;
  parameters: Array<ParameterDeclaration>;
  return: string;
}

export interface VariableDeclaration {
  kind: DECLARATION_KIND.VARIABLE;
  name: string;
  comments: JSDocComments;
  type: string;
}

export type AllDeclaration =
  | EnumDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration
  | ClassDeclaration
  | FunctionDeclaration
  | VariableDeclaration;
