import { JSDocComments } from './comment';

export interface ParameterDeclaration<Default = any> {
  name: string;
  type: string;
  default?: Default;
  required: boolean;
  comments: JSDocComments;
}

export interface EnumMemberDeclaration {
  name: string;
  value: string | number;
  comments: JSDocComments;
}

export interface InterfaceMemberDeclaration {
  name: string;
  type: string;
  comments: JSDocComments;
}

export interface ClassMemberDeclaration {
  name: string;
  type: string;
  flags: Array<string>;
  comments: JSDocComments;
}
