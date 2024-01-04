import {
  ClassDeclaration,
  EnumDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  VariableDeclaration
} from '../../typings/declaration';
import {
  makeDeclarationComments,
  makeDeclarationParameters,
  makeDeclarationReturn,
  makeDeclarationTitle,
  makeDeclarationType
} from './item';

export const makeByEnum = (declarationList: Array<EnumDeclaration>) => {
  let markdown = `

## Enum

`;

  for (const declaration of declarationList) {
    markdown += `

${makeDeclarationTitle(declaration)}
${makeDeclarationComments(declaration.comments)}
`;
  }

  return markdown;
};

export const makeByInterface = (declarationList: Array<InterfaceDeclaration>) => {
  let markdown = `

## Interface

`;

  for (const declaration of declarationList) {
    markdown += `

${makeDeclarationTitle(declaration)}
${makeDeclarationComments(declaration.comments)}
members

${declaration.members
  .map(
    member => `- ${member.name} ${member.comments.title}

${member.type}

${JSON.stringify(member.comments.tags)}

`
  )
  .join('')}
`;
  }

  return markdown;
};

export const makeByTypeAlias = (declarationList: Array<TypeAliasDeclaration>) => {
  let markdown = `

## TypeAlias

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

## Class

`;

  for (const declaration of declarationList) {
    markdown += `

${makeDeclarationTitle(declaration)}
${makeDeclarationComments(declaration.comments)}
members

${declaration.members
  .map(
    member => `- ${member.name} ${member.comments.title}

${JSON.stringify(member.flags)}

${member.type}

${JSON.stringify(member.comments.tags)}

`
  )
  .join('')}
`;
  }

  return markdown;
};

export const makeByFunction = (declarationList: Array<FunctionDeclaration>) => {
  let markdown = `

## Function

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

## Variable

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
