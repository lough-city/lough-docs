import ts from 'typescript';
import { JSDocComments } from '../../../../typings/comment';

export function parseJSDocComments(symbol: ts.Symbol, checker: ts.TypeChecker): JSDocComments {
  const jsDocs = symbol.getJsDocTags(checker);

  let title = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
  const tags: Record<string, string> = {};

  for (const doc of jsDocs) {
    if (doc.name) {
      tags[doc.name] = doc.text?.[0].text || '';
    } else {
      title += doc.text + '\n';
    }
  }
  let description = '';
  if (tags['description']) {
    // eslint-disable-next-line prefer-destructuring
    description = tags['description'];
    delete tags['description'];
  }

  return { title: title.trim(), description, tags };
}
