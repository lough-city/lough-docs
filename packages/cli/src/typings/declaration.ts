import { DECLARATION_KIND } from '../constants/declaration';
import { JSDocComments } from './comment';
import { ParameterDeclaration } from './item';

export interface EnumDeclaration {
  kind: DECLARATION_KIND.ENUM;
  name: string;
  comments: JSDocComments;
  members: Array<{
    name: string;
    value: string | number;
    comments: JSDocComments;
  }>;
}

export interface InterfaceDeclaration {
  kind: DECLARATION_KIND.INTERFACE;
  name: string;
  comments: JSDocComments;
  members: Array<{
    name: string;
    type: string;
    comments: JSDocComments;
  }>;
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
  parameters: Array<{
    name: string;
    value: string | number;
    comments: JSDocComments;
  }>;
  members: Array<{
    name: string;
    type: string;
    flags: Array<string>;
    comments: JSDocComments;
  }>;
  return: string;
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
