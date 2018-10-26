import dictionary from './dictionary';
import { assign, getPath, warn, isCallable } from './utils';
import Validator from './core/validator';
import ErrorBag from './core/errorBag';
import mapFields from './core/mapFields';
import { ValidationProvider } from './components';
import I18nDictionary from './localization/i18n';

// @flow

const defaultConfig = {
  locale: 'en',
  delay: 0,
  errorBagName: 'errors',
  dictionary: null,
  fieldsBagName: 'fields',
  classes: false,
  classNames: null,
  events: 'input',
  inject: true,
  fastExit: true,
  aria: true,
  validity: false,
  i18n: null,
  i18nRootKey: 'validation'
};

export let currentConfig = assign({}, defaultConfig);

class ReeValidate {
  static version: string
  static install: () => void
  static Validator: Function<Validator>
  _validator: Validator

  constructor (config) {
    this.configure(config);
    this._validator = new Validator(null, { fastExit: config && config.fastExit });
    this._initI18n(this.config);
  }

  static setI18nDriver (driver: string, instance): void {
    dictionary.setDriver(driver, instance);
  }

  static configure (cfg) {
    currentConfig = assign({}, currentConfig, cfg);
  }

  static use (plugin: (ctx: PluginContext, options?: any) => any, options?: any = {}) {
    if (!isCallable(plugin)) {
      return warn('The plugin must be a callable function');
    }

    plugin({ Validator, ErrorBag, Rules: Validator.rules }, options);
  };

  get i18nDriver (): IDictionary {
    return dictionary.getDriver();
  }

  static get i18nDriver (): IDictionary {
    return dictionary.getDriver();
  }

  get config () {
    return currentConfig;
  }

  static get config () {
    return currentConfig;
  }

  _initI18n (config) {
    const { dictionary, i18n, i18nRootKey, locale } = config;
    const onLocaleChanged = () => {
      this._validator.errors.regenerate();
    };

    // i18 is being used for localization.
    if (i18n) {
      ReeValidate.setI18nDriver('i18n', new I18nDictionary(i18n, i18nRootKey));
      i18n._vm.$watch('locale', onLocaleChanged);
    } else if (typeof window !== 'undefined') {
      this._vm.$on('localeChanged', onLocaleChanged);
    }

    if (dictionary) {
      this.i18nDriver.merge(dictionary);
    }

    if (locale && !i18n) {
      this._validator.localize(locale);
    }
  }

  configure (cfg) {
    ReeValidate.configure(cfg);
  }

  resolveConfig (ctx) {
    const selfConfig = getPath('$options.$_reeValidate', ctx, {});

    return assign({}, this.config, selfConfig);
  }
}

ReeValidate.version = '__VERSION__';
ReeValidate.Validator = Validator;
ReeValidate.ErrorBag = ErrorBag;
ReeValidate.mapFields = mapFields;
ReeValidate.ValidationProvider = ValidationProvider;

export default ReeValidate;
