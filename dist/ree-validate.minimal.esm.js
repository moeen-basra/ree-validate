/**
  * ree-validate v3.3.0
  * (c) 2020 Moeen Basra
  * @license MIT
  */
// 

var isTextInput = function (el) {
  return includes(['text', 'password', 'search', 'email', 'tel', 'url', 'textarea', 'number'], el.type)
};

var isCheckboxOrRadioInput = function (el) {
  return includes(['radio', 'checkbox'], el.type)
};

/**
 * Checks if the values are either null or undefined.
 */
var isNullOrUndefined = function () {
  var values = [], len = arguments.length;
  while ( len-- ) values[ len ] = arguments[ len ];

  return values.every(function (value) {
    return value === null || value === undefined
  })
};

/**
 * Sets the data attribute.
 */
// export const setDataAttribute = (el: HTMLElement, name: string, value: string): void => el.setAttribute(`data-vv-${name}`, value)

/**
 * Creates the default flags object.
 */
var createFlags = function () { return ({
  untouched: true,
  touched: false,
  dirty: false,
  pristine: true,
  valid: null,
  invalid: null,
  validated: false,
  pending: false,
  required: false,
  changed: false,
}); };

/**
 * Gets the value in an object safely.
 */
var getPath = function (path, target, def) {
  if ( def === void 0 ) def = undefined;

  if (!path || !target) { return def }

  var value = target;
  path.split('.').every(function (prop) {
    if (prop in value) {
      value = value[prop];

      return true
    }

    value = def;

    return false
  });

  return value
};

/**
 * Parses a rule string expression.
 */
var parseRule = function (rule) {
  var params = [];
  var name = rule.split(':')[0];

  if (includes(rule, ':')) {
    params = rule.split(':').slice(1).join(':').split(',');
  }

  return { name: name, params: params }
};

/**
 * Normalizes the given rules expression.
 */
var normalizeRules = function (rules) {
  // if falsy value return an empty object.
  if (!rules) {
    return {}
  }

  if (isObject(rules)) {
    // $FlowFixMe
    return Object.keys(rules).reduce(function (prev, curr) {
      var params = [];
      // $FlowFixMe
      if (rules[curr] === true) {
        params = [];
      } else if (Array.isArray(rules[curr])) {
        params = rules[curr];
      } else if (isObject(rules[curr])) {
        params = rules[curr];
      } else {
        params = [rules[curr]];
      }

      // $FlowFixMe
      if (rules[curr] !== false) {
        prev[curr] = params;
      }

      return prev
    }, {})
  }

  if (typeof rules !== 'string') {
    warn('rules must be either a string or an object.');
    return {}
  }

  return rules.split('|').reduce(function (prev, rule) {
    var parsedRule = parseRule(rule);
    if (!parsedRule.name) {
      return prev
    }

    prev[parsedRule.name] = parsedRule.params;
    return prev
  }, {})
};

/**
 * Emits a warning to the console.
 */
var warn = function (message) {
  console.warn(("[ree-validate] " + message)); // eslint-disable-line
};

/**
 * Creates a branded error object.
 */
var createError = function (message) { return new Error(("[ree-validate] " + message)); };

/**
 * Checks if the value is an object.
 */
var isObject = function (obj) { return obj !== null && obj && typeof obj === 'object' && !Array.isArray(obj); };

/**
 * Checks if a function is callable.
 */
var isCallable = function (func) { return typeof func === 'function'; };

/**
 * Check if element has the css class on it.
 */
var hasClass = function (el, className) {
  if (el.classList) {
    return el.classList.contains(className)
  }

  return !!el.className.match(new RegExp(("(\\s|^)" + className + "(\\s|$)")))
};

/**
 * Adds the provided css className to the element.
 */
var addClass = function (el, className) {
  if (el.classList) {
    el.classList.add(className);
    return
  }

  if (!hasClass(el, className)) {
    el.className += " " + className;
  }
};

/**
 * Remove the provided css className from the element.
 */
var removeClass = function (el, className) {
  if (el.classList) {
    el.classList.remove(className);
    return
  }

  if (hasClass(el, className)) {
    var reg = new RegExp(("(\\s|^)" + className + "(\\s|$)"));
    el.className = el.className.replace(reg, ' ');
  }
};

/**
 * Adds or removes a class name on the input depending on the status flag.
 */
var toggleClass = function (el, className, status) {
  if (!el || !className) { return }

  if (Array.isArray(className)) {
    className.forEach(function (item) { return toggleClass(el, item, status); });
    return
  }

  if (status) {
    return addClass(el, className)
  }

  removeClass(el, className);
};

/**
 * Converts an array-like object to array, provides a simple polyfill for Array.from
 */
var toArray = function (arrayLike) {
  if (isCallable(Array.from)) {
    return Array.from(arrayLike)
  }

  var array = [];
  var length = arrayLike.length;
  /* istanbul ignore next */
  for (var i = 0; i < length; i++) {
    array.push(arrayLike[i]);
  }

  /* istanbul ignore next */
  return array
};

/**
 * Assign polyfill from the mdn.
 */
var assign = function (target) {
  var others = [], len = arguments.length - 1;
  while ( len-- > 0 ) others[ len ] = arguments[ len + 1 ];

  /* istanbul ignore else */
  if (isCallable(Object.assign)) {
    return Object.assign.apply(Object, [ target ].concat( others ))
  }

  /* istanbul ignore next */
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object')
  }

  /* istanbul ignore next */
  var to = Object(target);
  /* istanbul ignore next */
  others.forEach(function (arg) {
    // Skip over if undefined or null
    if (arg != null) {
      Object.keys(arg).forEach(function (key) {
        to[key] = arg[key];
      });
    }
  });
  /* istanbul ignore next */
  return to
};

var id = 0;
var idTemplate = '{id}';

/**
 * Generates a unique id.
 */
var uniqId = function () {
  // handle too many uses of uniqId, although unlikely.
  if (id >= 9999) {
    id = 0;
    // shift the template.
    idTemplate = idTemplate.replace('{id}', '_{id}');
  }

  id++;

  var newId = idTemplate.replace('{id}', String(id));

  return newId
};

var findIndex = function (arrayLike, predicate) {
  var array = Array.isArray(arrayLike) ? arrayLike : toArray(arrayLike);
  for (var i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return i
    }
  }

  return -1
};

/**
 * finds the first element that satisfies the predicate callback, polyfills array.find
 */
var find = function (arrayLike, predicate) {
  var array = Array.isArray(arrayLike) ? arrayLike : toArray(arrayLike);
  var idx = findIndex(array, predicate);

  return idx === -1 ? undefined : array[idx]
};

var makeDelayObject = function (events, delay, delayConfig) {
  if (typeof delay === 'number') {
    return events.reduce(function (prev, e) {
      prev[e] = delay;
      return prev
    }, {})
  }

  return events.reduce(function (prev, e) {
    if (typeof delay === 'object' && e in delay) {
      prev[e] = delay[e];
      return prev
    }

    if (typeof delayConfig === 'number') {
      prev[e] = delayConfig;
      return prev
    }

    prev[e] = (delayConfig && delayConfig[e]) || 0;

    return prev
  }, {})
};

var merge = function (target, source) {
  if (!(isObject(target) && isObject(source))) {
    return target
  }

  Object.keys(source).forEach(function (key) {
    var obj, obj$1;

    if (isObject(source[key])) {
      if (!target[key]) {
        assign(target, ( obj = {}, obj[key] = {}, obj ));
      }

      merge(target[key], source[key]);
      return
    }

    assign(target, ( obj$1 = {}, obj$1[key] = source[key], obj$1 ));
  });

  return target
};

var values = function (obj) {
  if (isCallable(Object.values)) {
    return Object.values(obj)
  }

  // fallback to keys()
  /* istanbul ignore next */
  return obj[Object.keys(obj)[0]]
};

var parseSelector = function (selector) {
  var rule = null;
  if (includes(selector, ':')) {
    rule = selector.split(':').pop();
    selector = selector.replace((":" + rule), '');
  }

  if (selector[0] === '#') {
    return {
      id: selector.slice(1),
      rule: rule,
      name: null,
      scope: null,
    }
  }

  var scope = null;
  var name = selector;
  if (includes(selector, '.')) {
    var parts = selector.split('.');
    scope = parts[0];
    name = parts.slice(1).join('.');
  }

  return {
    id: null,
    scope: scope,
    name: name,
    rule: rule,
  }
};

