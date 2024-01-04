import { LINE_BREAK } from '../../constants';
import { JSDocComments } from '../../typings/comment';
import { AllDeclaration } from '../../typings/declaration';
import { ParameterDeclaration } from '../../typings/item';

export const makeDeclarationTitle = (declaration: AllDeclaration) => {
  return `### ${declaration.name} ${declaration.comments.title}
`;
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
      `| ${parameter.name}   | ${parameter.comments.title} | ${parameter.required ? '是' : '否'}   | \`${
        parameter.type
      }\` | ${parameter.default === undefined ? '-' : parameter.default}      |`
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
