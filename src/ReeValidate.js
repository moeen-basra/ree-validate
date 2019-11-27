// @flow
import dictionary from './dictionary'
import { isCallable, warn } from './utils'
import Validator from './core/Validator'
import ErrorBag from './core/ErrorBag'
import I18nDictionary from './localization/i18n'
import { getConfig, setConfig } from './config'

class ReeValidate {
  static version: string
  static Validator: Function<Validator>

  _validator: Validator

  constructor (config) {
    this.configure(config)
    this._validator = new Validator(null, { fastExit: config && config.fastExit })
    this._initI18n(this.config)
  }

  static setI18nDriver (driver: string, instance): void {
    dictionary.setDriver(driver, instance)
  }

  static configure (config) {
    setConfig(config)
  }

  static use (plugin: (ctx: PluginContext, options?: any) => any, options?: any = {}) {
    if (!isCallable(plugin)) {
      return warn('The plugin must be a callable function')
    }

    plugin({ Validator, ErrorBag, Rules: Validator.rules }, options)
  };

  get i18nDriver (): IDictionary {
    return dictionary.getDriver()
  }

  static get i18nDriver (): IDictionary {
    return dictionary.getDriver()
  }

  get config () {
    return getConfig()
  }

  static get config () {
    return getConfig()
  }

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
}

ReeValidate.Validator = Validator
ReeValidate.ErrorBag = ErrorBag

export default ReeValidate
