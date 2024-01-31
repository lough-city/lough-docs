import { LINE_BREAK } from '../../../../constants';
import { VariableDeclaration } from '../../typings/declaration';
import { VariableMemberDeclaration } from '../../typings/item';
import { makeMarkdownTitle } from '../api/markdown';

export const makeByCommand = (cmd: string, declarationList: Array<VariableDeclaration>) => {
  let commandDocs = `

${makeMarkdownTitle('Command', 3)}


\`\`\`bash
${cmd} [options] [command]
\`\`\`

`;

  for (const declaration of declarationList) {
    if (!declaration.members?.length) continue;

    const map = declaration.members.reduce((map, item) => {
      map[item.name] = item;
      return map;
    }, {} as Record<string, VariableMemberDeclaration>);

    const options = map['options']?.type?.split('<br />');

    if (!map['name']) {
      commandDocs += `

${map['description'].type.replaceAll('"', '')}



**options**:

${options.map(str => `- ${str}`).join(LINE_BREAK)}



**action**: \`${map['action'].type}\`
`;
    } else {
      commandDocs += `


${makeMarkdownTitle(map['name'].type.replaceAll('"', ''), 4)}



${map['description'].type.replaceAll('"', '')}



**options**:

${options.map(str => `- ${str}`).join(LINE_BREAK)}



**action**: \`${map['action'].type}\`

`;
    }
  }

  return commandDocs;
};
