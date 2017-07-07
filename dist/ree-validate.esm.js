/**
 * ree-validate v2.0.0-rc.6
 * Extended from vee-validate
 * (c) 2017 Moeen Basra
 * @license MIT
 *
 * Special Thanks to Abdelrahman Awad
 */
/**
 * Some Alpha Regex helpers.
 * https://github.com/chriso/validator.js/blob/master/src/lib/alpha.js
 */

const alpha$1 = {
  en: /^[A-Z]*$/i,
  cs: /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*$/i,
  da: /^[A-ZÆØÅ]*$/i,
  de: /^[A-ZÄÖÜß]*$/i,
  es: /^[A-ZÁÉÍÑÓÚÜ]*$/i,
  fr: /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]*$/i,
  lt: /^[A-ZĄČĘĖĮŠŲŪŽ]*$/i,
  nl: /^[A-ZÉËÏÓÖÜ]*$/i,
  hu: /^[A-ZÁÉÍÓÖŐÚÜŰ]*$/i,
  pl: /^[A-ZĄĆĘŚŁŃÓŻŹ]*$/i,
  pt: /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]*$/i,
  ru: /^[А-ЯЁ]*$/i,
  sk: /^[A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ]*$/i,
  sr: /^[A-ZČĆŽŠĐ]*$/i,
  tr: /^[A-ZÇĞİıÖŞÜ]*$/i,
  uk: /^[А-ЩЬЮЯЄІЇҐ]*$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/
};

const alphaSpaces = {
  en: /^[A-Z\s]*$/i,
  cs: /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s]*$/i,
  da: /^[A-ZÆØÅ\s]*$/i,
  de: /^[A-ZÄÖÜß\s]*$/i,
  es: /^[A-ZÁÉÍÑÓÚÜ\s]*$/i,
  fr: /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ\s]*$/i,
  lt: /^[A-ZĄČĘĖĮŠŲŪŽ\s]*$/i,
  nl: /^[A-ZÉËÏÓÖÜ\s]*$/i,
  hu: /^[A-ZÁÉÍÓÖŐÚÜŰ\s]*$/i,
  pl: /^[A-ZĄĆĘŚŁŃÓŻŹ\s]*$/i,
  pt: /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ\s]*$/i,
  ru: /^[А-ЯЁ\s]*$/i,
  sk: /^[A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ\s]*$/i,
  sr: /^[A-ZČĆŽŠĐ\s]*$/i,
  tr: /^[A-ZÇĞİıÖŞÜ\s]*$/i,
  uk: /^[А-ЩЬЮЯЄІЇҐ\s]*$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ\s]*$/
};

const alphanumeric = {
  en: /^[0-9A-Z]*$/i,
  cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*$/i,
  da: /^[0-9A-ZÆØÅ]$/i,
  de: /^[0-9A-ZÄÖÜß]*$/i,
  es: /^[0-9A-ZÁÉÍÑÓÚÜ]*$/i,
  fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]*$/i,
  lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ]*$/i,
  hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]*$/i,
  nl: /^[0-9A-ZÉËÏÓÖÜ]*$/i,
  pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]*$/i,
  pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]*$/i,
  ru: /^[0-9А-ЯЁ]*$/i,
  sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ]*$/i,
  sr: /^[0-9A-ZČĆŽŠĐ]*$/i,
  tr: /^[0-9A-ZÇĞİıÖŞÜ]*$/i,
  uk: /^[0-9А-ЩЬЮЯЄІЇҐ]*$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/
};

const alphaDash = {
  en: /^[0-9A-Z_-]*$/i,
  cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ_-]*$/i,
  da: /^[0-9A-ZÆØÅ_-]*$/i,
  de: /^[0-9A-ZÄÖÜß_-]*$/i,
  es: /^[0-9A-ZÁÉÍÑÓÚÜ_-]*$/i,
  fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ_-]*$/i,
  lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ_-]*$/i,
  nl: /^[0-9A-ZÉËÏÓÖÜ_-]*$/i,
  hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ_-]*$/i,
  pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ_-]*$/i,
  pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ_-]*$/i,
  ru: /^[0-9А-ЯЁ_-]*$/i,
  sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ_-]*$/i,
  sr: /^[0-9A-ZČĆŽŠĐ_-]*$/i,
  tr: /^[0-9A-ZÇĞİıÖŞÜ_-]*$/i,
  uk: /^[0-9А-ЩЬЮЯЄІЇҐ_-]*$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ_-]*$/
};

var alpha = (value, [locale] = [null]) => {
  // Match at least one locale.
  if (! locale) {
    return Object.keys(alpha$1).some(loc => alpha$1[loc].test(value));
  }

  return (alpha$1[locale] || alpha$1.en).test(value);
};

var alpha_dash = (value, [locale] = [null]) => {
  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphaDash).some(loc => alphaDash[loc].test(value));
  }

  return (alphaDash[locale] || alphaDash.en).test(value);
};

var alpha_num = (value, [locale] = [null]) => {
  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphanumeric).some(loc => alphanumeric[loc].test(value));
  }

  return (alphanumeric[locale] || alphanumeric.en).test(value);
};

var alpha_spaces = (value, [locale] = [null]) => {
  // Match at least one locale.
  if (! locale) {
    return Object.keys(alphaSpaces).some(loc => alphaSpaces[loc].test(value));
  }

  return (alphaSpaces[locale] || alphaSpaces.en).test(value);
};

var between = (value, [min, max]) => Number(min) <= value && Number(max) >= value;

var confirmed = (value, [confirmedField], validatingField) => {
  let field = confirmedField
    ? document.querySelector(`input[name='${confirmedField}']`)
    : document.querySelector(`input[name='${validatingField}_confirmation']`);

  if (! field) {
    field = confirmedField
      ? document.querySelector(`input[data-vv-name='${confirmedField}']`)
      : document.querySelector(`input[data-vv-name='${validatingField}_confirmation']`);
  }

  return !! (field && String(value) === field.value);
};

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var assertString_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertString;
function assertString(input) {
  var isString = typeof input === 'string' || input instanceof String;

  if (!isString) {
    throw new TypeError('This library (validator.js) validates strings only');
  }
}
module.exports = exports['default'];
});

var isCreditCard_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCreditCard;



var _assertString2 = _interopRequireDefault(assertString_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable max-len */
var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/;
/* eslint-enable max-len */

function isCreditCard(str) {
  (0, _assertString2.default)(str);
  var sanitized = str.replace(/[- ]+/g, '');
  if (!creditCard.test(sanitized)) {
    return false;
  }
  var sum = 0;
  var digit = void 0;
  var tmpNum = void 0;
  var shouldDouble = void 0;
  for (var i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += tmpNum % 10 + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }
  return !!(sum % 10 === 0 ? sanitized : false);
}
module.exports = exports['default'];
});

var isCreditCard = unwrapExports(isCreditCard_1);

var credit_card = (value) => isCreditCard(String(value));

var decimal = (value, params) => {
  const decimals = Array.isArray(params) ? (params[0] || '*') : '*';
  if (Array.isArray(value)) {
    return false;
  }

  if (value === null || value === undefined || value === '') {
    return true;
  }

  // if is 0.
  if (Number(decimals) === 0) {
    return /^-?\d*$/.test(value);
  }

  const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
  const regex = new RegExp(`^-?\\d*(\\.\\d${regexPart})?$`);

  if (! regex.test(value)) {
    return false;
  }

  const parsedValue = parseFloat(value);

  // eslint-disable-next-line
    return parsedValue === parsedValue;
};