var includes = function (collection, item) {
  return collection.indexOf(item) !== -1
};

var isEmptyArray = function (arr) {
  return Array.isArray(arr) && arr.length === 0
};

// 

var LOCALE = 'en';

var Dictionary = function Dictionary (dictionary) {
  if ( dictionary === void 0 ) dictionary = {};

  this.container = {};
  this.merge(dictionary);
};

var prototypeAccessors = { locale: { configurable: true } };

prototypeAccessors.locale.get = function () {
  return LOCALE
};

prototypeAccessors.locale.set = function (value) {
  LOCALE = value || 'en';
};

Dictionary.prototype.hasLocale = function hasLocale (locale) {
  return !!this.container[locale]
};

Dictionary.prototype.setDateFormat = function setDateFormat (locale, format) {
  if (!this.container[locale]) {
    this.container[locale] = {};
  }

  this.container[locale].dateFormat = format;
};

Dictionary.prototype.getDateFormat = function getDateFormat (locale) {
  if (!this.container[locale] || !this.container[locale].dateFormat) {
    return null
  }

  return this.container[locale].dateFormat
};

Dictionary.prototype.getMessage = function getMessage (locale, key, data) {
  var message = null;
  if (!this.hasMessage(locale, key)) {
    message = this._getDefaultMessage(locale);
  } else {
    message = this.container[locale].messages[key];
  }

  return isCallable(message) ? message.apply(void 0, data) : message
};

/**
 * Gets a specific message for field. falls back to the rule message.
 */
Dictionary.prototype.getFieldMessage = function getFieldMessage (locale, field, key, data) {
  if (!this.hasLocale(locale)) {
    return this.getMessage(locale, key, data)
  }

  var dict = this.container[locale].custom && this.container[locale].custom[field];
  if (!dict || !dict[key]) {
    return this.getMessage(locale, key, data)
  }

  var message = dict[key];
  return isCallable(message) ? message.apply(void 0, data) : message
};

Dictionary.prototype._getDefaultMessage = function _getDefaultMessage (locale) {
  if (this.hasMessage(locale, '_default')) {
    return this.container[locale].messages._default
  }

  return this.container.en.messages._default
};

Dictionary.prototype.getAttribute = function getAttribute (locale, key, fallback) {
    if ( fallback === void 0 ) fallback = '';

  if (!this.hasAttribute(locale, key)) {
    return fallback
  }

  return this.container[locale].attributes[key]
};

Dictionary.prototype.hasMessage = function hasMessage (locale, key) {
  return !!(
    this.hasLocale(locale) &&
    this.container[locale].messages &&
    this.container[locale].messages[key]
  )
};

Dictionary.prototype.hasAttribute = function hasAttribute (locale, key) {
  return !!(
    this.hasLocale(locale) &&
    this.container[locale].attributes &&
    this.container[locale].attributes[key]
  )
};

Dictionary.prototype.merge = function merge$1 (dictionary) {
  merge(this.container, dictionary);
};

Dictionary.prototype.setMessage = function setMessage (locale, key, message) {
  if (!this.hasLocale(locale)) {
    this.container[locale] = {
      messages: {},
      attributes: {},
    };
  }

  this.container[locale].messages[key] = message;
};

Dictionary.prototype.setAttribute = function setAttribute (locale, key, attribute) {
  if (!this.hasLocale(locale)) {
    this.container[locale] = {
      messages: {},
      attributes: {},
    };
  }

  this.container[locale].attributes[key] = attribute;
};

Object.defineProperties( Dictionary.prototype, prototypeAccessors );

var drivers = {
  default: new Dictionary({
    en: {
      messages: {},
      attributes: {},
      custom: {},
    },
  }),
};

var currentDriver = 'default';

var DictionaryResolver = function DictionaryResolver () {};

DictionaryResolver._checkDriverName = function _checkDriverName (driver) {
  if (!driver) {
    throw createError('you must provide a name to the dictionary driver')
  }
};

DictionaryResolver.setDriver = function setDriver (driver, implementation) {
    if ( implementation === void 0 ) implementation = null;

  this._checkDriverName(driver);
  if (implementation) {
    drivers[driver] = implementation;
  }

  currentDriver = driver;
};

DictionaryResolver.getDriver = function getDriver () {
  return drivers[currentDriver]
};

// 

var ErrorBag = function ErrorBag (errorBag) {
  if ( errorBag === void 0 ) errorBag = null;

  // make this bag a mirror of the provided one, sharing the same items reference.
  if (errorBag && errorBag instanceof ErrorBag) {
    this.items = errorBag.items;
  } else {
    this.items = [];
  }
};

ErrorBag.prototype[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator'] = function () {
    var this$1 = this;

  var index = 0;
  return {
    next: function () {
      return { value: this$1.items[index++], done: index > this$1.items.length }
    },
  }
};

/**
 * Adds an error to the internal array.
 */
ErrorBag.prototype.add = function add (error) {
    var ref;

  (ref = this.items).push.apply(
    ref, this._normalizeError(error)
  );
};

/**
 * Normalizes passed errors to an error array.
 */
ErrorBag.prototype._normalizeError = function _normalizeError (error) {
  if (Array.isArray(error)) {
    return error.map(function (e) {
      e.scope = !isNullOrUndefined(e.scope) ? e.scope : null;

      return e
    })
  }

  error.scope = !isNullOrUndefined(error.scope) ? error.scope : null;

  return [error]
};

/**
 * Regenrates error messages if they have a generator function.
 */
ErrorBag.prototype.regenerate = function regenerate () {
  this.items.forEach(function (i) {
    i.msg = isCallable(i.regenerate) ? i.regenerate() : i.msg;
  });
};

/**
 * Updates a field error with the new field scope.
 */
ErrorBag.prototype.update = function update (id, error) {
  var item = find(this.items, function (i) { return i.id === id; });
  if (!item) {
    return
  }

  var idx = this.items.indexOf(item);
  this.items.splice(idx, 1);
  item.scope = error.scope;
  this.items.push(item);
};

/**
 * Gets all error messages from the internal array.
 */
ErrorBag.prototype.all = function all (scope) {
  var filterFn = function (item) {
    var matchesScope = true;
    if (!isNullOrUndefined(scope)) {
      matchesScope = item.scope === scope;
    }
    return matchesScope
  };
  return this.items.filter(filterFn).map(function (e) { return e.msg; })
};

/**
 * Checks if there are any errors in the internal array.
 */
ErrorBag.prototype.any = function any (scope) {
  var filterFn = function (item) {
    var matchesScope = true;
    if (!isNullOrUndefined(scope)) {
      matchesScope = item.scope === scope;
    }
    return matchesScope
  };

  return !!this.items.filter(filterFn).length
};

/**
 * Removes all items from the internal array.
 */
ErrorBag.prototype.clear = function clear (scope) {
  if (isNullOrUndefined(scope)) {
    scope = null;
  }

  for (var i = 0; i < this.items.length; ++i) {
    if (this.items[i].scope === scope) {
      this.items.splice(i, 1);
      --i;
    }
  }
};

/**
 * Collects errors into groups or for a specific field.
 */
ErrorBag.prototype.collect = function collect (field, scope, map) {
    if ( map === void 0 ) map = true;

  var isSingleField = !isNullOrUndefined(field) && !field.includes('*');
  var groupErrors = function (items) {
    var errors = items.reduce(function (collection, error) {
      if (!collection[error.field]) {
        collection[error.field] = [];
      }

      collection[error.field].push(map ? error.msg : error);

      return collection
    }, {});

    // reduce the collection to be a single array.
    if (isSingleField) {
      return values(errors)[0] || []
    }

    return errors
  };

  if (isNullOrUndefined(field)) {
    return groupErrors(this.items)
  }

  var selector = isNullOrUndefined(scope) ? String(field) : (scope + "." + field);
  var ref = this._makeCandidateFilters(selector);
    var isPrimary = ref.isPrimary;
    var isAlt = ref.isAlt;

  var collected = this.items.reduce(function (prev, curr) {
    if (isPrimary(curr)) {
      prev.primary.push(curr);
    }

    if (isAlt(curr)) {
      prev.alt.push(curr);
    }

    return prev
  }, { primary: [], alt: [] });

  collected = collected.primary.length ? collected.primary : collected.alt;

  return groupErrors(collected)
};

