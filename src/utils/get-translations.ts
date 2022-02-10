import process from 'process';
import lang from '../lang';
import { loggr } from '.';
import type { Language } from '../types';

export const getTranslations = (code: string): Language => {
  if (!(code in lang)) {
    loggr.error(`Unknown language code "${code}"`);
    process.exit(1);
  }

  return lang[code];
}