var digits = (value, [length]) => {
  const strVal = String(value);

  return /^[0-9]*$/.test(strVal) && strVal.length === Number(length);
};

const validateImage = (file, width, height) => {
  const URL = window.URL || window.webkitURL;
  return new Promise(resolve => {
    const image = new Image();
    image.onerror = () => resolve({ valid: false });
    image.onload = () => resolve({
      valid: image.width === Number(width) && image.height === Number(height)
    });

    image.src = URL.createObjectURL(file);
  });
};

var dimensions = (files, [width, height]) => {
  const list = [];
  for (let i = 0; i < files.length; i++) {
    // if file is not an image, reject.
    if (! /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
      return false;
    }

    list.push(files[i]);
  }

  return Promise.all(list.map(file => validateImage(file, width, height)));
};

var merge_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = merge;
function merge() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaults = arguments[1];

  for (var key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}
module.exports = exports['default'];
});

var isByteLength_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = isByteLength;



var _assertString2 = _interopRequireDefault(assertString_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable prefer-rest-params */
function isByteLength(str, options) {
  (0, _assertString2.default)(str);
  var min = void 0;
  var max = void 0;
  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }
  var len = encodeURI(str).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
}
module.exports = exports['default'];
});

var isFQDN = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFDQN;



var _assertString2 = _interopRequireDefault(assertString_1);



var _merge2 = _interopRequireDefault(merge_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false
};

function isFDQN(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_fqdn_options);

  /* Remove the optional trailing dot before checking validity */
  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }
  var parts = str.split('.');
  if (options.require_tld) {
    var tld = parts.pop();
    if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    }
    // disallow spaces
    if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20]/.test(tld)) {
      return false;
    }
  }
  for (var part, i = 0; i < parts.length; i++) {
    part = parts[i];
    if (options.allow_underscores) {
      part = part.replace(/_/g, '');
    }
    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }
    // disallow full-width chars
    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    }
    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }
  return true;
}
module.exports = exports['default'];
});

var isEmail_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEmail;



var _assertString2 = _interopRequireDefault(assertString_1);



var _merge2 = _interopRequireDefault(merge_1);



var _isByteLength2 = _interopRequireDefault(isByteLength_1);



var _isFQDN2 = _interopRequireDefault(isFQDN);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_email_options = {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true
};

/* eslint-disable max-len */
/* eslint-disable no-control-regex */
var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
/* eslint-enable max-len */
/* eslint-enable no-control-regex */

function isEmail(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_email_options);

  if (options.require_display_name || options.allow_display_name) {
    var display_email = str.match(displayName);
    if (display_email) {
      str = display_email[1];
    } else if (options.require_display_name) {
      return false;
    }
  }

  var parts = str.split('@');
  var domain = parts.pop();
  var user = parts.join('@');

  var lower_domain = domain.toLowerCase();
  if (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com') {
    user = user.replace(/\./g, '').toLowerCase();
  }

  if (!(0, _isByteLength2.default)(user, { max: 64 }) || !(0, _isByteLength2.default)(domain, { max: 254 })) {
    return false;
  }

  if (!(0, _isFQDN2.default)(domain, { require_tld: options.require_tld })) {
    return false;
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }

  var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;

  var user_parts = user.split('.');
  for (var i = 0; i < user_parts.length; i++) {
    if (!pattern.test(user_parts[i])) {
      return false;
    }
  }

  return true;
}
module.exports = exports['default'];
});

var isEmail = unwrapExports(isEmail_1);

var email = (value) => isEmail(String(value));

var ext = (files, extensions) => {
  const regex = new RegExp(`.(${extensions.join('|')})$`, 'i');

  return files.every(file => regex.test(file.name));
};

var image = (files) => files.every(file =>
  /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name)
);

var In = (value, options) => !! options.filter(option => option == value).length; // eslint-disable-line

var isIP_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIP;



var _assertString2 = _interopRequireDefault(assertString_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
var ipv6Block = /^[0-9A-F]{1,4}$/i;

function isIP(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  (0, _assertString2.default)(str);
  version = String(version);
  if (!version) {
    return isIP(str, 4) || isIP(str, 6);
  } else if (version === '4') {
    if (!ipv4Maybe.test(str)) {
      return false;
    }
    var parts = str.split('.').sort(function (a, b) {
      return a - b;
    });
    return parts[3] <= 255;
  } else if (version === '6') {
    var blocks = str.split(':');
    var foundOmissionBlock = false; // marker to indicate ::

    // At least some OS accept the last 32 bits of an IPv6 address
    // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
    // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
    // and '::a.b.c.d' is deprecated, but also valid.
    var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
    var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

    if (blocks.length > expectedNumberOfBlocks) {
      return false;
    }
    // initial or final ::
    if (str === '::') {
      return true;
    } else if (str.substr(0, 2) === '::') {
      blocks.shift();
      blocks.shift();
      foundOmissionBlock = true;
    } else if (str.substr(str.length - 2) === '::') {
      blocks.pop();
      blocks.pop();
      foundOmissionBlock = true;
    }

    for (var i = 0; i < blocks.length; ++i) {
      // test for a :: which can not be at the string start/end
      // since those cases have been handled above
      if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
        if (foundOmissionBlock) {
          return false; // multiple :: in address
        }
        foundOmissionBlock = true;
      } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
        // it has been checked before that the last
        // block is a valid IPv4 address
      } else if (!ipv6Block.test(blocks[i])) {
        return false;
      }
    }
    if (foundOmissionBlock) {
      return blocks.length >= 1;
    }
    return blocks.length === expectedNumberOfBlocks;
  }
  return false;
}
module.exports = exports['default'];
});

var isIP = unwrapExports(isIP_1);

var ip = (value, [version] = [4]) => isIP(value, version);

var max = (value, [length]) => {
  if (value === undefined || value === null) {
    return length >= 0;
  }

  return String(value).length <= length;
};

var max_value = (value, [max]) => {
  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }

  return Number(value) <= max;
};

var mimes = (files, mimes) => {
  const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');

  return files.every(file => regex.test(file.type));
};

var min = (value, [length]) => {
  if (value === undefined || value === null) {
    return false;
  }
  return String(value).length >= length;
};

var min_value = (value, [min]) => {
  if (Array.isArray(value) || value === null || value === undefined || value === '') {
    return false;
  }

  return Number(value) >= min;
};

var not_in = (value, options) => ! options.filter(option => option == value).length; // eslint-disable-line

var numeric = (value) => /^[0-9]+$/.test(String(value));

var regex = (value, [regex, ...flags]) => {
  if (regex instanceof RegExp) {
    return regex.test(value);
  }

  return new RegExp(regex, flags).test(String(value));
};

var required = (value, params = [false]) => {
  if (Array.isArray(value)) {
    return !! value.length;
  }

  // incase a field considers `false` as an empty value like checkboxes.
  const invalidateFalse = params[0];
  if (value === false && invalidateFalse) {
    return false;
  }

  if (value === undefined || value === null) {
    return false;
  }

  return !! String(value).trim().length;
};

