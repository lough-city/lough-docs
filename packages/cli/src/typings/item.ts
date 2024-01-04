import { JSDocComments } from './comment';

export interface ParameterDeclaration<Default = any> {
  name: string;
  type: string;
  default?: Default;
  required: boolean;
  comments: JSDocComments;
}