/**
 * Gets the internal array length.
 */
ErrorBag.prototype.count = function count () {
  return this.items.length
};

/**
 * Finds and fetches the first error message for the specified field id.
 */
ErrorBag.prototype.firstById = function firstById (id) {
  var error = find(this.items, function (i) { return i.id === id; });

  return error ? error.msg : undefined
};

/**
 * Gets the first error message for a specific field.
 */
ErrorBag.prototype.first = function first (field, scope) {
    if ( scope === void 0 ) scope = null;

  var selector = isNullOrUndefined(scope) ? field : (scope + "." + field);
  var match = this._match(selector);

  return match && match.msg
};

/**
 * Returns the first error rule for the specified field
 */
ErrorBag.prototype.firstRule = function firstRule (field, scope) {
  var errors = this.collect(field, scope, false);

  return (errors.length && errors[0].rule) || undefined
};

/**
 * Checks if the internal array has at least one error for the specified field.
 */
ErrorBag.prototype.has = function has (field, scope) {
    if ( scope === void 0 ) scope = null;

  return !!this.first(field, scope)
};

/**
 * Gets the first error message for a specific field and a rule.
 */
ErrorBag.prototype.firstByRule = function firstByRule (name, rule, scope) {
    if ( scope === void 0 ) scope = null;

  var error = this.collect(name, scope, false).filter(function (e) { return e.rule === rule; })[0];

  return (error && error.msg) || undefined
};

/**
 * Gets the first error message for a specific field that not match the rule.
 */
ErrorBag.prototype.firstNot = function firstNot (name, rule, scope) {
    if ( rule === void 0 ) rule = 'required';
    if ( scope === void 0 ) scope = null;

  var error = this.collect(name, scope, false).filter(function (e) { return e.rule !== rule; })[0];

  return (error && error.msg) || undefined
};

/**
 * Removes errors by matching against the id or ids.
 */
ErrorBag.prototype.removeById = function removeById (id) {
  var condition = function (item) { return item.id === id; };
  if (Array.isArray(id)) {
    condition = function (item) { return id.indexOf(item.id) !== -1; };
  }

  for (var i = 0; i < this.items.length; ++i) {
    if (condition(this.items[i])) {
      this.items.splice(i, 1);
      --i;
    }
  }
};

/**
 * Removes all error messages associated with a specific field.
 */
ErrorBag.prototype.remove = function remove (field, scope) {
  if (isNullOrUndefined(field)) {
    return
  }

  var selector = isNullOrUndefined(scope) ? String(field) : (scope + "." + field);
  var ref = this._makeCandidateFilters(selector);
    var isPrimary = ref.isPrimary;
    var isAlt = ref.isAlt;
  var matches = function (item) { return isPrimary(item) || isAlt(item); };
  var shouldRemove = function (item) {
    return matches(item)
  };

  for (var i = 0; i < this.items.length; ++i) {
    if (shouldRemove(this.items[i])) {
      this.items.splice(i, 1);
      --i;
    }
  }
};

ErrorBag.prototype._makeCandidateFilters = function _makeCandidateFilters (selector) {
  var matchesRule = function () { return true; };
  var matchesScope = function () { return true; };
  var matchesName = function () { return true; };

  var ref = parseSelector(selector);
    var id = ref.id;
    var rule = ref.rule;
    var scope = ref.scope;
    var name = ref.name;

  if (rule) {
    matchesRule = function (item) { return item.rule === rule; };
  }

  // match by id, can be combined with rule selection.
  if (id) {
    return {
      isPrimary: function (item) { return matchesRule(item) && (function (item) { return id === item.id; }); },
      isAlt: function () { return false; },
    }
  }

  if (isNullOrUndefined(scope)) {
    // if no scope specified, make sure the found error has no scope.
    matchesScope = function (item) { return isNullOrUndefined(item.scope); };
  } else {
    matchesScope = function (item) { return item.scope === scope; };
  }

  if (!isNullOrUndefined(name) && name !== '*') {
    matchesName = function (item) { return item.field === name; };
  }

  // matches the first candidate.
  var isPrimary = function (item) {
    return matchesName(item) && matchesRule(item) && matchesScope(item)
  };

  // matches a second candidate, which is a field with a name containing the '.' character.
  var isAlt = function (item) {
    return matchesRule(item) && item.field === (scope + "." + name)
  };

  return {
    isPrimary: isPrimary,
    isAlt: isAlt,
  }
};

ErrorBag.prototype._match = function _match (selector) {
  if (isNullOrUndefined(selector)) {
    return undefined
  }

  var ref = this._makeCandidateFilters(selector);
    var isPrimary = ref.isPrimary;
    var isAlt = ref.isAlt;

  return this.items.reduce(function (prev, item, idx, arr) {
    var isLast = idx === arr.length - 1;
    if (prev.primary) {
      return isLast ? prev.primary : prev
    }

    if (isPrimary(item)) {
      prev.primary = item;
    }

    if (isAlt(item)) {
      prev.alt = item;
    }

    // keep going.
    if (!isLast) {
      return prev
    }

    return prev.primary || prev.alt
  }, {})
};

// 
var RULES = {};

var RuleContainer = function RuleContainer () {};

var staticAccessors = { rules: { configurable: true } };

RuleContainer.add = function add (name, ref) {
    var validate = ref.validate;
    var options = ref.options;
    var paramNames = ref.paramNames;

  RULES[name] = {
    validate: validate,
    options: options,
    paramNames: paramNames,
  };
};

staticAccessors.rules.get = function () {
  return RULES
};

RuleContainer.has = function has (name) {
  return !!RULES[name]
};

RuleContainer.isImmediate = function isImmediate (name) {
  return !!(RULES[name] && RULES[name].options.immediate)
};

RuleContainer.isRequireRule = function isRequireRule (name) {
  return !!(RULES[name] && RULES[name].options.computesRequired)
};

RuleContainer.isTargetRule = function isTargetRule (name) {
  return !!(RULES[name] && RULES[name].options.hasTarget)
};

RuleContainer.remove = function remove (ruleName) {
  delete RULES[ruleName];
};

RuleContainer.getParamNames = function getParamNames (ruleName) {
  return RULES[ruleName] && RULES[ruleName].paramNames
};

RuleContainer.getOptions = function getOptions (ruleName) {
  return RULES[ruleName] && RULES[ruleName].options
};

RuleContainer.getValidatorMethod = function getValidatorMethod (ruleName) {
  return RULES[ruleName] ? RULES[ruleName].validate : null
};

Object.defineProperties( RuleContainer, staticAccessors );

// 

var normalizeEvents = function (evts) {
  if (!evts) { return [] }

  return (typeof evts === 'string' ? evts.split('|') : evts)
};

var supportsPassive = true;

var addEventListener = function (el, eventName, cb) {
  el.addEventListener(eventName, cb, supportsPassive ? { passive: true } : false);
};

// 

var DEFAULT_OPTIONS = {
  targetOf: null,
  immediate: false,
  scope: null,
  listen: true,
  name: null,
  rules: {},
  classes: false,
  validity: true,
  events: 'change|blur',
  delay: 0,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty', // control has been interacted with
  },
};

var Field = function Field (options) {
  if ( options === void 0 ) options = {};

  this.id = uniqId();
  this.updated = false;
  this.dependencies = [];
  this.events = [];
  this.delay = 0;
  this.rules = {};
  this.forceRequired = false;
  this.classNames = assign({}, DEFAULT_OPTIONS.classNames);
  options = assign({}, DEFAULT_OPTIONS, options);
  this._delay = !isNullOrUndefined(options.delay) ? options.delay : 0; // cache initial delay
  this.validity = options.validity;
  this.flags = createFlags();
  this.update(options);
  // set initial value.
  this.initialValue = this.value;
  this.updated = false;
};

var prototypeAccessors$1 = { validator: { configurable: true },isRequired: { configurable: true },isDisabled: { configurable: true },alias: { configurable: true },value: { configurable: true },bails: { configurable: true },rejectsFalse: { configurable: true } };

prototypeAccessors$1.validator.get = function () {
  return {
    validate: function () {
    },
  }
};

prototypeAccessors$1.isRequired.get = function () {
  return !!this.rules.required
};

prototypeAccessors$1.isDisabled.get = function () {
  return false
};

/**
 * Gets the display name (user-friendly name).
 */
