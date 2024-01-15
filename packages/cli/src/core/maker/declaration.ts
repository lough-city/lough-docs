import {
  ClassDeclaration,
  EnumDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  VariableDeclaration
} from '../../typings/declaration';
import {
  makDeclarationEnumMembers,
  makDeclarationInterfaceMembers,
  makeDeclarationClassMembers,
  makeDeclarationComments,
  makeDeclarationParameters,
  makeDeclarationReturn,
  makeDeclarationTitle,
  makeDeclarationType
} from './item';
import { makeMarkdownTitle } from './markdown';

export const makeByEnum = (declarationList: Array<EnumDeclaration>) => {
  let markdown = `

${makeMarkdownTitle('Enum', 3)}

`;

  for (const declaration of declarationList) {
    markdown += `

${makeDeclarationTitle(declaration)}
${makeDeclarationComments(declaration.comments)}
${makDeclarationEnumMembers(declaration.members)}
`;
  }

  return markdown;
};

export const makeByInterface = (declarationList: Array<InterfaceDeclaration>) => {
  let markdown = `

${makeMarkdownTitle('Interface', 3)}

`;

  for (const declaration of declarationList) {
    markdown += `

${makeDeclarationTitle(declaration)}
${makeDeclarationComments(declaration.comments)}
${makDeclarationInterfaceMembers(declaration.members)}
`;
  }

  return markdown;
};

export const makeByTypeAlias = (declarationList: Array<TypeAliasDeclaration>) => {
  let markdown = `

${makeMarkdownTitle('TypeAlias', 3)}

`;

  for (const declaration of declarationList) {
    markdown += `

${makeDeclarationTitle(declaration)}
${makeDeclarationType(declaration.type)}
${makeDeclarationComments(declaration.comments)}
`;
  }

  return markdown;
};

export const makeByClass = (declarationList: Array<ClassDeclaration>) => {
  let markdown = `

${makeMarkdownTitle('Class', 3)}

`;

  for (const declaration of declarationList) {
    markdown += `

${makeDeclarationTitle(declaration)}
${makeDeclarationComments(declaration.comments)}
${makeDeclarationParameters(declaration.parameters)}
${makeDeclarationClassMembers(declaration.members)}
`;
  }

  return markdown;
};

export const makeByFunction = (declarationList: Array<FunctionDeclaration>) => {
  let markdown = `

${makeMarkdownTitle('Function', 3)}

`;

  for (const declaration of declarationList) {
    markdown += `

${makeDeclarationTitle(declaration)}
${makeDeclarationComments(declaration.comments)}
${makeDeclarationParameters(declaration.parameters)}
${makeDeclarationReturn(declaration.return)}
`;
  }

  return markdown;
};

export const makeByVariable = (declarationList: Array<VariableDeclaration>) => {
  let markdown = `

${makeMarkdownTitle('Variable', 3)}

`;

  for (const declaration of declarationList) {
    markdown += `

${makeDeclarationTitle(declaration)}
${makeDeclarationType(declaration.type)}
${makeDeclarationComments(declaration.comments)}
`;
  }

  return markdown;
};
