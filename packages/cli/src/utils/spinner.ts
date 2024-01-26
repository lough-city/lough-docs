import chalk from 'chalk';
import ora from 'ora';

const spinner = ora();

export const startSpinner = (text: string) => {
  text = `${text}...\n`;
  spinner.start(text);
  spinner.stopAndPersist({ symbol: '✨', text: text });
};

export const succeedSpinner = (text: string) => {
  spinner.stopAndPersist({ symbol: '🎉', text: `${text}\n` });
};

export const failSpinner = (text: string) => {
  spinner.fail(chalk.red(text));
};

export const startLoadingSpinner = (text: string) => {
  spinner.start(`${text}...\n`);
};

export const textLoadingSpinner = (text: string) => {
  spinner.text = `${text}...\n`;
};

export const succeedLoadingSpinner = (text: string) => {
  spinner.succeed(`${text}\n`);
};

export const failLoadingSpinner = (text: string) => {
  spinner.fail(`${text}\n`);
};