prototypeAccessors$1.alias.get = function () {
  return this._alias
};

/**
 * Gets the input value.
 */

prototypeAccessors$1.value.get = function () {
  if (!isCallable(this.getter)) {
    return undefined
  }

  return this.getter()
};

prototypeAccessors$1.bails.get = function () {
  return this._bails
};

/**
 * If the field rejects false as a valid value for the required rule.
 */

prototypeAccessors$1.rejectsFalse.get = function () {
  return false
};

/**
 * Determines if the instance matches the options provided.
 */
Field.prototype.matches = function matches (options) {
  if (!options) {
    return true
  }

  if (options.id) {
    return this.id === options.id
  }

  if (options.name === undefined && options.scope === undefined) {
    return true
  }

  if (options.scope === undefined) {
    return this.name === options.name
  }

  if (options.name === undefined) {
    return this.scope === options.scope
  }

  return options.name === this.name && options.scope === this.scope
};

/**
 * Keeps a reference of the most current validation run.
 */
Field.prototype.waitFor = function waitFor (pendingPromise) {
  this._waitingFor = pendingPromise;
};

Field.prototype.isWaitingFor = function isWaitingFor (promise) {
  return this._waitingFor === promise
};

/**
 * Updates the field with changed data.
 */
Field.prototype.update = function update (options) {
  this.targetOf = options.targetOf || null;
  this.immediate = options.immediate || this.immediate || false;
  this.persist = options.persist || this.persist || false;

  // update errors scope if the field scope was changed.
  if (!isNullOrUndefined(options.scope) && options.scope !== this.scope && isCallable(this.validator.update)) {
    this.validator.update(this.id, { scope: options.scope });
  }
  this.scope = !isNullOrUndefined(options.scope) ? options.scope
    : !isNullOrUndefined(this.scope) ? this.scope : null;
  this.name = (!isNullOrUndefined(options.name) ? String(options.name) : options.name) || this.name || null;
  this.rules = options.rules !== undefined ? normalizeRules(options.rules) : this.rules;
  this._bails = options.bails !== undefined ? options.bails : this._bails;
  this.listen = options.listen !== undefined ? options.listen : this.listen;
  this.classes = (options.classes || this.classes || false) && !this.componentInstance;
  this.classNames = isObject(options.classNames) ? merge(this.classNames, options.classNames) : this.classNames;
  this.getter = isCallable(options.getter) ? options.getter : this.getter;
  this._alias = options.alias || this._alias;
  this.events = (options.events) ? normalizeEvents(options.events) : this.events;
  this.delay = makeDelayObject(this.events, options.delay || this.delay, this._delay);
  this.updateDependencies();
  this.addActionListeners();

  if (process.env.NODE_ENV !== 'production' && !this.name && !this.targetOf) {
    warn('A field is missing a "name"');
  }

  // update required flag flags
  if (options.rules !== undefined) {
    this.flags.required = this.isRequired;
  }

  // validate if it was validated before and field was updated and there was a rules mutation.
  if (this.flags.validated && options.rules !== undefined && this.updated) {
    this.validator.validate(("#" + (this.id)));
  }

  this.updated = true;

  // no need to continue.
  this.updateClasses();
};

/**
 * Resets field flags and errors.
 */
Field.prototype.reset = function reset () {
    var this$1 = this;

  if (this._cancellationToken) {
    this._cancellationToken.cancelled = true;
    delete this._cancellationToken;
  }

  var defaults = createFlags();
  Object.keys(this.flags).filter(function (flag) { return flag !== 'required'; }).forEach(function (flag) {
    this$1.flags[flag] = defaults[flag];
  });

  this.addActionListeners();
  this.updateClasses();
};

/**
 * Sets the flags and their negated counterparts, and updates the classes and re-adds action listeners.
 */
Field.prototype.setFlags = function setFlags (flags) {
    var this$1 = this;

  var negated = {
    pristine: 'dirty',
    dirty: 'pristine',
    valid: 'invalid',
    invalid: 'valid',
    touched: 'untouched',
    untouched: 'touched',
  };

  Object.keys(flags).forEach(function (flag) {
    this$1.flags[flag] = flags[flag];
    // if it has a negation and was not specified, set it as well.
    if (negated[flag] && flags[negated[flag]] === undefined) {
      this$1.flags[negated[flag]] = !flags[flag];
    }
  });

  if (
    flags.untouched !== undefined ||
    flags.touched !== undefined ||
    flags.dirty !== undefined ||
    flags.pristine !== undefined
  ) {
    this.addActionListeners();
  }
  this.updateClasses();
};

/**
 * Determines if the field requires references to target fields.
 */
Field.prototype.updateDependencies = function updateDependencies () {
    var this$1 = this;

  // reset dependencies.
  this.dependencies.forEach(function (d) { return d.field.destroy(); });
  this.dependencies = [];

  // we get the selectors for each field.
  var fields = Object.keys(this.rules).reduce(function (prev, r) {
    if (RuleContainer.isTargetRule(r)) {
      prev.push({ selector: this$1.rules[r][0], name: r });
    }

    return prev
  }, []);

  if (!fields.length) { return }

  fields.forEach(function (ref) {
      var selector = ref.selector;
      var name = ref.name;

    var options = {
      classes: this$1.classes,
      classNames: this$1.classNames,
      delay: this$1.delay,
      scope: this$1.scope,
      events: this$1.events.join('|'),
      immediate: this$1.immediate,
      targetOf: this$1.id,
    };

    this$1.dependencies.push({ name: name, field: new Field(options) });
  });
};

/**
 * Updates the element classes depending on each field flag status.
 */
Field.prototype.updateClasses = function updateClasses () {
    var this$1 = this;

  if (!this.classes || this.isDisabled) { return }
  var applyClasses = function (el) {
    toggleClass(el, this$1.classNames.dirty, this$1.flags.dirty);
    toggleClass(el, this$1.classNames.pristine, this$1.flags.pristine);
    toggleClass(el, this$1.classNames.touched, this$1.flags.touched);
    toggleClass(el, this$1.classNames.untouched, this$1.flags.untouched);
    // make sure we don't set any classes if the state is undetermined.
    if (!isNullOrUndefined(this$1.flags.valid) && this$1.flags.validated) {
      toggleClass(el, this$1.classNames.valid, this$1.flags.valid);
    }

    if (!isNullOrUndefined(this$1.flags.invalid) && this$1.flags.validated) {
      toggleClass(el, this$1.classNames.invalid, this$1.flags.invalid);
    }
  };

  if (!isCheckboxOrRadioInput(this.el)) {
    applyClasses(this.el);
  }
};

/**
 * Adds the listeners required for automatic classes and some flags.
 */
Field.prototype.addActionListeners = function addActionListeners () {
    var this$1 = this;

  if (!this.el) { return }

  var onBlur = function () {
    this$1.flags.touched = true;
    this$1.flags.untouched = false;
    if (this$1.classes) {
      toggleClass(this$1.el, this$1.classNames.touched, true);
      toggleClass(this$1.el, this$1.classNames.untouched, false);
    }
  };

  // const inputEvent = isTextInput(this.el) ? 'input' : 'change'
  var inputEvent = 'change';
  var onInput = function () {
    this$1.flags.dirty = true;
    this$1.flags.pristine = false;
    if (this$1.classes) {
      toggleClass(this$1.el, this$1.classNames.pristine, false);
      toggleClass(this$1.el, this$1.classNames.dirty, true);
    }
  };

  if (!this.el) { return }

  addEventListener(this.el, inputEvent, onInput);
  // Checkboxes and radio buttons on Mac don't emit blur naturally, so we listen on click instead.
  var blurEvent = isCheckboxOrRadioInput(this.el) ? 'change' : 'blur';
  addEventListener(this.el, blurEvent, onBlur);
};

Field.prototype.checkValueChanged = function checkValueChanged () {
  // handle some people initialize the value to null, since text inputs have empty string value.
  if (this.initialValue === null && this.value === '' && isTextInput(this.el)) {
    return false
  }

  return this.value !== this.initialValue
};

/**
 * Determines the suitable primary event to listen for.
 */
Field.prototype._determineInputEvent = function _determineInputEvent () {
  return 'change'
};

/**
 * Determines the list of events to listen to.
 */
