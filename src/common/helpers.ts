import * as path from 'path';
import * as fs from 'fs';
import { once } from 'lodash';

export const createLogsDirectory = once(() => {
  const logDirectory = process.env.LOG_DIR || path.resolve('./logs');

  try {
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
  } catch (e) {
    console.error(`Cannot create log directory: ${e}`); // tslint:disable-line no-console
  }

  return logDirectory;
});

export const createUUID = (() => {
  let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
});
