import Validator from './validator';
import ErrorBag from './errorBag';
import Rules from './rules';
import { assign } from './utils';
import defaultOptions from './config';
import mapFields from './helpers';

// eslint-disable-next-line
const install = (options) => {
  const config = assign({}, defaultOptions, options);
  if (config.dictionary) {
    Validator.updateDictionary(config.dictionary);
  }

  Validator.setLocale(config.locale);
  Validator.setStrictMode(config.strict);
};

export default {
  install,
  mapFields,
  Validator,
  ErrorBag,
  Rules,
  version: '__VERSION__'
};