Field.prototype._determineEventList = function _determineEventList (defaultInputEvent) {
  // if no event is configured, or it is a component or a text input then respect the user choice.
  if (!this.events.length) {
    return [].concat( this.events ).map(function (evt) {
      if (evt === 'input') {
        return 'change'
      }

      return evt
    })
  }

  // force suitable event for non-text type fields.
  return this.events.map(function (e) {
    if (e === 'input') {
      return defaultInputEvent
    }

    return e
  })
};

/**
 * Removes all listeners.
 */
Field.prototype.destroy = function destroy () {
  // ignore the result of any ongoing validation.
  if (this._cancellationToken) {
    this._cancellationToken.cancelled = true;
  }

  this.dependencies.forEach(function (d) { return d.field.destroy(); });
  this.dependencies = [];
};

Object.defineProperties( Field.prototype, prototypeAccessors$1 );

// 

var FieldBag = function FieldBag (items) {
  if ( items === void 0 ) items = [];

  this.items = items || [];
};

var prototypeAccessors$2 = { length: { configurable: true } };

FieldBag.prototype[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator'] = function () {
    var this$1 = this;

  var index = 0;
  return {
    next: function () {
      return { value: this$1.items[index++], done: index > this$1.items.length }
    },
  }
};

/**
 * Gets the current items length.
 */

prototypeAccessors$2.length.get = function () {
  return this.items.length
};

/**
 * Finds the first field that matches the provided matcher object.
 */
FieldBag.prototype.find = function find$1 (matcher) {
  return find(this.items, function (item) { return item.matches(matcher); })
};

/**
 * Filters the items down to the matched fields.
 */
FieldBag.prototype.filter = function filter (matcher) {
  // multiple matchers to be tried.
  if (Array.isArray(matcher)) {
    return this.items.filter(function (item) { return matcher.some(function (m) { return item.matches(m); }); })
  }

  return this.items.filter(function (item) { return item.matches(matcher); })
};

/**
 * Maps the field items using the mapping function.
 */
FieldBag.prototype.map = function map (mapper) {
  return this.items.map(mapper)
};

/**
 * Finds and removes the first field that matches the provided matcher object, returns the removed item.
 */
FieldBag.prototype.remove = function remove (matcher) {
  var item = null;
  if (matcher instanceof Field) {
    item = matcher;
  } else {
    item = this.find(matcher);
  }

  if (!item) { return null }

  var index = this.items.indexOf(item);
  this.items.splice(index, 1);

  return item
};

/**
 * Adds a field item to the list.
 */
FieldBag.prototype.push = function push (item) {
  if (!(item instanceof Field)) {
    throw createError('FieldBag only accepts instances of Field that has an id defined.')
  }

  if (!item.id) {
    throw createError('Field id must be defined.')
  }

  if (this.find({ id: item.id })) {
    throw createError(("Field with id " + (item.id) + " is already added."))
  }

  this.items.push(item);
};

Object.defineProperties( FieldBag.prototype, prototypeAccessors$2 );

// 

var Validator = function Validator (validations, options) {
  if ( options === void 0 ) options = { fastExit: true };

  this.errors = new ErrorBag();
  this.fields = new FieldBag();
  this._createFields(validations);
  this.paused = false;
  this.fastExit = !isNullOrUndefined(options && options.fastExit) ? options.fastExit : true;
};

var prototypeAccessors$3 = { dictionary: { configurable: true },flags: { configurable: true },locale: { configurable: true } };
var staticAccessors$1 = { dictionary: { configurable: true },locale: { configurable: true } };

staticAccessors$1.dictionary.get = function () {
  return DictionaryResolver.getDriver()
};

prototypeAccessors$3.dictionary.get = function () {
  return DictionaryResolver.getDriver()
};

prototypeAccessors$3.flags.get = function () {
  return this.fields.items.reduce(function (acc, field) {
      var obj;

    if (field.scope) {
      acc[("$" + (field.scope))] = ( obj = {}, obj[field.name] = field.flags, obj );

      return acc
    }

    acc[field.name] = field.flags;

    return acc
  }, {})
};

/**
 * Getter for the current locale.
 */
prototypeAccessors$3.locale.get = function () {
  return Validator.locale
};

/**
 * Setter for the validator locale.
 */
prototypeAccessors$3.locale.set = function (value) {
  Validator.locale = value;
};

staticAccessors$1.locale.get = function () {
  return DictionaryResolver.getDriver().locale
};

/**
 * Setter for the validator locale.
 */
staticAccessors$1.locale.set = function (value) {
  DictionaryResolver.getDriver().locale = value;
};

/**
 * Adds a custom validator to the list of validation rules.
 */
Validator.extend = function extend (name, validator, options) {
    if ( options === void 0 ) options = {};

  Validator._guardExtend(name, validator);
  Validator._merge(name, {
    validator: validator,
    paramNames: options && options.paramNames,
    options: assign({}, { hasTarget: false, immediate: true }, options || {}),
  });
};

/**
 * Checks if the given rule name is a rule that targets other fields.
 */
Validator.isTargetRule = function isTargetRule (name) {
  return RuleContainer.isTargetRule(name)
};

/**
 * Adds and sets the current locale for the validator.
 */
Validator.prototype.localize = function localize (lang, dictionary) {
  Validator.localize(lang, dictionary);
};

/**
 * Adds and sets the current locale for the validator.
 */
Validator.localize = function localize (lang, dictionary) {
    var obj;

  if (isObject(lang)) {
    DictionaryResolver.getDriver().merge(lang);
    return
  }

  // merge the dictionary.
  if (dictionary) {
    var locale = lang || dictionary.name;
    dictionary = assign({}, dictionary);
    DictionaryResolver.getDriver().merge(( obj = {}, obj[locale] = dictionary, obj ));
  }

  if (lang) {
    // set the locale.
    Validator.locale = lang;
  }
};

/**
 * Registers a field to be validated.
 */
Validator.prototype.attach = function attach (fieldOpts) {
  // We search for a field with the same name & scope, having persist enabled
  var oldFieldMatcher = { name: fieldOpts.name, scope: fieldOpts.scope, persist: true };
  var oldField = fieldOpts.persist ? this.fields.find(oldFieldMatcher) : null;

  if (oldField) {
    // We keep the flags of the old field, then we remove its instance
    fieldOpts.flags = oldField.flags;
    oldField.destroy();
    this.fields.remove(oldField);
  }

  // fixes initial value detection with v-model and select elements.
  var value = fieldOpts.initialValue;
  var field = new Field(fieldOpts);
  this.fields.push(field);

  // validate the field initially
  if (field.immediate) {
    this.validate(("#" + (field.id)), value || field.value);
  } else {
    this._validate(field, value || field.value, { initial: true }).then(function (result) {
      field.flags.valid = result.valid;
      field.flags.invalid = !result.valid;
    });
  }

  return field
};

/**
 * Sets the flags on a field.
 */
Validator.prototype.flag = function flag (name, flags, uid) {
    if ( uid === void 0 ) uid = null;

  var field = this._resolveField(name, undefined, uid);
  if (!field || !flags) {
    return
  }

  field.setFlags(flags);
};

/**
 * Removes a field from the validator.
 */
Validator.prototype.detach = function detach (name, scope, uid) {
  var field = isCallable(name.destroy) ? name : this._resolveField(name, scope, uid);
  if (!field) { return }

  // We destroy/remove the field & error instances if it's not a `persist` one
  if (!field.persist) {
    field.destroy();
    this.errors.remove(field.name, field.scope, field.vmId);
    this.fields.remove(field);
  }
};

/**
 * Adds a custom validator to the list of validation rules.
 */
Validator.prototype.extend = function extend (name, validator, options) {
    if ( options === void 0 ) options = {};

  Validator.extend(name, validator, options);
};

Validator.prototype.reset = function reset (matcher) {
    var this$1 = this;

  // two ticks
  this.fields.filter(matcher).forEach(function (field) {
    field.waitFor(null);
    field.reset(); // reset field flags.
    this$1.errors.remove(field.name, field.scope);
  });
};

/**
 * Updates a field, updating both errors and flags.
 */
Validator.prototype.update = function update (id, ref) {
    var scope = ref.scope;

  var field = this._resolveField(("#" + id));
  if (!field) { return }

  // remove old scope.
  this.errors.update(id, { scope: scope });
};

/**
 * Validates a value against a registered field validations.
 */
