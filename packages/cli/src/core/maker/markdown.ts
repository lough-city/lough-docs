export const makeMarkdownTitle = (title: string, level = 1) => {
  return `${new Array(level).fill('#').join('')} ${title}`;
};