var size = (files, [size]) => {
  if (isNaN(size)) {
    return false;
  }

  const nSize = Number(size) * 1024;
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > nSize) {
      return false;
    }
  }

  return true;
};

var isURL_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isURL;



var _assertString2 = _interopRequireDefault(assertString_1);



var _isFQDN2 = _interopRequireDefault(isFQDN);



var _isIP2 = _interopRequireDefault(isIP_1);



var _merge2 = _interopRequireDefault(merge_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_url_options = {
  protocols: ['http', 'https', 'ftp'],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false
};

var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;

function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}

function checkHost(host, matches) {
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];
    if (host === match || isRegExp(match) && match.test(host)) {
      return true;
    }
  }
  return false;
}

function isURL(url, options) {
  (0, _assertString2.default)(url);
  if (!url || url.length >= 2083 || /[\s<>]/.test(url)) {
    return false;
  }
  if (url.indexOf('mailto:') === 0) {
    return false;
  }
  options = (0, _merge2.default)(options, default_url_options);
  var protocol = void 0,
      auth = void 0,
      host = void 0,
      hostname = void 0,
      port = void 0,
      port_str = void 0,
      split = void 0,
      ipv6 = void 0;

  split = url.split('#');
  url = split.shift();

  split = url.split('?');
  url = split.shift();

  split = url.split('://');
  if (split.length > 1) {
    protocol = split.shift();
    if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
      return false;
    }
  } else if (options.require_protocol) {
    return false;
  } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
    split[0] = url.substr(2);
  }
  url = split.join('://');

  split = url.split('/');
  url = split.shift();

  if (url === '' && !options.require_host) {
    return true;
  }

  split = url.split('@');
  if (split.length > 1) {
    auth = split.shift();
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }
  }
  hostname = split.join('@');

  port_str = null;
  ipv6 = null;
  var ipv6_match = hostname.match(wrapped_ipv6);
  if (ipv6_match) {
    host = '';
    ipv6 = ipv6_match[1];
    port_str = ipv6_match[2] || null;
  } else {
    split = hostname.split(':');
    host = split.shift();
    if (split.length) {
      port_str = split.join(':');
    }
  }

  if (port_str !== null) {
    port = parseInt(port_str, 10);
    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  }

  if (!(0, _isIP2.default)(host) && !(0, _isFQDN2.default)(host, options) && (!ipv6 || !(0, _isIP2.default)(ipv6, 6)) && host !== 'localhost') {
    return false;
  }

  host = host || ipv6;

  if (options.host_whitelist && !checkHost(host, options.host_whitelist)) {
    return false;
  }
  if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
    return false;
  }

  return true;
}
module.exports = exports['default'];
});

var isURL = unwrapExports(isURL_1);

var url = (value, [requireProtocol] = [true]) =>
  isURL(value, { require_protocol: !! requireProtocol });

/* eslint-disable camelcase */
var Rules = {
  alpha_dash,
  alpha_num,
  alpha_spaces,
  alpha,
  between,
  confirmed,
  credit_card,
  decimal,
  digits,
  dimensions,
  email,
  ext,
  image,
  in: In,
  ip,
  max,
  max_value,
  mimes,
  min,
  min_value,
  not_in,
  numeric,
  regex,
  required,
  size,
  url
};

class ErrorBag {
  constructor () {
    this.errors = [];
  }

  /**
     * Adds an error to the internal array.
     *
     * @param {string} field The field name.
     * @param {string} msg The error message.
     * @param {String} rule The rule that is responsible for the error.
     * @param {String} scope The Scope name, optional.
     */
  add (field, msg, rule, scope = '__global__') {
    this.errors.push({ field, msg, rule, scope });
  }

  /**
     * Gets all error messages from the internal array.
     *
     * @param {String} scope The Scope name, optional.
     * @return {Array} errors Array of all error messages.
     */
  all (scope) {
    if (! scope) {
      return this.errors.map(e => e.msg);
    }

    return this.errors.filter(e => e.scope === scope).map(e => e.msg);
  }

  /**
     * Checks if there are any errors in the internal array.
     * @param {String} scope The Scope name, optional.
     * @return {boolean} result True if there was at least one error, false otherwise.
     */
  any (scope) {
    if (! scope) {
      return !! this.errors.length;
    }

    return !! this.errors.filter(e => e.scope === scope).length;
  }

  /**
     * Removes all items from the internal array.
     *
     * @param {String} scope The Scope name, optional.
     */
  clear (scope) {
    if (! scope) {
      scope = '__global__';
    }

    const removeCondition = e => e.scope === scope;

    for (let i = 0; i < this.errors.length; ++i) {
      if (removeCondition(this.errors[i])) {
        this.errors.splice(i, 1);
        --i;
      }
    }
  }

  /**
     * Collects errors into groups or for a specific field.
     *
     * @param  {string} field The field name.
     * @param  {string} scope The scope name.
     * @param {Boolean} map If it should map the errors to strings instead of objects.
     * @return {Array} errors The errors for the specified field.
     */
  collect (field, scope, map = true) {
    if (! field) {
      const collection = {};
      this.errors.forEach(e => {
        if (! collection[e.field]) {
          collection[e.field] = [];
        }

        collection[e.field].push(map ? e.msg : e);
      });

      return collection;
    }

    if (! scope) {
      return this.errors.filter(e => e.field === field).map(e => (map ? e.msg : e));
    }

    return this.errors.filter(e => e.field === field && e.scope === scope)
      .map(e => (map ? e.msg : e));
  }
  /**
     * Gets the internal array length.
     *
     * @return {Number} length The internal array length.
     */
  count () {
    return this.errors.length;
  }

  /**
     * Gets the first error message for a specific field.
     *
     * @param  {string} field The field name.
     * @return {string|null} message The error message.
     */
  first (field, scope = '__global__') {
    const selector = this._selector(field);
    const scoped = this._scope(field);

    if (scoped) {
      const result = this.first(scoped.name, scoped.scope);
      // if such result exist, return it. otherwise it could be a field.
      // with dot in its name.
      if (result) {
        return result;
      }
    }

    if (selector) {
      return this.firstByRule(selector.name, selector.rule, scope);
    }

    for (let i = 0; i < this.errors.length; ++i) {
      if (this.errors[i].field === field && (this.errors[i].scope === scope)) {
        return this.errors[i].msg;
      }
    }

    return null;
  }

  /**
     * Returns the first error rule for the specified field
     *
     * @param {string} field The specified field.
     * @return {string|null} First error rule on the specified field if one is found, otherwise null
     */
  firstRule (field, scope) {
    const errors = this.collect(field, scope, false);

    return (errors.length && errors[0].rule) || null;
  }

  /**
     * Checks if the internal array has at least one error for the specified field.
     *
     * @param  {string} field The specified field.
     * @return {Boolean} result True if at least one error is found, false otherwise.
     */
  has (field, scope = '__global__') {
    return !! this.first(field, scope);
  }