Validator.prototype.validate = function validate (fieldDescriptor, value, ref) {
    var this$1 = this;
    if ( ref === void 0 ) ref = {};
    var silent = ref.silent;
    var scope = ref.scope;

  if (this.paused) { return Promise.resolve(true) }

  // overload to validate all.
  if (isNullOrUndefined(fieldDescriptor)) {
    return this.validateScopes({ silent: silent, scope: scope })
  }

  // overload to validate scope-less fields.
  if (fieldDescriptor === '*') {
    return this.validateAll(undefined, { silent: silent })
  }

  // if scope validation was requested.
  if (/^(.+)\.\*$/.test(fieldDescriptor)) {
    var matched = fieldDescriptor.match(/^(.+)\.\*$/)[1];
    return this.validateAll(matched)
  }

  var field = this._resolveField(fieldDescriptor);
  if (!field) {
    return this._handleFieldNotFound('unknown')
  }

  if (!silent) { field.flags.pending = true; }
  if (value === undefined) {
    value = field.value;
  }

  var validationPromise = this._validate(field, value);
  field.waitFor(validationPromise);

  return validationPromise.then(function (result) {
    if (!silent && field.isWaitingFor(validationPromise)) {
      // allow next validation to mutate the state.
      field.waitFor(null);
      this$1._handleValidationResults([result], scope);
    }

    return result.valid
  })
};

/**
 * Pauses the validator.
 */
Validator.prototype.pause = function pause () {
  this.paused = true;

  return this
};

/**
 * Resumes the validator.
 */
Validator.prototype.resume = function resume () {
  this.paused = false;

  return this
};

/**
 * Validates each value against the corresponding field validations.
 */
Validator.prototype.validateAll = function validateAll (values, ref) {
    var this$1 = this;
    if ( ref === void 0 ) ref = {};
    var silent = ref.silent;
    var scope = ref.scope;

  if (this.paused) { return Promise.resolve(true) }

  var matcher = null;
  var providedValues = false;

  if (typeof values === 'string') {
    matcher = { scope: values };
  } else if (isObject(values)) {
    matcher = Object.keys(values).map(function (key) {
      return { name: key, scope: scope }
    });
    providedValues = true;
  } else if (Array.isArray(values)) {
    matcher = values.map(function (key) {
      return { name: key, scope: scope }
    });
  } else {
    matcher = { scope: null };
  }

  return Promise.all(
    this.fields.filter(matcher).map(function (field) { return this$1._validate(field, providedValues ? values[field.name] : field.value); })
  ).then(function (results) {
    if (!silent) {
      this$1._handleValidationResults(results);
    }

    return results.every(function (t) { return t.valid; })
  })
};

/**
 * Validates all scopes.
 */
Validator.prototype.validateScopes = function validateScopes (ref) {
    var this$1 = this;
    if ( ref === void 0 ) ref = {};
    var silent = ref.silent;
    var scope = ref.scope;

  if (this.paused) { return Promise.resolve(true) }

  return Promise.all(
    this.fields.filter({ scope: scope }).map(function (field) { return this$1._validate(field, field.value); })
  ).then(function (results) {
    if (!silent) {
      this$1._handleValidationResults(results, scope);
    }

    return results.every(function (t) { return t.valid; })
  })
};

/**
 * Validates a value against the rules.
 */
Validator.prototype.verify = function verify (value, rules, options) {
    if ( options === void 0 ) options = {};

  var field = {
    name: (options && options.name) || '{field}',
    rules: normalizeRules(rules),
    bails: getPath('bails', options, true),
  };

  field.isRequired = field.rules.required;
  var targetRules = Object.keys(field.rules).filter(Validator.isTargetRule);
  if (targetRules.length && options && isObject(options.values)) {
    // patch the field params with the targets' values.
    targetRules.forEach(function (rule) {
      var ref = field.rules[rule];
        var first = ref[0];
        var rest = ref.slice(1);
      field.rules[rule] = [options.values[first] ].concat( rest);
    });
  }

  return this._validate(field, value).then(function (result) {
    return { valid: result.valid, errors: result.errors.map(function (e) { return e.msg; }) }
  })
};

/**
 * Perform cleanup.
 */
Validator.prototype.destroy = function destroy () {
  // ReeValidate.instance._vm.$off('localeChanged')
};

/**
 * Creates the fields to be validated.
 */
Validator.prototype._createFields = function _createFields (validations) {
    var this$1 = this;

  if (!validations) { return }

  Object.keys(validations).forEach(function (field) {
    var options = assign({}, { name: field, rules: validations[field] });
    this$1.attach(options);
  });
};

/**
 * Date rules need the existence of a format, so date_format must be supplied.
 */
Validator.prototype._getDateFormat = function _getDateFormat (validations) {
  var format = null;
  if (validations.date_format && Array.isArray(validations.date_format)) {
    format = validations.date_format[0];
  }

  return format || DictionaryResolver.getDriver().getDateFormat(this.locale)
};

/**
 * Formats an error message for field and a rule.
 */
Validator.prototype._formatErrorMessage = function _formatErrorMessage (field, rule, data, targetName) {
    if ( data === void 0 ) data = {};
    if ( targetName === void 0 ) targetName = null;

  var name = this._getFieldDisplayName(field);
  var params = this._getLocalizedParams(rule, targetName);

  return DictionaryResolver.getDriver().getFieldMessage(this.locale, field.name, rule.name, [name, params, data])
};

/**
 * We need to convert any object param to an array format since the locales do not handle params as objects yet.
 */
Validator.prototype._convertParamObjectToArray = function _convertParamObjectToArray (obj, ruleName) {
  if (Array.isArray(obj)) {
    return obj
  }

  var paramNames = RuleContainer.getParamNames(ruleName);
  if (!paramNames || !isObject(obj)) {
    return obj
  }

  return paramNames.reduce(function (prev, paramName) {
    if (paramName in obj) {
      prev.push(obj[paramName]);
    }

    return prev
  }, [])
};

/**
 * Translates the parameters passed to the rule (mainly for target fields).
 */
Validator.prototype._getLocalizedParams = function _getLocalizedParams (rule, targetName) {
    if ( targetName === void 0 ) targetName = null;

  var params = this._convertParamObjectToArray(rule.params, rule.name);
  if (rule.options.hasTarget && params && params[0]) {
    var localizedName = targetName || DictionaryResolver.getDriver().getAttribute(this.locale, params[0], params[0]);
    return [localizedName].concat(params.slice(1))
  }

  return params
};

/**
 * Resolves an appropriate display name, first checking 'data-as' or the registered 'prettyName'
 */
Validator.prototype._getFieldDisplayName = function _getFieldDisplayName (field) {
  return field.alias || DictionaryResolver.getDriver().getAttribute(this.locale, field.name, field.name)
};

/**
 * Converts an array of params to an object with named properties.
 * Only works if the rule is configured with a paramNames array.
 * Returns the same params if it cannot convert it.
 */
Validator.prototype._convertParamArrayToObj = function _convertParamArrayToObj (params, ruleName) {
  var paramNames = RuleContainer.getParamNames(ruleName);
  if (!paramNames) {
    return params
  }

  if (isObject(params)) {
    // check if the object is either a config object or a single parameter that is an object.
    var hasKeys = paramNames.some(function (name) { return Object.keys(params).indexOf(name) !== -1; });
    // if it has some of the keys, return it as is.
    if (hasKeys) {
      return params
    }
    // otherwise wrap the object in an array.
    params = [params];
  }

  // Reduce the paramsNames to a param object.
  return params.reduce(function (prev, value, idx) {
    prev[paramNames[idx]] = value;

    return prev
  }, {})
};

/**
 * Tests a single input value against a rule.
 */
