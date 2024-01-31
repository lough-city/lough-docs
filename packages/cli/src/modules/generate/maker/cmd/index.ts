import { LINE_BREAK } from '../../../../constants';
import { DECLARATION_KIND } from '../../constants/declaration';
import { AllDeclaration, VariableDeclaration } from '../../typings/declaration';
import { makerDeclarationDocs } from '../api';
import { makeByCommand } from './command';

export const makerCommandDeclarationDocs = (bin: string, declarationList: Array<AllDeclaration>) => {
  const _declarationList: Array<AllDeclaration> = [];

  const variableDeclarationList = declarationList.reduce((list, item) => {
    if (item.kind === DECLARATION_KIND.VARIABLE && item.members?.length) {
      if (item.members.find(i => i.name === 'name')) {
        list.push(item);
      } else {
        list.unshift(item);
      }
    } else {
      _declarationList.push(item);
    }
    return list;
  }, [] as Array<VariableDeclaration>);

  const commandDocs = makeByCommand(bin, variableDeclarationList);

  return commandDocs + LINE_BREAK + makerDeclarationDocs(_declarationList);
};