  /**
     * Gets the first error message for a specific field and a rule.
     * @param {String} name The name of the field.
     * @param {String} rule The name of the rule.
     * @param {String} scope The name of the scope (optional).
     */
  firstByRule (name, rule, scope) {
    const error = this.collect(name, scope, false).filter(e => e.rule === rule)[0];

    return (error && error.msg) || null;
  }

  /**
     * Removes all error messages associated with a specific field.
     *
     * @param  {string} field The field which messages are to be removed.
     * @param {String} scope The Scope name, optional.
     */
  remove (field, scope) {
    const removeCondition = scope ? e => e.field === field && e.scope === scope
      : e => e.field === field && e.scope === '__global__';

    for (let i = 0; i < this.errors.length; ++i) {
      if (removeCondition(this.errors[i])) {
        this.errors.splice(i, 1);
        --i;
      }
    }
  }

  /**
     * Get the field attributes if there's a rule selector.
     *
     * @param  {string} field The specified field.
     * @return {Object|null}
     */
  _selector (field) {
    if (field.indexOf(':') > -1) {
      const [name, rule] = field.split(':');

      return { name, rule };
    }

    return null;
  }

  /**
     * Get the field scope if specified using dot notation.
     *
     * @param {string} field the specifie field.
     * @return {Object|null}
     */
  _scope (field) {
    if (field.indexOf('.') > -1) {
      const [scope, name] = field.split('.');

      return { name, scope };
    }

    return null;
  }
}

/**
 * Gets the data attribute. the name must be kebab-case.
 */


/**
 * Determines the input field scope.
 */


/**
 * Gets the value in an object safely.
 * @param {String} propPath
 * @param {Object} target
 * @param {*} def
 */
const getPath = (propPath, target, def = undefined) => {
  if (!propPath || !target) return def;
  let value = target;
  propPath.split('.').every(prop => {
    if (! Object.prototype.hasOwnProperty.call(value, prop) && value[prop] === undefined) {
      value = def;

      return false;
    }

    value = value[prop];

    return true;
  });

  return value;
};

/**
 * Debounces a function.
 */


/**
 * Emits a warning to the console.
 */
const warn = (message) => {
  console.warn(`[vee-validate] ${message}`); // eslint-disable-line
};

/**
 * Creates a branded error object.
 * @param {String} message
 */
const createError = (message) => new Error(`[vee-validate] ${message}`);

/**
 * Checks if the value is an object.
 */
const isObject = (object) =>
  object !== null && object && typeof object === 'object' && ! Array.isArray(object);

/**
 * Checks if a function is callable.
 */
const isCallable = (func) => typeof func === 'function';

/**
 * Check if element has the css class on it.
 */


/**
 * Adds the provided css className to the element.
 */


/**
 * Remove the provided css className from the element.
 */


/**
 * Converts an array-like object to array.
 * Simple polyfill for Array.from
 */
const toArray = (arrayLike) => {
  if (Array.from) {
    return Array.from(arrayLike);
  }

  const array = [];
  const length = arrayLike.length;
  for (let i = 0; i < length; i++) {
    array.push(arrayLike[i]);
  }

  return array;
};

/**
 * Assign polyfill from the mdn.
 */
const assign = (target, ...others) => {
  if (Object.assign) {
    return Object.assign(target, ...others);
  }

  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const to = Object(target);
  others.forEach(arg => {
    // Skip over if undefined or null
    if (arg != null) {
      Object.keys(arg).forEach(key => {
        to[key] = arg[key];
      });
    }
  });

  return to;
};

/**
 * polyfills array.find
 * @param {Array} array
 * @param {Function} predicate
 */


/**
 * Gets the rules from a binding value or the element dataset.
 *
 * @param {String} expression The binding expression.
 * @param {Object|String} value The binding value.
 * @param {element} el The element.
 * @returns {String|Object}
 */

class Dictionary {
  constructor (dictionary = {}) {
    this.container = {};
    this.merge(dictionary);
  }

  hasLocale (locale) {
    return !! this.container[locale];
  }

  setDateFormat (locale, format) {
    if (!this.container[locale]) {
      this.container[locale] = {};
    }

    this.container[locale].dateFormat = format;
  }

  getDateFormat (locale) {
    if (!this.container[locale]) {
      return undefined;
    }

    return this.container[locale].dateFormat;
  }

  getMessage (locale, key, fallback) {
    if (! this.hasMessage(locale, key)) {
      return fallback || this._getDefaultMessage(locale);
    }

    return this.container[locale].messages[key];
  }

  /**
   * Gets a specific message for field. fallsback to the rule message.
   *
   * @param {String} locale
   * @param {String} field
   * @param {String} key
   */
  getFieldMessage (locale, field, key) {
    if (! this.hasLocale(locale)) {
      return this.getMessage(locale, key);
    }

    const dict = this.container[locale].custom && this.container[locale].custom[field];
    if (! dict || ! dict[key]) {
      return this.getMessage(locale, key);
    }

    return dict[key];
  }

  _getDefaultMessage (locale) {
    if (this.hasMessage(locale, '_default')) {
      return this.container[locale].messages._default;
    }

    return this.container.en.messages._default;
  }

  getAttribute (locale, key, fallback = '') {
    if (! this.hasAttribute(locale, key)) {
      return fallback;
    }

    return this.container[locale].attributes[key];
  }

  hasMessage (locale, key) {
    return !! (
      this.hasLocale(locale) &&
            this.container[locale].messages &&
            this.container[locale].messages[key]
    );
  }

  hasAttribute (locale, key) {
    return !! (
      this.hasLocale(locale) &&
            this.container[locale].attributes &&
            this.container[locale].attributes[key]
    );
  }

  merge (dictionary) {
    this._merge(this.container, dictionary);
  }

  setMessage (locale, key, message) {
    if (! this.hasLocale(locale)) {
      this.container[locale] = {
        messages: {},
        attributes: {}
      };
    }

    this.container[locale].messages[key] = message;
  }

  setAttribute (locale, key, attribute) {
    if (! this.hasLocale(locale)) {
      this.container[locale] = {
        messages: {},
        attributes: {}
      };
    }

    this.container[locale].attributes[key] = attribute;
  }

  _merge (target, source) {
    if (! (isObject(target) && isObject(source))) {
      return target;
    }

    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (! target[key]) {
          assign(target, { [key]: {} });
        }

        this._merge(target[key], source[key]);
        return;
      }

      assign(target, { [key]: source[key] });
    });

    return target;
  }
}