Validator.prototype._test = function _test (field, value, rule) {
    var this$1 = this;

  var validator = RuleContainer.getValidatorMethod(rule.name);
  var params = Array.isArray(rule.params) ? toArray(rule.params) : rule.params;
  if (!params) {
    params = [];
  }

  var targetName = null;
  if (!validator || typeof validator !== 'function') {
    return Promise.reject(createError(("No such validator '" + (rule.name) + "' exists.")))
  }

  // has field dependencies.
  if (rule.options.hasTarget && field.dependencies) {
    var target = find(field.dependencies, function (d) { return d.name === rule.name; });
    if (target) {
      targetName = target.field.alias;
      params = [target.field.value].concat(params.slice(1));
    }
  } else if (rule.name === 'required' && field.rejectsFalse) {
    // invalidate false if no args were specified and the field rejects false by default.
    params = params.length ? params : [true];
  }

  if (rule.options.isDate) {
    var dateFormat = this._getDateFormat(field.rules);
    if (rule.name !== 'date_format') {
      params.push(dateFormat);
    }
  }

  var result = validator(value, this._convertParamArrayToObj(params, rule.name));

  // If it is a promise.
  if (isCallable(result.then)) {
    return result.then(function (values) {
      var allValid = true;
      var data = {};
      if (Array.isArray(values)) {
        allValid = values.every(function (t) { return (isObject(t) ? t.valid : t); });
      } else { // Is a single object/boolean.
        allValid = isObject(values) ? values.valid : values;
        data = values.data;
      }

      return {
        valid: allValid,
        errors: allValid ? [] : [this$1._createFieldError(field, rule, data, targetName)],
      }
    })
  }

  if (!isObject(result)) {
    result = { valid: result, data: {} };
  }

  return {
    valid: result.valid,
    errors: result.valid ? [] : [this._createFieldError(field, rule, result.data, targetName)],
  }
};

/**
 * Merges a validator object into the RULES and Messages.
 */
Validator._merge = function _merge (name, ref) {
    var validator = ref.validator;
    var options = ref.options;
    var paramNames = ref.paramNames;

  var validate = isCallable(validator) ? validator : validator.validate;
  if (validator.getMessage) {
    DictionaryResolver.getDriver().setMessage(Validator.locale, name, validator.getMessage);
  }

  RuleContainer.add(name, {
    validate: validate,
    options: options,
    paramNames: paramNames,
  });
};

/**
 * Guards from extension violations.
 */
Validator._guardExtend = function _guardExtend (name, validator) {
  if (isCallable(validator)) {
    return
  }

  if (!isCallable(validator.validate)) {
    throw createError(
      ("Extension Error: The validator '" + name + "' must be a function or have a 'validate' method.")
    )
  }
};

/**
 * Creates a Field Error Object.
 */
Validator.prototype._createFieldError = function _createFieldError (field, rule, data, targetName) {
    var this$1 = this;

  return {
    id: field.id,
    field: field.name,
    msg: this._formatErrorMessage(field, rule, data, targetName),
    rule: rule.name,
    scope: field.scope,
    regenerate: function () {
      return this$1._formatErrorMessage(field, rule, data, targetName)
    },
  }
};

/**
 * Tries different strategies to find a field.
 */
Validator.prototype._resolveField = function _resolveField (name, scope, uid) {
  if (name[0] === '#') {
    return this.fields.find({ id: name.slice(1) })
  }

  if (!isNullOrUndefined(scope)) {
    return this.fields.find({ name: name, scope: scope })
  }

  if (includes(name, '.')) {
    var ref = name.split('.');
      var fieldScope = ref[0];
      var fieldName = ref.slice(1);
    var field = this.fields.find({ name: fieldName.join('.'), scope: fieldScope });
    if (field) {
      return field
    }
  }

  return this.fields.find({ name: name, scope: null, vmId: uid })
};

/**
 * Handles when a field is not found.
 */
Validator.prototype._handleFieldNotFound = function _handleFieldNotFound (name, scope) {
  var fullName = isNullOrUndefined(scope) ? name : ("" + (!isNullOrUndefined(scope) ? scope + '.' : '') + name);

  return Promise.reject(createError(
    ("Validating a non-existent field: \"" + fullName + "\". Use \"attach()\" first.")
  ))
};

/**
 * Handles validation results.
 */
Validator.prototype._handleValidationResults = function _handleValidationResults (results) {
    var this$1 = this;

  var matchers = results.map(function (result) { return ({ id: result.id }); });
  this.errors.removeById(matchers.map(function (m) { return m.id; }));
  // remove by name and scope to remove any custom errors added.
  results.forEach(function (result) {
    this$1.errors.remove(result.field, result.scope);
  });
  var allErrors = results.reduce(function (prev, curr) {
    prev.push.apply(prev, curr.errors);

    return prev
  }, []);

  this.errors.add(allErrors);

  // handle flags.
  this.fields.filter(matchers).forEach(function (field) {
    var result = find(results, function (r) { return r.id === field.id; });
    field.setFlags({
      pending: false,
      valid: result.valid,
      validated: true,
    });
  });
};

Validator.prototype._shouldSkip = function _shouldSkip (field, value) {
  // field is configured to run through the pipeline regardless
  if (field.bails === false) {
    return false
  }

  // disabled fields are skipped
  if (field.isDisabled) {
    return true
  }

  // skip if the field is not required and has an empty value.
  return !field.isRequired && (isNullOrUndefined(value) || value === '' || isEmptyArray(value))
};

Validator.prototype._shouldBail = function _shouldBail (field) {
  // if the field was configured explicitly.
  if (field.bails !== undefined) {
    return field.bails
  }

  return this.fastExit
};

/**
 * Starts the validation process.
 */
Validator.prototype._validate = function _validate (field, value, ref) {
    var this$1 = this;
    if ( ref === void 0 ) ref = {};
    var initial = ref.initial;

  var requireRules = Object.keys(field.rules).filter(RuleContainer.isRequireRule);

  field.forceRequired = false;
  requireRules.forEach(function (rule) {
    var ruleOptions = RuleContainer.getOptions(rule);
    var result = this$1._test(field, value, { name: rule, params: field.rules[rule], options: ruleOptions });

    if (isCallable(result.then)) {
      throw createError('Require rules cannot be async')
    }
    if (!isObject(result)) {
      throw createError('Require rules has to return an object (see docs)')
    }

    if (result.data.required === true) {
      field.forceRequired = true;
    }
  });

  if (this._shouldSkip(field, value)) {
    return Promise.resolve({ valid: true, id: field.id, field: field.name, scope: field.scope, errors: [] })
  }

  var promises = [];
  var errors = [];
  var isExitEarly = false;

  if (isCallable(field.checkValueChanged)) {
    field.flags.changed = field.checkValueChanged();
  }
  // use of '.some()' is to break iteration in middle by returning true
  Object.keys(field.rules).filter(function (rule) {
    if (!initial || !RuleContainer.has(rule)) { return true }

    return RuleContainer.isImmediate(rule)
  }).some(function (rule) {
    var ruleOptions = RuleContainer.getOptions(rule);
    var result = this$1._test(field, value, { name: rule, params: field.rules[rule], options: ruleOptions });
    if (isCallable(result.then)) {
      promises.push(result);
    } else if (!result.valid && this$1._shouldBail(field)) {
      errors.push.apply(errors, result.errors);
      isExitEarly = true;
    } else {
      // promisify the result.
      promises.push(new Promise(function (resolve) { return resolve(result); }));
    }

    return isExitEarly
  });

  if (isExitEarly) {
    return Promise.resolve({ valid: false, errors: errors, id: field.id, field: field.name, scope: field.scope })
  }

  return Promise.all(promises).then(function (results) {
    return results.reduce(function (prev, v) {
        var ref;

      if (!v.valid) {
        (ref = prev.errors).push.apply(ref, v.errors);
      }

      prev.valid = prev.valid && v.valid;

      return prev
    }, { valid: true, errors: errors, id: field.id, field: field.name, scope: field.scope })
  })
};

Object.defineProperties( Validator.prototype, prototypeAccessors$3 );
Object.defineProperties( Validator, staticAccessors$1 );

// 

var normalizeValue = function (value) {
  if (isObject(value)) {
    return Object.keys(value).reduce(function (prev, key) {
      prev[key] = normalizeValue(value[key]);

      return prev
    }, {})
  }

  if (isCallable(value)) {
    return value('{0}', ['{1}', '{2}', '{3}'])
  }

  return value
};

var normalizeFormat = function (locale) {
  // normalize messages
  var dictionary = {};
  if (locale.messages) {
    dictionary.messages = normalizeValue(locale.messages);
  }

  if (locale.custom) {
    dictionary.custom = normalizeValue(locale.custom);
  }

  if (locale.attributes) {
    dictionary.attributes = locale.attributes;
  }

  if (!isNullOrUndefined(locale.dateFormat)) {
    dictionary.dateFormat = locale.dateFormat;
  }

  return dictionary
};

var I18nDictionary = function I18nDictionary (i18n, rootKey) {
  this.i18n = i18n;
  this.rootKey = rootKey;
};

