import { LINE_BREAK } from '../../../../constants';
import { JSDocComments } from '../../../../typings/comment';
import { AllDeclaration } from '../../../../typings/declaration';
import {
  ClassMemberDeclaration,
  EnumMemberDeclaration,
  InterfaceMemberDeclaration,
  ParameterDeclaration
} from '../../../../typings/item';
import { makeMarkdownTitle } from './markdown';

export const makeDeclarationTitle = (declaration: AllDeclaration) => {
  return `${makeMarkdownTitle(`${declaration.name} ${declaration.comments.title}`, 4)}
`;
};

export const makeDeclarationDescription = (comments: JSDocComments) => {
  return comments.title && comments.description
    ? `${comments.title}  ${comments.description}`
    : comments.description || comments.title || '-';
};

export const makeDeclarationComments = (comments: JSDocComments) => {
  return Object.keys(comments.tags).length
    ? `**comments**

${Object.keys(comments.tags)
  .map(key => `\`${key}\`: *${comments.tags[key]}*`)
  .join(LINE_BREAK)}
`
    : '';
};

export const makeDeclarationParameters = (parameters: Array<ParameterDeclaration>) => {
  return `**parameters**

| 属性 | 说明  | 必传 | 类型     | 默认值 |
| ---- | ----- | ---- | -------- | ------ |
${parameters
  .map(
    parameter =>
      `| ${parameter.name}   | ${makeDeclarationDescription(parameter.comments)} | ${
        parameter.required ? '是' : '否'
      }   | \`${parameter.type}\` | ${parameter.default === undefined ? '-' : parameter.default}      |`
  )
  .join(LINE_BREAK)}
`;
};

export const makeDeclarationReturn = (returnType: string) => {
  return `**returns**: \`${returnType}\`
`;
};

export const makeDeclarationType = (type: string) => {
  return `**type**: \`${type}\`
`;
};

export const makDeclarationEnumMembers = (members: Array<EnumMemberDeclaration>) => {
  return `**members**

| 属性 | 说明   | 值    |
| ---- | ---- | ------- |
${members
  .map(member => `| ${member.name}    | ${makeDeclarationDescription(member.comments)}  | ${member.value} |`)
  .join(LINE_BREAK)}
`;
};

export const makDeclarationInterfaceMembers = (members: Array<InterfaceMemberDeclaration>) => {
  return `**members**

| 属性 | 说明   | 类型    |
| ---- | ---- | ------- |
${members
  .map(member => `| ${member.name}    | ${makeDeclarationDescription(member.comments)}  | ${member.type} |`)
  .join(LINE_BREAK)}
`;
};

export const makeDeclarationClassMembers = (members: Array<ClassMemberDeclaration>) => {
  return `**members**

| 属性 | 说明  | 类型     | 标记     |
| ---- | ----- | -------- | -------- |
${members
  .map(
    member =>
      `| ${member.name}    | ${makeDeclarationDescription(member.comments)} | \`${member.type}\` | ${member.flags.map(
        flag => `\`${flag}\``
      )} |`
  )
  .join(LINE_BREAK)}
`;
};