/* istanbul ignore next */
var messages = {
  _default: (field) => `The ${field} value is not valid.`,
  alpha_dash: (field) => `The ${field} field may contain alpha-numeric characters as well as dashes and underscores.`,
  alpha_num: (field) => `The ${field} field may only contain alpha-numeric characters.`,
  alpha_spaces: (field) => `The ${field} field may only contain alphabetic characters as well as spaces.`,
  alpha: (field) => `The ${field} field may only contain alphabetic characters.`,
  between: (field, [min, max]) => `The ${field} field must be between ${min} and ${max}.`,
  confirmed: (field) => `The ${field} confirmation does not match.`,
  credit_card: (field) => `The ${field} field is invalid.`,
  decimal: (field, [decimals] = ['*']) => `The ${field} field must be numeric and may contain ${!decimals || decimals === '*' ? '' : decimals} decimal points.`,
  digits: (field, [length]) => `The ${field} field must be numeric and exactly contain ${length} digits.`,
  dimensions: (field, [width, height]) => `The ${field} field must be ${width} pixels by ${height} pixels.`,
  email: (field) => `The ${field} field must be a valid email.`,
  ext: (field) => `The ${field} field must be a valid file.`,
  image: (field) => `The ${field} field must be an image.`,
  in: (field) => `The ${field} field must be a valid value.`,
  ip: (field) => `The ${field} field must be a valid ip address.`,
  max: (field, [length]) => `The ${field} field may not be greater than ${length} characters.`,
  max_value: (field, [max]) => `The ${field} field must be ${max} or less.`,
  mimes: (field) => `The ${field} field must have a valid file type.`,
  min: (field, [length]) => `The ${field} field must be at least ${length} characters.`,
  min_value: (field, [min]) => `The ${field} field must be ${min} or more.`,
  not_in: (field) => `The ${field} field must be a valid value.`,
  numeric: (field) => `The ${field} field may only contain numeric characters.`,
  regex: (field) => `The ${field} field format is invalid.`,
  required: (field) => `The ${field} field is required.`,
  size: (field, [size]) => `The ${field} field must be less than ${size} KB.`,
  url: (field) => `The ${field} field is not a valid URL.`
};

var after = (moment) => (value, [targetField, inclusion, format]) => {
  const field = document.querySelector(`input[name='${targetField}']`);
  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }
  const dateValue = moment(value, format, true);
  const otherValue = moment(field ? field.value : targetField, format, true);

  // if either is not valid.
  if (! dateValue.isValid() || ! otherValue.isValid()) {
    return false;
  }

  return dateValue.isAfter(otherValue) || (inclusion && dateValue.isSame(otherValue));
};

var before = (moment) => (value, [targetField, inclusion, format]) => {
  const field = document.querySelector(`input[name='${targetField}']`);
  if (typeof format === 'undefined') {
    format = inclusion;
    inclusion = false;
  }
  const dateValue = moment(value, format, true);
  const otherValue = moment(field ? field.value : targetField, format, true);

  // if either is not valid.
  if (! dateValue.isValid() || ! otherValue.isValid()) {
    return false;
  }

  return dateValue.isBefore(otherValue) || (inclusion && dateValue.isSame(otherValue));
};

var date_format = (moment) => (value, [format]) => moment(value, format, true).isValid();

var date_between = (moment) => (value, params) => {
  let min;
  let max;
  let format;
  let inclusivity = '()';

  if (params.length > 3) {
    [min, max, inclusivity, format] = params;
  } else {
    [min, max, format] = params;
  }

  const minDate = moment(min, format, true);
  const maxDate = moment(max, format, true);
  const dateVal = moment(value, format, true);

  if (! (minDate.isValid() && maxDate.isValid() && dateVal.isValid())) {
    return false;
  }

  return dateVal.isBetween(minDate, maxDate, 'days', inclusivity);
};

/* istanbul ignore next */
/* eslint-disable max-len */
var messages$1 = {
  after: (field, [target, inclusion]) => `The ${field} must be after ${inclusion ? 'or equal to ' : ''}${target}.`,
  before: (field, [target, inclusion]) => `The ${field} must be before ${inclusion ? 'or equal to ' : ''}${target}.`,
  date_between: (field, [min, max]) => `The ${field} must be between ${min} and ${max}.`,
  date_format: (field, [format]) => `The ${field} must be in the format ${format}.`
};

var date = {
  make: (moment) => ({
    date_format: date_format(moment),
    after: after(moment),
    before: before(moment),
    date_between: date_between(moment)
  }),
  messages: messages$1,
  installed: false
};

let LOCALE = 'en';
let STRICT_MODE = true;
const DICTIONARY = new Dictionary({
  en: {
    messages,
    attributes: {},
    custom: {}
  }
});

class Validator {
  constructor (validations, options = { vm: null, fastExit: true }) {
    this.strictMode = STRICT_MODE;
    this.$scopes = { __global__: {} };
    this._createFields(validations);
    this.errorBag = new ErrorBag();
    this.fieldBag = {};
    this.paused = false;
    this.fastExit = options.fastExit || false;
    this.$vm = options.vm;

    // if momentjs is present, install the validators.
    if (typeof moment === 'function') {
      // eslint-disable-next-line
      this.installDateTimeValidators(moment);
    }
  }

  /**
   * @return {Dictionary}
   */
  get dictionary () {
    return DICTIONARY;
  }

  /**
   * @return {Dictionary}
   */
  static get dictionary () {
    return DICTIONARY;
  }

  /**
   * @return {String}
   */
  get locale () {
    return LOCALE;
  }

  /**
   * @return {Object}
   */
  get rules () {
    return Rules;
  }

  /**
   * Merges a validator object into the Rules and Messages.
   *
   * @param  {string} name The name of the validator.
   * @param  {function|object} validator The validator object.
   */
  static _merge (name, validator) {
    if (isCallable(validator)) {
      Rules[name] = validator;
      return;
    }

    Rules[name] = validator.validate;
    if (isCallable(validator.getMessage)) {
      DICTIONARY.setMessage(LOCALE, name, validator.getMessage);
    }

    if (validator.messages) {
      DICTIONARY.merge(
        Object.keys(validator.messages).reduce((prev, curr) => {
          const dict = prev;
          dict[curr] = {
            messages: {
              [name]: validator.messages[curr]
            }
          };

          return dict;
        }, {})
      );
    }
  }

  /**
   * Guards from extnsion violations.
   *
   * @param  {string} name name of the validation rule.
   * @param  {object} validator a validation rule object.
   */
  static _guardExtend (name, validator) {
    if (isCallable(validator)) {
      return;
    }

    if (! isCallable(validator.validate)) {
      throw createError(
        // eslint-disable-next-line
        `Extension Error: The validator '${name}' must be a function or have a 'validate' method.`
      );
    }

    if (! isCallable(validator.getMessage) && ! isObject(validator.messages)) {
      throw createError(
        // eslint-disable-next-line
        `Extension Error: The validator '${name}' must have a 'getMessage' method or have a 'messages' object.`
      );
    }
  }

  /**
   * Static constructor.
   *
   * @param  {object} validations The validations object.
   * @return {Validator} validator A validator object.
   */
  static create (validations, options) {
    return new Validator(validations, options);
  }

  /**
   * Adds a custom validator to the list of validation rules.
   *
   * @param  {string} name The name of the validator.
   * @param  {object|function} validator The validator object/function.
   */
  static extend (name, validator) {
    Validator._guardExtend(name, validator);
    Validator._merge(name, validator);
  }

  /**
   * Installs the datetime validators and the messages.
   */
  static installDateTimeValidators (moment) {
    if (typeof moment !== 'function') {
      warn('To use the date-time validators you must provide moment reference.');

      return false;
    }

    if (date.installed) {
      return true;
    }

    const validators = date.make(moment);
    Object.keys(validators).forEach(name => {
      Validator.extend(name, validators[name]);
    });

    Validator.updateDictionary({
      en: {
        messages: date.messages
      }
    });
    date.installed = true;

    return true;
  }