var prototypeAccessors$4 = { locale: { configurable: true } };

prototypeAccessors$4.locale.get = function () {
  return this.i18n.locale
};

prototypeAccessors$4.locale.set = function (value) {
  warn('Cannot set locale from the validator when using vue-i18n, use i18n.locale setter instead');
};

I18nDictionary.prototype.getDateFormat = function getDateFormat (locale) {
  return this.i18n.getDateTimeFormat(locale || this.locale)
};

I18nDictionary.prototype.setDateFormat = function setDateFormat (locale, value) {
  this.i18n.setDateTimeFormat(locale || this.locale, value);
};

I18nDictionary.prototype.getMessage = function getMessage (_, key, data) {
  var path = (this.rootKey) + ".messages." + key;
  var result = this.i18n.t(path, data);
  if (result !== path) {
    return result
  }

  return this.i18n.t(((this.rootKey) + ".messages._default"), data)
};

I18nDictionary.prototype.getAttribute = function getAttribute (_, key, fallback) {
    if ( fallback === void 0 ) fallback = '';

  var path = (this.rootKey) + ".attributes." + key;
  var result = this.i18n.t(path);
  if (result !== path) {
    return result
  }

  return fallback
};

I18nDictionary.prototype.getFieldMessage = function getFieldMessage (_, field, key, data) {
  var path = (this.rootKey) + ".custom." + field + "." + key;
  var result = this.i18n.t(path, data);
  if (result !== path) {
    return result
  }

  return this.getMessage(_, key, data)
};

I18nDictionary.prototype.merge = function merge$1 (dictionary) {
    var this$1 = this;

  Object.keys(dictionary).forEach(function (localeKey) {
      var obj;

    // i18n doesn't deep merge
    // first clone the existing locale (avoid mutations to locale)
    var clone = merge({}, getPath((localeKey + "." + (this$1.rootKey)), this$1.i18n.messages, {}));
    // Merge cloned locale with new one
    var locale = merge(clone, normalizeFormat(dictionary[localeKey]));
    this$1.i18n.mergeLocaleMessage(localeKey, ( obj = {}, obj[this$1.rootKey] = locale, obj ));
    if (locale.dateFormat) {
      this$1.i18n.setDateTimeFormat(localeKey, locale.dateFormat);
    }
  });
};

I18nDictionary.prototype.setMessage = function setMessage (locale, key, value) {
    var obj, obj$1;

  this.merge(( obj$1 = {}, obj$1[locale] = {
      messages: ( obj = {}, obj[key] = value, obj ),
    }, obj$1 ));
};

I18nDictionary.prototype.setAttribute = function setAttribute (locale, key, value) {
    var obj, obj$1;

  this.merge(( obj$1 = {}, obj$1[locale] = {
      attributes: ( obj = {}, obj[key] = value, obj ),
    }, obj$1 ));
};

Object.defineProperties( I18nDictionary.prototype, prototypeAccessors$4 );

var DEFAULT_CONFIG = {
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
  useConstraintAttrs: true,
  i18n: null,
  i18nRootKey: 'validation',
};

var currentConfig = assign({}, DEFAULT_CONFIG);

var getConfig = function () { return currentConfig; };

var setConfig = function (newConf) {
  currentConfig = assign({}, currentConfig, newConf);
};

// 

var ReeValidate = function ReeValidate (config) {
  this.configure(config);
  this._validator = new Validator(null, { fastExit: config && config.fastExit });
  this._initI18n(this.config);
};

var prototypeAccessors$5 = { i18nDriver: { configurable: true },config: { configurable: true } };
var staticAccessors$2 = { i18nDriver: { configurable: true },config: { configurable: true } };

ReeValidate.setI18nDriver = function setI18nDriver (driver, instance) {
  DictionaryResolver.setDriver(driver, instance);
};

ReeValidate.configure = function configure (config) {
  setConfig(config);
};

ReeValidate.use = function use (plugin, options) {
    if ( options === void 0 ) options = {};

  if (!isCallable(plugin)) {
    return warn('The plugin must be a callable function')
  }

  plugin({ Validator: Validator, ErrorBag: ErrorBag, Rules: Validator.rules }, options);
};
prototypeAccessors$5.i18nDriver.get = function () {
  return DictionaryResolver.getDriver()
};

staticAccessors$2.i18nDriver.get = function () {
  return DictionaryResolver.getDriver()
};

prototypeAccessors$5.config.get = function () {
  return getConfig()
};

staticAccessors$2.config.get = function () {
  return getConfig()
};

ReeValidate.prototype._initI18n = function _initI18n (config) {
  var dictionary = config.dictionary;
    var i18n = config.i18n;
    var i18nRootKey = config.i18nRootKey;
    var locale = config.locale;

  // i18 is being used for localization.
  if (i18n) {
    ReeValidate.setI18nDriver('i18n', new I18nDictionary(i18n, i18nRootKey));
  }

  if (dictionary) {
    this.i18nDriver.merge(dictionary);
  }

  if (locale && !i18n) {
    this._validator.localize(locale);
  }
};

ReeValidate.prototype.configure = function configure (cfg) {
  ReeValidate.configure(cfg);
};

Object.defineProperties( ReeValidate.prototype, prototypeAccessors$5 );
Object.defineProperties( ReeValidate, staticAccessors$2 );

ReeValidate.Validator = Validator;
ReeValidate.ErrorBag = ErrorBag;

// 

var normalize = function (fields) {
  if (Array.isArray(fields)) {
    return fields.reduce(function (prev, curr) {
      if (includes(curr, '.')) {
        prev[curr.split('.')[1]] = curr;
      } else {
        prev[curr] = curr;
      }

      return prev
    }, {})
  }

  return fields
};

// Combines two flags using either AND or OR depending on the flag type.
var combine = function (lhs, rhs) {
  var mapper = {
    pristine: function (lhs, rhs) { return lhs && rhs; },
    dirty: function (lhs, rhs) { return lhs || rhs; },
    touched: function (lhs, rhs) { return lhs || rhs; },
    untouched: function (lhs, rhs) { return lhs && rhs; },
    valid: function (lhs, rhs) { return lhs && rhs; },
    invalid: function (lhs, rhs) { return lhs || rhs; },
    pending: function (lhs, rhs) { return lhs || rhs; },
    required: function (lhs, rhs) { return lhs || rhs; },
    validated: function (lhs, rhs) { return lhs && rhs; },
  };

  return Object.keys(mapper).reduce(function (flags, flag) {
    flags[flag] = mapper[flag](lhs[flag], rhs[flag]);

    return flags
  }, {})
};

var mapScope = function (scope, deep) {
  if ( deep === void 0 ) deep = true;

  return Object.keys(scope).reduce(function (flags, field) {
    if (!flags) {
      flags = assign({}, scope[field]);
      return flags
    }

    // scope.
    var isScope = field.indexOf('$') === 0;
    if (deep && isScope) {
      return combine(mapScope(scope[field]), flags)
    } else if (!deep && isScope) {
      return flags
    }

    flags = combine(flags, scope[field]);

    return flags
  }, null)
};

/**
 * Maps fields to computed functions.
 */
var mapFields = function (fields) {
  if (!fields) {
    return function () {
      return mapScope(this.$validator.flags)
    }
  }

  var normalized = normalize(fields);
  return Object.keys(normalized).reduce(function (prev, curr) {
    var field = normalized[curr];
    prev[curr] = function mappedField () {
      // if field exists
      if (this.$validator.flags[field]) {
        return this.$validator.flags[field]
      }

      // scopeless fields were selected.
      if (normalized[curr] === '*') {
        return mapScope(this.$validator.flags, false)
      }

      // if it has a scope defined
      var index = field.indexOf('.');
      if (index <= 0) {
        return {}
      }

      var ref = field.split('.');
      var scope = ref[0];
      var name = ref.slice(1);

      scope = this.$validator.flags[("$" + scope)];
      name = name.join('.');

      // an entire scope was selected: scope.*
      if (name === '*' && scope) {
        return mapScope(scope)
      }

      if (scope && scope[name]) {
        return scope[name]
      }

      return {}
    };

    return prev
  }, {})
};

var version = '3.3.0';
var install = ReeValidate.install;
var use = ReeValidate.use;

ReeValidate.version = version;
ReeValidate.mapFields = mapFields;

export default ReeValidate;
export { install, use, mapFields, Validator, ErrorBag, version };
