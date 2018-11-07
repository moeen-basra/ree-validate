// @flow
import dictionary from './dictionary'
import { assign, isCallable, warn } from './utils'
import Validator from './core/Validator'
import ErrorBag from './core/ErrorBag'
import mapFields from './core/mapFields'
import I18nDictionary from './localization/i18n'

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
  validity: false,
  i18n: null,
  i18nRootKey: 'validation'
}

export let currentConfig = assign({}, defaultConfig)

class ReeValidate {
  static version: string
  static Validator: Function<Validator>
  _validator: Validator

  constructor (config) {
    this.configure(config)
    this._validator = new Validator(null, { fastExit: config && config.fastExit })
    this._initI18n(this.config)
  }

  static get i18nDriver (): IDictionary {
    return dictionary.getDriver()
  }

  static get config () {
    return currentConfig
  }

  get i18nDriver (): IDictionary {
    return dictionary.getDriver()
  }

  get config () {
    return currentConfig
  }

  static setI18nDriver (driver: string, instance): void {
    dictionary.setDriver(driver, instance)
  }

  static configure (cfg) {
    currentConfig = assign({}, currentConfig, cfg)
  }

  static use (plugin: (ctx: PluginContext, options?: any) => any, options?: any = {}) {
    if (!isCallable(plugin)) {
      return warn('The plugin must be a callable function')
    }

    plugin({ Validator, ErrorBag, Rules: Validator.rules }, options)
  };

  _initI18n (config) {
    const { dictionary, i18n, i18nRootKey, locale } = config
    // i18 is being used for localization.
    if (i18n) {
      ReeValidate.setI18nDriver('i18n', new I18nDictionary(i18n, i18nRootKey))
    }

    if (dictionary) {
      this.i18nDriver.merge(dictionary)
    }

    if (locale && !i18n) {
      this._validator.localize(locale)
    }
  }

  configure (cfg) {
    ReeValidate.configure(cfg)
  }

  resolveConfig (ctx) {
    return assign({}, this.config)
  }
}

ReeValidate.version = '__VERSION__'
ReeValidate.Validator = Validator
ReeValidate.ErrorBag = ErrorBag
ReeValidate.mapFields = mapFields

export default ReeValidate