  /**
   * Removes a rule from the list of validators.
   * @param {String} name The name of the validator/rule.
   */
  static remove (name) {
    delete Rules[name];
  }

  /**
   * Sets the default locale for all validators.
   *
   * @param {String} language The locale id.
   */
  static setLocale (language = 'en') {
    /* istanbul ignore if */
    if (! DICTIONARY.hasLocale(language)) {
      // eslint-disable-next-line
      warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
    }

    LOCALE = language;
  }

  /**
   * Sets the operating mode for all newly created validators.
   * strictMode = true: Values without a rule are invalid and cause failure.
   * strictMode = false: Values without a rule are valid and are skipped.
   * @param {Boolean} strictMode.
   */
  static setStrictMode (strictMode = true) {
    STRICT_MODE = strictMode;
  }

  /**
   * Updates the dicitionary, overwriting existing values and adding new ones.
   *
   * @param  {object} data The dictionary object.
   */
  static updateDictionary (data) {
    DICTIONARY.merge(data);
  }

  static addLocale (locale) {
    if (! locale.name) {
      warn('Your locale must have a name property');
      return;
    }

    this.updateDictionary({
      [locale.name]: locale
    });
  }

  addLocale (locale) {
    Validator.addLocale(locale);
  }

  /**
   * Resolves the field values from the getter functions.
   */
  _resolveValuesFromGetters (scope = '__global__') {
    if (! this.$scopes[scope]) {
      return {};
    }
    const values = {};
    Object.keys(this.$scopes[scope]).forEach(name => {
      const field = this.$scopes[scope][name];
      const getter = field.getter;
      const context = field.context;
      const fieldScope = field.scope;
      if (getter && context && (scope === '__global__' || fieldScope === scope)) {
        const ctx = context();
        if (ctx && ctx.disabled) {
          return;
        }

        values[name] = {
          value: getter(ctx),
          scope: fieldScope
        };
      }
    });

    return values;
  }

  /**
   * Creates the fields to be validated.
   *
   * @param  {object} validations
   * @return {object} Normalized object.
   */
  _createFields (validations) {
    if (! validations) {
      return;
    }

    Object.keys(validations).forEach(field => {
      this._createField(field, validations[field]);
    });
  }

  /**
   * Creates a field entry in the fields object.
   * @param {String} name.
   * @param {String|Array} checks.
   */
  _createField (name, checks, scope = '__global__') {
    if (! this.$scopes[scope]) {
      this.$scopes[scope] = {};
    }

    if (! this.$scopes[scope][name]) {
      this.$scopes[scope][name] = {};
    }

    const field = this.$scopes[scope][name];
    field.name = name;
    field.validations = this._normalizeRules(name, checks, scope, field);
    field.required = this._isRequired(field);
  }

  /**
   * Normalizes rules.
   * @return {Object}
   */
  _normalizeRules (name, checks, scope, field) {
    if (! checks) return {};

    if (typeof checks === 'string') {
      return this._normalizeString(checks, field);
    }

    if (! isObject(checks)) {
      warn(`Your checks for '${scope}.${name}' must be either a string or an object.`);
      return {};
    }

    return this._normalizeObject(checks, field);
  }

  /**
   * Checks if a field has a required rule.
   */
  _isRequired (field) {
    return !! (field.validations && field.validations.required);
  }

  /**
   * Normalizes an object of rules.
   */
  _normalizeObject (rules, field = null) {
    const validations = {};
    Object.keys(rules).forEach(rule => {
      let params = [];
      if (rules[rule] === true) {
        params = [];
      } else if (Array.isArray(rules[rule])) {
        params = rules[rule];
      } else {
        params = [rules[rule]];
      }

      if (rule === 'required') {
        params = [field && field.invalidateFalse];
      }

      if (rules[rule] === false) {
        delete validations[rule];
      } else {
        validations[rule] = params;
      }
    });

    return validations;
  }

  /**
   * Date rules need the existance of a format, so date_format must be supplied.
   * @param {String} name The rule name.
   * @param {Array} validations the field validations.
   */
  _getDateFormat (validations) {
    let format = null;
    if (validations.date_format && Array.isArray(validations.date_format)) {
      format = validations.date_format[0];
    }

    return format || this.dictionary.getDateFormat(this.locale);
  }

  /**
   * Checks if the passed rule is a date rule.
   */
  _isADateRule (rule) {
    return !! ~['after', 'before', 'date_between', 'date_format'].indexOf(rule);
  }

  /**
   * Checks if the passed validation appears inside the array.
   */
  _containsValidation (validations, validation) {
    return !! ~validations.indexOf(validation);
  }

  /**
   * Normalizes string rules.
   * @param {String} rules The rules that will be normalized.
   * @param {Object} field The field object that is being operated on.
   */
  _normalizeString (rules, field = null) {
    const validations = {};
    rules.split('|').forEach(rule => {
      const parsedRule = this._parseRule(rule);
      if (! parsedRule.name) {
        return;
      }

      validations[parsedRule.name] = parsedRule.params;
      if (parsedRule.name === 'required') {
        validations.required = [field && field.invalidateFalse];
      }
    });

    return validations;
  }

  /**
   * Normalizes a string rule.
   *
   * @param {string} rule The rule to be normalized.
   * @return {object} rule The normalized rule.
   */
  _parseRule (rule) {
    let params = [];
    const name = rule.split(':')[0];

    if (~rule.indexOf(':')) {
      params = rule.split(':').slice(1).join(':').split(',');
    }

    return { name, params };
  }

  /**
   * Formats an error message for field and a rule.
   *
   * @param  {Object} field The field object.
   * @param  {object} rule Normalized rule object.
   * @param {object} data Additional Information about the validation result.
   * @return {string} Formatted error message.
   */
  _formatErrorMessage (field, rule, data = {}) {
    const name = this._getFieldDisplayName(field);
    const params = this._getLocalizedParams(rule, field.scope);
    // Defaults to english message.
    if (! this.dictionary.hasLocale(LOCALE)) {
      const msg = this.dictionary.getFieldMessage('en', field.name, rule.name);

      return isCallable(msg) ? msg(name, params, data) : msg;
    }

    const msg = this.dictionary.getFieldMessage(LOCALE, field.name, rule.name);

    return isCallable(msg) ? msg(name, params, data) : msg;
  }

  /**
   * Translates the parameters passed to the rule (mainly for target fields).
   */
  _getLocalizedParams (rule, scope = '__global__') {
    if (~ ['after', 'before', 'confirmed'].indexOf(rule.name) && rule.params && rule.params[0]) {
      return [this.dictionary.getAttribute(LOCALE, rule.params[0], rule.params[0])];
    }

    return rule.params;
  }

  /**
   * Resolves an appropiate display name, first checking 'data-as' or the registered 'prettyName'
   * Then the dictionary, then fallsback to field name.
   * @param {Object} field The field object.
   * @return {String} The name to be used in the errors.
   */
  _getFieldDisplayName (field) {
    return field.as || this.dictionary.getAttribute(LOCALE, field.name, field.name);
  }

  /**
   * Tests a single input value against a rule.
   *
   * @param  {Object} field The field under validation.
   * @param  {*} value  the value of the field.
   * @param  {object} rule the rule object.
   * @return {boolean} Whether it passes the check.
   */
  _test (field, value, rule) {
    const validator = Rules[rule.name];
    if (! validator || typeof validator !== 'function') {
      throw createError(`No such validator '${rule.name}' exists.`);
    }

    if (date.installed && this._isADateRule(rule.name)) {
      const dateFormat = this._getDateFormat(field.validations);
      rule.params = (Array.isArray(rule.params) ? toArray(rule.params) : []).concat([dateFormat]);
    }

    let result = validator(value, rule.params, field.name);

    // If it is a promise.
    if (isCallable(result.then)) {
      return result.then(values => {
        let allValid = true;
        let data = {};
        if (Array.isArray(values)) {
          allValid = values.every(t => (isObject(t) ? t.valid : t));
        } else { // Is a single object/boolean.
          allValid = isObject(values) ? values.valid : values;
          data = values.data;
        }

        if (! allValid) {
          this.errorBag.add(
            field.name,
            this._formatErrorMessage(field, rule, data),
            rule.name,
            field.scope
          );
        }

        return allValid;
      });
    }

    if (! isObject(result)) {
      result = { valid: result, data: {} };
    }

    if (! result.valid) {
      this.errorBag.add(
        field.name,
        this._formatErrorMessage(field, rule, result.data),
        rule.name,
        field.scope
      );
    }

    return result.valid;
  }

  /**
   * Adds an event listener for a specific field.
   * @param {String} name
   * @param {String} fieldName
   * @param {Function} callback
   */
  on (name, fieldName, scope, callback) {
    if (! fieldName) {
      throw createError(`Cannot add a listener for non-existent field ${fieldName}.`);
    }

    if (! isCallable(callback)) {
      throw createError(`The ${name} callback for field ${fieldName} is not callable.`);
    }

    this.$scopes[scope][fieldName].events[name] = callback;
  }

  /**
   * Removes the event listener for a specific field.
   * @param {String} name
   * @param {String} fieldName
   */
  off (name, fieldName, scope) {
    if (! fieldName) {
      warn(`Cannot remove a listener for non-existent field ${fieldName}.`);
    }

    this.$scopes[scope][fieldName].events[name] = undefined;
  }

  _assignFlags (field) {
    field.flags = {
      untouched: true,
      touched: false,
      dirty: false,
      pristine: true,
      valid: null,
      invalid: null,
      validated: false,
      required: field.required,
      pending: false
    };

    const flagObj = { [field.name]: field.flags };
    if (field.scope === '__global__') {
      this.fieldBag = assign({}, this.fieldBag, flagObj);
      return;
    }

    const scopeObj = assign({}, this.fieldBag[`$${field.scope}`], flagObj);

    this.fieldBag = assign({}, this.fieldBag, { [`$${field.scope}`]: scopeObj });
  }

  /**
   * Registers a field to be validated.
   *
   * @param  {string} name The field name.
   * @param  {String|Array|Object} checks validations expression.
   * @param {string} prettyName Custom name to be used as field name in error messages.
   * @param {Function} getter A function used to retrive a fresh value for the field.
   */
  attach (name, checks, options = {}) {
    options.scope = options.scope || '__global__';
    this.updateField(name, checks, options);
    const field = this.$scopes[options.scope][name];
    field.scope = options.scope;
    field.as = options.prettyName;
    field.getter = options.getter;
    field.invalidateFalse = options.invalidateFalse;
    field.context = options.context;
    field.listeners = options.listeners || { detach () {} };
    field.el = field.listeners.el;
    field.events = {};
    this._assignFlags(field);
    if (field.listeners.classes) {
      field.listeners.classes.attach(field);
    }
    this._setAriaRequiredAttribute(field);
    this._setAriaValidAttribute(field, true);

    // if initial modifier is applied, validate immediatly.
    if (options.initial) {
      this.validate(name, field.getter(field.context()), field.scope).catch(() => {});
    }
  }

  /**
   * Sets the flags on a field.
   *
   * @param {String} name
   * @param {Object} flags
   */
  flag (name, flags) {
    const field = this._resolveField(name);
    if (! field) {
      return;
    }

    Object.keys(field.flags).forEach(flag => {
      field.flags[flag] = flags[flag] !== undefined ? flags[flag] : field.flags[flag];
    });
    if (field.listeners && field.listeners.classes) {
      field.listeners.classes.sync();
    }
  }

  /**
   * Append another validation to an existing field.
   *
   * @param  {string} name The field name.
   * @param  {string} checks validations expression.
   */
  append (name, checks, options = {}) {
    options.scope = options.scope || '__global__';
    // No such field
    if (! this.$scopes[options.scope] || ! this.$scopes[options.scope][name]) {
      this.attach(name, checks, options);
    }

    const field = this.$scopes[options.scope][name];
    const newChecks = this._normalizeRules(name, checks, options.scope);
    Object.keys(newChecks).forEach(key => {
      field.validations[key] = newChecks[key];
    });
  }

  _moveFieldScope (field, scope) {
    if (!this.$scopes[scope]) {
      this.$scopes[scope] = {};
    }
    // move the field to its new scope.
    this.$scopes[scope][field.name] = field;
    delete this.$scopes[field.scope][field.name];
    field.scope = scope;
    // update cached scope.
    if (field.el && isCallable(field.el.setAttribute)) {
      field.el.setAttribute('data-vv-scope', field.scope);
    }
  }

  /**
   * Updates the field rules with new ones.
   */
  updateField (name, checks, options = {}) {
    let field = getPath(`${options.oldScope}.${name}`, this.$scopes, null);
    const oldChecks = field ? JSON.stringify(field.validations) : '';
    this._createField(name, checks, options.scope, field);
    field = getPath(`${options.scope}.${name}`, this.$scopes, null);
    const newChecks = field ? JSON.stringify(field.validations) : '';

    // compare both newChecks and oldChecks to make sure we don't trigger uneccessary directive
    // update by changing the errorBag (prevents infinite loops).
    if (newChecks !== oldChecks) {
      this.errorBag.remove(name, options.scope);
    }
  }

  /**
   * Clears the errors from the errorBag using the next tick if possible.
   */
  clean () {
    if (! this.$vm || ! isCallable(this.$vm.$nextTick)) {
      return;
    }

    this.$vm.$nextTick(() => {
      this.errorBag.clear();
    });
  }

  /**
   * Removes a field from the validator.
   *
   * @param  {String} name The name of the field.
   * @param {String} scope The name of the field scope.
   */
  detach (name, scope = '__global__') {
    // No such field.
    if (! this.$scopes[scope] || ! this.$scopes[scope][name]) {
      return;
    }

    if (this.$scopes[scope][name].listeners) {
      this.$scopes[scope][name].listeners.detach();
    }

    this.errorBag.remove(name, scope);
    delete this.$scopes[scope][name];
  }

  /**
   * Adds a custom validator to the list of validation rules.
   *
   * @param  {string} name The name of the validator.
   * @param  {object|function} validator The validator object/function.
   */
  extend (name, validator) {
    Validator.extend(name, validator);
  }

  /**
   * Gets the internal errorBag instance.
   *
   * @return {ErrorBag} errorBag The internal error bag object.
   */
  getErrors () {
    return this.errorBag;
  }

  /**
   * Just an alias to the static method for convienece.
   */
  installDateTimeValidators (moment) {
    Validator.installDateTimeValidators(moment);
  }

  /**
   * Removes a rule from the list of validators.
   * @param {String} name The name of the validator/rule.
   */
  remove (name) {
    Validator.remove(name);
  }

  /**
   * Sets the validator current langauge.
   *
   * @param {string} language locale or language id.
   */
  setLocale (language) {
    /* istanbul ignore if */
    if (! this.dictionary.hasLocale(language)) {
      // eslint-disable-next-line
      warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
    }

    LOCALE = language;
  }

  /**
   * Sets the operating mode for this validator.
   * strictMode = true: Values without a rule are invalid and cause failure.
   * strictMode = false: Values without a rule are valid and are skipped.
   * @param {Boolean} strictMode.
   */
  setStrictMode (strictMode = true) {
    this.strictMode = strictMode;
  }

  /**
   * Updates the messages dicitionary, overwriting existing values and adding new ones.
   *
   * @param  {object} data The messages object.
   */
  updateDictionary (data) {
    Validator.updateDictionary(data);
  }

  /**
   * Adds a scope.
   */
  addScope (scope) {
    if (scope && ! this.$scopes[scope]) {
      this.$scopes[scope] = {};
    }
  }

  _resolveField (name, scope) {
    if (name && name.indexOf('.') > -1) {
      // if no such field, try the scope form.
      if (! this.$scopes.__global__[name]) {
        [scope, name] = name.split('.');
      }
    }
    if (! scope) scope = '__global__';

    if (!this.$scopes[scope]) return null;

    return this.$scopes[scope][name];
  }

  _handleFieldNotFound (name, scope) {
    if (! this.strictMode) return Promise.resolve(true);

    const fullName = scope === '__global__' ? name : `${scope}.${name}`;
    throw createError(
      `Validating a non-existant field: "${fullName}". Use "attach()" first.`
    );
  }

  /**
   * Starts the validation process.
   *
   * @param {Object} field
   * @param {Promise} value
   */
  _validate (field, value) {
    if (! field.required && ~[null, undefined, ''].indexOf(value)) {
      return Promise.resolve(true);
    }

    const promises = [];
    let test = true;
    const syncResult = Object.keys(field.validations)[this.fastExit ? 'every' : 'some'](rule => {
      const result = this._test(
        field,
        value,
        { name: rule, params: field.validations[rule] }
      );

      if (isCallable(result.then)) {
        promises.push(result);
        return true;
      }

      test = test && result;
      return result;
    });

    return Promise.all(promises).then(values => {
      const valid = syncResult && test && values.every(t => t);

      return valid;
    });
  }

  /**
   * Validates a value against a registered field validations.
   *
   * @param  {string} name the field name.
   * @param  {*} value The value to be validated.
   * @param {String} scope The scope of the field.
   * @return {Promise}
   */
  validate (name, value, scope = '__global__') {
    if (this.paused) return Promise.resolve(true);

    const field = this._resolveField(name, scope);
    if (!field) {
      return this._handleFieldNotFound(name, scope);
    }
    this.errorBag.remove(field.name, field.scope);
    if (field.flags) {
      field.flags.pending = true;
    }

    return this._validate(field, value).then(result => {
      this._setAriaValidAttribute(field, result);
      if (field.flags) {
        field.flags.pending = false;
        field.flags.valid = result;
        field.flags.invalid = ! result;
        field.flags.pending = false;
        field.flags.validated = true;
      }
      if (field.events && isCallable(field.events.after)) {
        field.events.after({ valid: result });
      }
      return result;
    });
  }

  /**
   * Sets the aria-invalid attribute on the element.
   */
  _setAriaValidAttribute (field, valid) {
    if (! field.el || field.listeners.component) {
      return;
    }

    field.el.setAttribute('aria-invalid', !valid);
  }

  /**
   * Sets the aria-required attribute on the element.
   */
  _setAriaRequiredAttribute (field) {
    if (! field.el || field.listeners.component) {
      return;
    }

    field.el.setAttribute('aria-required', !! field.required);
  }

  /**
   * Pauses the validator.
   *
   * @return {Validator}
   */
  pause () {
    this.paused = true;

    return this;
  }

  /**
   * Resumes the validator.
   *
   * @return {Validator}
   */
  resume () {
    this.paused = false;

    return this;
  }

  /**
   * Validates each value against the corresponding field validations.
   * @param  {object} values The values to be validated.
   * @param  {String} scope The scope to be applied on validation.
   * @return {Promise} Returns a promise with the validation result.
   */
  validateAll (values, scope = '__global__') {
    if (this.paused) return Promise.resolve(true);

    let normalizedValues;
    if (! values || typeof values === 'string') {
      this.errorBag.clear(values);
      normalizedValues = this._resolveValuesFromGetters(values);
    } else {
      normalizedValues = {};
      Object.keys(values).forEach(key => {
        normalizedValues[key] = {
          value: values[key],
          scope
        };
      });
    }

    const promises = Object.keys(normalizedValues).map(property => this.validate(
      property,
      normalizedValues[property].value,
      normalizedValues[property].scope
    ));

    return Promise.all(promises).then(results => results.every(t => t));
  }

  /**
   * Validates all scopes.
   * @returns {Promise} All promises resulted from each scope.
   */
  validateScopes () {
    if (this.paused) return Promise.resolve(true);

    return Promise.all(
      Object.keys(this.$scopes).map(scope => this.validateAll(scope))
    ).then(results => results.every(t => t));
  }
}

var defaultOptions = {
  locale: 'en',
  delay: 0,
  errorBagName: 'errors',
  dictionary: null,
  strict: true,
  fieldsBagName: 'fields',
  enableAutoClasses: false,
  classNames: {},
  events: 'input|blur',
  inject: true,
  fastExit: true
};

const normalize = (fields) => {
  if (Array.isArray(fields)) {
    return fields.reduce((prev, curr) => {
      if (~curr.indexOf('.')) {
        prev[curr.split('.')[1]] = curr;
      } else {
        prev[curr] = curr;
      }

      return prev;
    }, {});
  }

  return fields;
};

/**
 * Maps fields to computed functions.
 *
 * @param {Array|Object} fields
 */
const mapFields = (fields) => {
  const normalized = normalize(fields);
  return Object.keys(normalized).reduce((prev, curr) => {
    const field = normalized[curr];
    prev[curr] = function mappedField () {
      if (this.$validator.fieldBag[field]) {
        return this.$validator.fieldBag[field];
      }

      const index = field.indexOf('.');
      if (index <= 0) {
        return {};
      }
      const [scope, name] = field.split('.');

      return getPath(`$${scope}.${name}`, this.$validator.fieldBag, {});
    };

    return prev;
  }, {});
};

// eslint-disable-next-line
const install = (options) => {
  const config = assign({}, defaultOptions, options);
  if (config.dictionary) {
    Validator.updateDictionary(config.dictionary);
  }

  Validator.setLocale(config.locale);
  Validator.setStrictMode(config.strict);
};

var index = {
  install,
  mapFields,
  Validator,
  ErrorBag,
  Rules,
  version: '2.0.0-rc.6'
};

export default index;
