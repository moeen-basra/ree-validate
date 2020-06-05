/**
  * ree-validate v3.3.0
  * (c) 2020 Moeen Basra
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ReeValidate = factory());
}(this, function () { 'use strict';

  function toInteger (dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN
    }

    var number = Number(dirtyNumber);

    if (isNaN(number)) {
      return number
    }

    return number < 0 ? Math.ceil(number) : Math.floor(number)
  }

  /**
   * @name toDate
   * @category Common Helpers
   * @summary Convert the given argument to an instance of Date.
   *
   * @description
   * Convert the given argument to an instance of Date.
   *
   * If the argument is an instance of Date, the function returns its clone.
   *
   * If the argument is a number, it is treated as a timestamp.
   *
   * If the argument is none of the above, the function returns Invalid Date.
   *
   * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
   *
   * @param {Date|Number} argument - the value to convert
   * @returns {Date} the parsed date in the local time zone
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // Clone the date:
   * var result = toDate(new Date(2014, 1, 11, 11, 30, 30))
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Convert the timestamp to date:
   * var result = toDate(1392098430000)
   * //=> Tue Feb 11 2014 11:30:30
   */
  function toDate(argument) {
    if (arguments.length < 1) {
      throw new TypeError(
        '1 argument required, but only ' + arguments.length + ' present'
      )
    }

    var argStr = Object.prototype.toString.call(argument);

    // Clone the date
    if (
      argument instanceof Date ||
      (typeof argument === 'object' && argStr === '[object Date]')
    ) {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      return new Date(argument.getTime())
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
      return new Date(argument)
    } else {
      if (
        (typeof argument === 'string' || argStr === '[object String]') &&
        typeof console !== 'undefined'
      ) {
        console.warn(
          "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fpAk2"
        );
        console.warn(new Error().stack);
      }
      return new Date(NaN)
    }
  }

  /**
   * @name addMilliseconds
   * @category Millisecond Helpers
   * @summary Add the specified number of milliseconds to the given date.
   *
   * @description
   * Add the specified number of milliseconds to the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of milliseconds to be added
   * @returns {Date} the new date with the milliseconds added
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
   * var result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
   * //=> Thu Jul 10 2014 12:45:30.750
   */
  function addMilliseconds(dirtyDate, dirtyAmount) {
    if (arguments.length < 2) {
      throw new TypeError(
        '2 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var timestamp = toDate(dirtyDate).getTime();
    var amount = toInteger(dirtyAmount);
    return new Date(timestamp + amount)
  }

  var MILLISECONDS_IN_MINUTE = 60000;

  /**
   * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
   * They usually appear for dates that denote time before the timezones were introduced
   * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
   * and GMT+01:00:00 after that date)
   *
   * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
   * which would lead to incorrect calculations.
   *
   * This function returns the timezone offset in milliseconds that takes seconds in account.
   */
  function getTimezoneOffsetInMilliseconds (dirtyDate) {
    var date = new Date(dirtyDate.getTime());
    var baseTimezoneOffset = date.getTimezoneOffset();
    date.setSeconds(0, 0);
    var millisecondsPartOfTimezoneOffset = date.getTime() % MILLISECONDS_IN_MINUTE;

    return baseTimezoneOffset * MILLISECONDS_IN_MINUTE + millisecondsPartOfTimezoneOffset
  }

  /**
   * @name isValid
   * @category Common Helpers
   * @summary Is the given date valid?
   *
   * @description
   * Returns false if argument is Invalid Date and true otherwise.
   * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
   * Invalid Date is a Date, whose time value is NaN.
   *
   * Time value of Date: http://es5.github.io/#x15.9.1.1
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * - Now `isValid` doesn't throw an exception
   *   if the first argument is not an instance of Date.
   *   Instead, argument is converted beforehand using `toDate`.
   *
   *   Examples:
   *
   *   | `isValid` argument        | Before v2.0.0 | v2.0.0 onward |
   *   |---------------------------|---------------|---------------|
   *   | `new Date()`              | `true`        | `true`        |
   *   | `new Date('2016-01-01')`  | `true`        | `true`        |
   *   | `new Date('')`            | `false`       | `false`       |
   *   | `new Date(1488370835081)` | `true`        | `true`        |
   *   | `new Date(NaN)`           | `false`       | `false`       |
   *   | `'2016-01-01'`            | `TypeError`   | `true`        |
   *   | `''`                      | `TypeError`   | `false`       |
   *   | `1488370835081`           | `TypeError`   | `true`        |
   *   | `NaN`                     | `TypeError`   | `false`       |
   *
   *   We introduce this change to make *date-fns* consistent with ECMAScript behavior
   *   that try to coerce arguments to the expected type
   *   (which is also the case with other *date-fns* functions).
   *
   * @param {*} date - the date to check
   * @returns {Boolean} the date is valid
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // For the valid date:
   * var result = isValid(new Date(2014, 1, 31))
   * //=> true
   *
   * @example
   * // For the value, convertable into a date:
   * var result = isValid(1393804800000)
   * //=> true
   *
   * @example
   * // For the invalid date:
   * var result = isValid(new Date(''))
   * //=> false
   */
  function isValid(dirtyDate) {
    if (arguments.length < 1) {
      throw new TypeError(
        '1 argument required, but only ' + arguments.length + ' present'
      )
    }

    var date = toDate(dirtyDate);
    return !isNaN(date)
  }

  var formatDistanceLocale = {
    lessThanXSeconds: {
      one: 'less than a second',
      other: 'less than {{count}} seconds'
    },

    xSeconds: {
      one: '1 second',
      other: '{{count}} seconds'
    },

    halfAMinute: 'half a minute',

    lessThanXMinutes: {
      one: 'less than a minute',
      other: 'less than {{count}} minutes'
    },

    xMinutes: {
      one: '1 minute',
      other: '{{count}} minutes'
    },

    aboutXHours: {
      one: 'about 1 hour',
      other: 'about {{count}} hours'
    },

    xHours: {
      one: '1 hour',
      other: '{{count}} hours'
    },

    xDays: {
      one: '1 day',
      other: '{{count}} days'
    },

    aboutXMonths: {
      one: 'about 1 month',
      other: 'about {{count}} months'
    },

    xMonths: {
      one: '1 month',
      other: '{{count}} months'
    },

    aboutXYears: {
      one: 'about 1 year',
      other: 'about {{count}} years'
    },

    xYears: {
      one: '1 year',
      other: '{{count}} years'
    },

    overXYears: {
      one: 'over 1 year',
      other: 'over {{count}} years'
    },

    almostXYears: {
      one: 'almost 1 year',
      other: 'almost {{count}} years'
    }
  };

  function formatDistance (token, count, options) {
    options = options || {};

    var result;
    if (typeof formatDistanceLocale[token] === 'string') {
      result = formatDistanceLocale[token];
    } else if (count === 1) {
      result = formatDistanceLocale[token].one;
    } else {
      result = formatDistanceLocale[token].other.replace('{{count}}', count);
    }

    if (options.addSuffix) {
      if (options.comparison > 0) {
        return 'in ' + result
      } else {
        return result + ' ago'
      }
    }

    return result
  }

  function buildFormatLongFn (args) {
    return function (dirtyOptions) {
      var options = dirtyOptions || {};
      var width = options.width ? String(options.width) : args.defaultWidth;
      var format = args.formats[width] || args.formats[args.defaultWidth];
      return format
    }
  }

  var dateFormats = {
    full: 'EEEE, MMMM do, y',
    long: 'MMMM do, y',
    medium: 'MMM d, y',
    short: 'MM/dd/yyyy'
  };

  var timeFormats = {
    full: 'h:mm:ss a zzzz',
    long: 'h:mm:ss a z',
    medium: 'h:mm:ss a',
    short: 'h:mm a'
  };

  var dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: '{{date}}, {{time}}',
    short: '{{date}}, {{time}}'
  };

  var formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: 'full'
    }),

    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: 'full'
    }),

    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: 'full'
    })
  };

  var formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: 'P'
  };

  function formatRelative (token, date, baseDate, options) {
    return formatRelativeLocale[token]
  }

  function buildLocalizeFn (args) {
    return function (dirtyIndex, dirtyOptions) {
      var options = dirtyOptions || {};
      var width = options.width ? String(options.width) : args.defaultWidth;
      var context = options.context ? String(options.context) : 'standalone';

      var valuesArray;
      if (context === 'formatting' && args.formattingValues) {
        valuesArray = args.formattingValues[width] || args.formattingValues[args.defaultFormattingWidth];
      } else {
        valuesArray = args.values[width] || args.values[args.defaultWidth];
      }
      var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
      return valuesArray[index]
    }
  }

  var eraValues = {
    narrow: ['B', 'A'],
    abbreviated: ['BC', 'AD'],
    wide: ['Before Christ', 'Anno Domini']
  };

  var quarterValues = {
    narrow: ['1', '2', '3', '4'],
    abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
    wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter']
  };

  // Note: in English, the names of days of the week and months are capitalized.
  // If you are making a new locale based on this one, check if the same is true for the language you're working on.
  // Generally, formatted dates should look like they are in the middle of a sentence,
  // e.g. in Spanish language the weekdays and months should be in the lowercase.
  var monthValues = {
    narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  var dayValues = {
    narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };

  var dayPeriodValues = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night'
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night'
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
      night: 'night'
    }
  };
  var formattingDayPeriodValues = {
    narrow: {
      am: 'a',
      pm: 'p',
      midnight: 'mi',
      noon: 'n',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night'
    },
    abbreviated: {
      am: 'AM',
      pm: 'PM',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night'
    },
    wide: {
      am: 'a.m.',
      pm: 'p.m.',
      midnight: 'midnight',
      noon: 'noon',
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night'
    }
  };

  function ordinalNumber (dirtyNumber, dirtyOptions) {
    var number = Number(dirtyNumber);

    // If ordinal numbers depend on context, for example,
    // if they are different for different grammatical genders,
    // use `options.unit`:
    //
    //   var options = dirtyOptions || {}
    //   var unit = String(options.unit)
    //
    // where `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
    // 'day', 'hour', 'minute', 'second'

    var rem100 = number % 100;
    if (rem100 > 20 || rem100 < 10) {
      switch (rem100 % 10) {
        case 1:
          return number + 'st'
        case 2:
          return number + 'nd'
        case 3:
          return number + 'rd'
      }
    }
    return number + 'th'
  }

  var localize = {
    ordinalNumber: ordinalNumber,

    era: buildLocalizeFn({
      values: eraValues,
      defaultWidth: 'wide'
    }),

    quarter: buildLocalizeFn({
      values: quarterValues,
      defaultWidth: 'wide',
      argumentCallback: function (quarter) {
        return Number(quarter) - 1
      }
    }),

    month: buildLocalizeFn({
      values: monthValues,
      defaultWidth: 'wide'
    }),

    day: buildLocalizeFn({
      values: dayValues,
      defaultWidth: 'wide'
    }),

    dayPeriod: buildLocalizeFn({
      values: dayPeriodValues,
      defaultWidth: 'wide',
      formattingValues: formattingDayPeriodValues,
      defaultFormattingWidth: 'wide'
    })
  };

  function buildMatchPatternFn (args) {
    return function (dirtyString, dirtyOptions) {
      var string = String(dirtyString);
      var options = dirtyOptions || {};

      var matchResult = string.match(args.matchPattern);
      if (!matchResult) {
        return null
      }
      var matchedString = matchResult[0];

      var parseResult = string.match(args.parsePattern);
      if (!parseResult) {
        return null
      }
      var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
      value = options.valueCallback ? options.valueCallback(value) : value;

      return {
        value: value,
        rest: string.slice(matchedString.length)
      }
    }
  }

  function buildMatchFn (args) {
    return function (dirtyString, dirtyOptions) {
      var string = String(dirtyString);
      var options = dirtyOptions || {};
      var width = options.width;

      var matchPattern = (width && args.matchPatterns[width]) || args.matchPatterns[args.defaultMatchWidth];
      var matchResult = string.match(matchPattern);

      if (!matchResult) {
        return null
      }
      var matchedString = matchResult[0];

      var parsePatterns = (width && args.parsePatterns[width]) || args.parsePatterns[args.defaultParseWidth];

      var value;
      if (Object.prototype.toString.call(parsePatterns) === '[object Array]') {
        value = parsePatterns.findIndex(function (pattern) {
          return pattern.test(string)
        });
      } else {
        value = findKey(parsePatterns, function (pattern) {
          return pattern.test(string)
        });
      }

      value = args.valueCallback ? args.valueCallback(value) : value;
      value = options.valueCallback ? options.valueCallback(value) : value;

      return {
        value: value,
        rest: string.slice(matchedString.length)
      }
    }
  }

  function findKey (object, predicate) {
    for (var key in object) {
      if (object.hasOwnProperty(key) && predicate(object[key])) {
        return key
      }
    }
  }

  var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
  var parseOrdinalNumberPattern = /\d+/i;

  var matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i
  };
  var parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i]
  };

  var matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i
  };
  var parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i]
  };

  var matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
  };
  var parseMonthPatterns = {
    narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
    any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
  };

  var matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
  };
  var parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
  };

  var matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
  };
  var parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i
    }
  };

  var match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: function (value) {
        return parseInt(value, 10)
      }
    }),

    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseEraPatterns,
      defaultParseWidth: 'any'
    }),

    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: 'any',
      valueCallback: function (index) {
        return index + 1
      }
    }),

    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: 'any'
    }),

    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: 'wide',
      parsePatterns: parseDayPatterns,
      defaultParseWidth: 'any'
    }),

    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: 'any',
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: 'any'
    })
  };

  /**
   * @type {Locale}
   * @category Locales
   * @summary English locale (United States).
   * @language English
   * @iso-639-2 eng
   * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
   * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
   */
  var locale = {
    formatDistance: formatDistance,
    formatLong: formatLong,
    formatRelative: formatRelative,
    localize: localize,
    match: match,
    options: {
      weekStartsOn: 0 /* Sunday */,
      firstWeekContainsDate: 1
    }
  };

  function addLeadingZeros(number, targetLength) {
    var sign = number < 0 ? '-' : '';
    var output = Math.abs(number).toString();
    while (output.length < targetLength) {
      output = '0' + output;
    }
    return sign + output
  }

  /*
   * |     | Unit                           |     | Unit                           |
   * |-----|--------------------------------|-----|--------------------------------|
   * |  a  | AM, PM                         |  A* | Milliseconds in day            |
   * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
   * |  d  | Day of month                   |  D  | Day of year                    |
   * |  e  | Local day of week              |  E  | Day of week                    |
   * |  f  |                                |  F* | Day of week in month           |
   * |  g* | Modified Julian day            |  G  | Era                            |
   * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
   * |  i! | ISO day of week                |  I! | ISO week of year               |
   * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
   * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
   * |  l* | (deprecated)                   |  L  | Stand-alone month              |
   * |  m  | Minute                         |  M  | Month                          |
   * |  n  |                                |  N  |                                |
   * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
   * |  p! | Long localized time            |  P! | Long localized date            |
   * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
   * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
   * |  s  | Second                         |  S  | Fraction of second             |
   * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
   * |  u  | Extended year                  |  U* | Cyclic year                    |
   * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
   * |  w  | Local week of year             |  W* | Week of month                  |
   * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
   * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
   * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
   *
   * Letters marked by * are not implemented but reserved by Unicode standard.
   *
   * Letters marked by ! are non-standard, but implemented by date-fns:
   * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
   * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
   *   i.e. 7 for Sunday, 1 for Monday, etc.
   * - `I` is ISO week of year, as opposed to `w` which is local week of year.
   * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
   *   `R` is supposed to be used in conjunction with `I` and `i`
   *   for universal ISO week-numbering date, whereas
   *   `Y` is supposed to be used in conjunction with `w` and `e`
   *   for week-numbering date specific to the locale.
   * - `P` is long localized date format
   * - `p` is long localized time format
   */

  var formatters = {
    // Year
    y: function(date, token) {
      // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
      // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
      // |----------|-------|----|-------|-------|-------|
      // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
      // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
      // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
      // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
      // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |

      var signedYear = date.getUTCFullYear();
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length)
    },

    // Month
    M: function(date, token) {
      var month = date.getUTCMonth();
      return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2)
    },

    // Day of the month
    d: function(date, token) {
      return addLeadingZeros(date.getUTCDate(), token.length)
    },

    // AM or PM
    a: function(date, token) {
      var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am';

      switch (token) {
        case 'a':
        case 'aa':
        case 'aaa':
          return dayPeriodEnumValue.toUpperCase()
        case 'aaaaa':
          return dayPeriodEnumValue[0]
        case 'aaaa':
        default:
          return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.'
      }
    },

    // Hour [1-12]
    h: function(date, token) {
      return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length)
    },

    // Hour [0-23]
    H: function(date, token) {
      return addLeadingZeros(date.getUTCHours(), token.length)
    },

    // Minute
    m: function(date, token) {
      return addLeadingZeros(date.getUTCMinutes(), token.length)
    },

    // Second
    s: function(date, token) {
      return addLeadingZeros(date.getUTCSeconds(), token.length)
    }
  };

  var MILLISECONDS_IN_DAY = 86400000;

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function getUTCDayOfYear(dirtyDate) {
    if (arguments.length < 1) {
      throw new TypeError(
        '1 argument required, but only ' + arguments.length + ' present'
      )
    }

    var date = toDate(dirtyDate);
    var timestamp = date.getTime();
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
    var startOfYearTimestamp = date.getTime();
    var difference = timestamp - startOfYearTimestamp;
    return Math.floor(difference / MILLISECONDS_IN_DAY) + 1
  }

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function startOfUTCISOWeek(dirtyDate) {
    if (arguments.length < 1) {
      throw new TypeError(
        '1 argument required, but only ' + arguments.length + ' present'
      )
    }

    var weekStartsOn = 1;

    var date = toDate(dirtyDate);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date
  }

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function getUTCISOWeekYear(dirtyDate) {
    if (arguments.length < 1) {
      throw new TypeError(
        '1 argument required, but only ' + arguments.length + ' present'
      )
    }

    var date = toDate(dirtyDate);
    var year = date.getUTCFullYear();

    var fourthOfJanuaryOfNextYear = new Date(0);
    fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
    fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);

    var fourthOfJanuaryOfThisYear = new Date(0);
    fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
    fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);

    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year
    } else {
      return year - 1
    }
  }

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function startOfUTCISOWeekYear(dirtyDate) {
    if (arguments.length < 1) {
      throw new TypeError(
        '1 argument required, but only ' + arguments.length + ' present'
      )
    }

    var year = getUTCISOWeekYear(dirtyDate);
    var fourthOfJanuary = new Date(0);
    fourthOfJanuary.setUTCFullYear(year, 0, 4);
    fourthOfJanuary.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCISOWeek(fourthOfJanuary);
    return date
  }

  var MILLISECONDS_IN_WEEK = 604800000;

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function getUTCISOWeek(dirtyDate) {
    if (arguments.length < 1) {
      throw new TypeError(
        '1 argument required, but only ' + arguments.length + ' present'
      )
    }

    var date = toDate(dirtyDate);
    var diff =
      startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();

    // Round the number of days to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)
    return Math.round(diff / MILLISECONDS_IN_WEEK) + 1
  }

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function startOfUTCWeek(dirtyDate, dirtyOptions) {
    if (arguments.length < 1) {
      throw new TypeError(
        '1 argument required, but only ' + arguments.length + ' present'
      )
    }

    var options = dirtyOptions || {};
    var locale = options.locale;
    var localeWeekStartsOn =
      locale && locale.options && locale.options.weekStartsOn;
    var defaultWeekStartsOn =
      localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn =
      options.weekStartsOn == null
        ? defaultWeekStartsOn
        : toInteger(options.weekStartsOn);

    // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError('weekStartsOn must be between 0 and 6 inclusively')
    }

    var date = toDate(dirtyDate);
    var day = date.getUTCDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

    date.setUTCDate(date.getUTCDate() - diff);
    date.setUTCHours(0, 0, 0, 0);
    return date
  }

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function getUTCWeekYear (dirtyDate, dirtyOptions) {
    if (arguments.length < 1) {
      throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
    }

    var date = toDate(dirtyDate, dirtyOptions);
    var year = date.getUTCFullYear();

    var options = dirtyOptions || {};
    var locale = options.locale;
    var localeFirstWeekContainsDate = locale &&
      locale.options &&
      locale.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate =
      localeFirstWeekContainsDate == null
        ? 1
        : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate =
      options.firstWeekContainsDate == null
        ? defaultFirstWeekContainsDate
        : toInteger(options.firstWeekContainsDate);

    // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively')
    }

    var firstWeekOfNextYear = new Date(0);
    firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
    firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
    var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, dirtyOptions);

    var firstWeekOfThisYear = new Date(0);
    firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
    firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
    var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, dirtyOptions);

    if (date.getTime() >= startOfNextYear.getTime()) {
      return year + 1
    } else if (date.getTime() >= startOfThisYear.getTime()) {
      return year
    } else {
      return year - 1
    }
  }

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function startOfUTCWeekYear (dirtyDate, dirtyOptions) {
    if (arguments.length < 1) {
      throw new TypeError('1 argument required, but only ' + arguments.length + ' present')
    }

    var options = dirtyOptions || {};
    var locale = options.locale;
    var localeFirstWeekContainsDate = locale &&
      locale.options &&
      locale.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate =
      localeFirstWeekContainsDate == null
        ? 1
        : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate =
      options.firstWeekContainsDate == null
        ? defaultFirstWeekContainsDate
        : toInteger(options.firstWeekContainsDate);

    var year = getUTCWeekYear(dirtyDate, dirtyOptions);
    var firstWeek = new Date(0);
    firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
    firstWeek.setUTCHours(0, 0, 0, 0);
    var date = startOfUTCWeek(firstWeek, dirtyOptions);
    return date
  }

  var MILLISECONDS_IN_WEEK$1 = 604800000;

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function getUTCWeek(dirtyDate, options) {
    if (arguments.length < 1) {
      throw new TypeError(
        '1 argument required, but only ' + arguments.length + ' present'
      )
    }

    var date = toDate(dirtyDate);
    var diff =
      startOfUTCWeek(date, options).getTime() -
      startOfUTCWeekYear(date, options).getTime();

    // Round the number of days to the nearest integer
    // because the number of milliseconds in a week is not constant
    // (e.g. it's different in the week of the daylight saving time clock shift)
    return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1
  }

  var dayPeriodEnum = {
    am: 'am',
    pm: 'pm',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  };

  /*
   * |     | Unit                           |     | Unit                           |
   * |-----|--------------------------------|-----|--------------------------------|
   * |  a  | AM, PM                         |  A* | Milliseconds in day            |
   * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
   * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
   * |  d  | Day of month                   |  D  | Day of year                    |
   * |  e  | Local day of week              |  E  | Day of week                    |
   * |  f  |                                |  F* | Day of week in month           |
   * |  g* | Modified Julian day            |  G  | Era                            |
   * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
   * |  i! | ISO day of week                |  I! | ISO week of year               |
   * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
   * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
   * |  l* | (deprecated)                   |  L  | Stand-alone month              |
   * |  m  | Minute                         |  M  | Month                          |
   * |  n  |                                |  N  |                                |
   * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
   * |  p! | Long localized time            |  P! | Long localized date            |
   * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
   * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
   * |  s  | Second                         |  S  | Fraction of second             |
   * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
   * |  u  | Extended year                  |  U* | Cyclic year                    |
   * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
   * |  w  | Local week of year             |  W* | Week of month                  |
   * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
   * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
   * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
   *
   * Letters marked by * are not implemented but reserved by Unicode standard.
   *
   * Letters marked by ! are non-standard, but implemented by date-fns:
   * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
   * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
   *   i.e. 7 for Sunday, 1 for Monday, etc.
   * - `I` is ISO week of year, as opposed to `w` which is local week of year.
   * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
   *   `R` is supposed to be used in conjunction with `I` and `i`
   *   for universal ISO week-numbering date, whereas
   *   `Y` is supposed to be used in conjunction with `w` and `e`
   *   for week-numbering date specific to the locale.
   * - `P` is long localized date format
   * - `p` is long localized time format
   */

  var formatters$1 = {
    // Era
    G: function(date, token, localize) {
      var era = date.getUTCFullYear() > 0 ? 1 : 0;
      switch (token) {
        // AD, BC
        case 'G':
        case 'GG':
        case 'GGG':
          return localize.era(era, { width: 'abbreviated' })
        // A, B
        case 'GGGGG':
          return localize.era(era, { width: 'narrow' })
        // Anno Domini, Before Christ
        case 'GGGG':
        default:
          return localize.era(era, { width: 'wide' })
      }
    },

    // Year
    y: function(date, token, localize) {
      // Ordinal number
      if (token === 'yo') {
        var signedYear = date.getUTCFullYear();
        // Returns 1 for 1 BC (which is year 0 in JavaScript)
        var year = signedYear > 0 ? signedYear : 1 - signedYear;
        return localize.ordinalNumber(year, { unit: 'year' })
      }

      return formatters.y(date, token)
    },

    // Local week-numbering year
    Y: function(date, token, localize, options) {
      var signedWeekYear = getUTCWeekYear(date, options);
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;

      // Two digit year
      if (token === 'YY') {
        var twoDigitYear = weekYear % 100;
        return addLeadingZeros(twoDigitYear, 2)
      }

      // Ordinal number
      if (token === 'Yo') {
        return localize.ordinalNumber(weekYear, { unit: 'year' })
      }

      // Padding
      return addLeadingZeros(weekYear, token.length)
    },

    // ISO week-numbering year
    R: function(date, token) {
      var isoWeekYear = getUTCISOWeekYear(date);

      // Padding
      return addLeadingZeros(isoWeekYear, token.length)
    },

    // Extended year. This is a single number designating the year of this calendar system.
    // The main difference between `y` and `u` localizers are B.C. years:
    // | Year | `y` | `u` |
    // |------|-----|-----|
    // | AC 1 |   1 |   1 |
    // | BC 1 |   1 |   0 |
    // | BC 2 |   2 |  -1 |
    // Also `yy` always returns the last two digits of a year,
    // while `uu` pads single digit years to 2 characters and returns other years unchanged.
    u: function(date, token) {
      var year = date.getUTCFullYear();
      return addLeadingZeros(year, token.length)
    },

    // Quarter
    Q: function(date, token, localize) {
      var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
      switch (token) {
        // 1, 2, 3, 4
        case 'Q':
          return String(quarter)
        // 01, 02, 03, 04
        case 'QQ':
          return addLeadingZeros(quarter, 2)
        // 1st, 2nd, 3rd, 4th
        case 'Qo':
          return localize.ordinalNumber(quarter, { unit: 'quarter' })
        // Q1, Q2, Q3, Q4
        case 'QQQ':
          return localize.quarter(quarter, {
            width: 'abbreviated',
            context: 'formatting'
          })
        // 1, 2, 3, 4 (narrow quarter; could be not numerical)
        case 'QQQQQ':
          return localize.quarter(quarter, {
            width: 'narrow',
            context: 'formatting'
          })
        // 1st quarter, 2nd quarter, ...
        case 'QQQQ':
        default:
          return localize.quarter(quarter, {
            width: 'wide',
            context: 'formatting'
          })
      }
    },

    // Stand-alone quarter
    q: function(date, token, localize) {
      var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
      switch (token) {
        // 1, 2, 3, 4
        case 'q':
          return String(quarter)
        // 01, 02, 03, 04
        case 'qq':
          return addLeadingZeros(quarter, 2)
        // 1st, 2nd, 3rd, 4th
        case 'qo':
          return localize.ordinalNumber(quarter, { unit: 'quarter' })
        // Q1, Q2, Q3, Q4
        case 'qqq':
          return localize.quarter(quarter, {
            width: 'abbreviated',
            context: 'standalone'
          })
        // 1, 2, 3, 4 (narrow quarter; could be not numerical)
        case 'qqqqq':
          return localize.quarter(quarter, {
            width: 'narrow',
            context: 'standalone'
          })
        // 1st quarter, 2nd quarter, ...
        case 'qqqq':
        default:
          return localize.quarter(quarter, {
            width: 'wide',
            context: 'standalone'
          })
      }
    },

    // Month
    M: function(date, token, localize) {
      var month = date.getUTCMonth();
      switch (token) {
        case 'M':
        case 'MM':
          return formatters.M(date, token)
        // 1st, 2nd, ..., 12th
        case 'Mo':
          return localize.ordinalNumber(month + 1, { unit: 'month' })
        // Jan, Feb, ..., Dec
        case 'MMM':
          return localize.month(month, {
            width: 'abbreviated',
            context: 'formatting'
          })
        // J, F, ..., D
        case 'MMMMM':
          return localize.month(month, { width: 'narrow', context: 'formatting' })
        // January, February, ..., December
        case 'MMMM':
        default:
          return localize.month(month, { width: 'wide', context: 'formatting' })
      }
    },

    // Stand-alone month
    L: function(date, token, localize) {
      var month = date.getUTCMonth();
      switch (token) {
        // 1, 2, ..., 12
        case 'L':
          return String(month + 1)
        // 01, 02, ..., 12
        case 'LL':
          return addLeadingZeros(month + 1, 2)
        // 1st, 2nd, ..., 12th
        case 'Lo':
          return localize.ordinalNumber(month + 1, { unit: 'month' })
        // Jan, Feb, ..., Dec
        case 'LLL':
          return localize.month(month, {
            width: 'abbreviated',
            context: 'standalone'
          })
        // J, F, ..., D
        case 'LLLLL':
          return localize.month(month, { width: 'narrow', context: 'standalone' })
        // January, February, ..., December
        case 'LLLL':
        default:
          return localize.month(month, { width: 'wide', context: 'standalone' })
      }
    },

    // Local week of year
    w: function(date, token, localize, options) {
      var week = getUTCWeek(date, options);

      if (token === 'wo') {
        return localize.ordinalNumber(week, { unit: 'week' })
      }

      return addLeadingZeros(week, token.length)
    },

    // ISO week of year
    I: function(date, token, localize) {
      var isoWeek = getUTCISOWeek(date);

      if (token === 'Io') {
        return localize.ordinalNumber(isoWeek, { unit: 'week' })
      }

      return addLeadingZeros(isoWeek, token.length)
    },

    // Day of the month
    d: function(date, token, localize) {
      if (token === 'do') {
        return localize.ordinalNumber(date.getUTCDate(), { unit: 'date' })
      }

      return formatters.d(date, token)
    },

    // Day of year
    D: function(date, token, localize) {
      var dayOfYear = getUTCDayOfYear(date);

      if (token === 'Do') {
        return localize.ordinalNumber(dayOfYear, { unit: 'dayOfYear' })
      }

      return addLeadingZeros(dayOfYear, token.length)
    },

    // Day of week
    E: function(date, token, localize) {
      var dayOfWeek = date.getUTCDay();
      switch (token) {
        // Tue
        case 'E':
        case 'EE':
        case 'EEE':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting'
          })
        // T
        case 'EEEEE':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting'
          })
        // Tu
        case 'EEEEEE':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'formatting'
          })
        // Tuesday
        case 'EEEE':
        default:
          return localize.day(dayOfWeek, { width: 'wide', context: 'formatting' })
      }
    },

    // Local day of week
    e: function(date, token, localize, options) {
      var dayOfWeek = date.getUTCDay();
      var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        // Numerical value (Nth day of week with current locale or weekStartsOn)
        case 'e':
          return String(localDayOfWeek)
        // Padded numerical value
        case 'ee':
          return addLeadingZeros(localDayOfWeek, 2)
        // 1st, 2nd, ..., 7th
        case 'eo':
          return localize.ordinalNumber(localDayOfWeek, { unit: 'day' })
        case 'eee':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting'
          })
        // T
        case 'eeeee':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting'
          })
        // Tu
        case 'eeeeee':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'formatting'
          })
        // Tuesday
        case 'eeee':
        default:
          return localize.day(dayOfWeek, { width: 'wide', context: 'formatting' })
      }
    },

    // Stand-alone local day of week
    c: function(date, token, localize, options) {
      var dayOfWeek = date.getUTCDay();
      var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
      switch (token) {
        // Numerical value (same as in `e`)
        case 'c':
          return String(localDayOfWeek)
        // Padded numerical value
        case 'cc':
          return addLeadingZeros(localDayOfWeek, token.length)
        // 1st, 2nd, ..., 7th
        case 'co':
          return localize.ordinalNumber(localDayOfWeek, { unit: 'day' })
        case 'ccc':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'standalone'
          })
        // T
        case 'ccccc':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'standalone'
          })
        // Tu
        case 'cccccc':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'standalone'
          })
        // Tuesday
        case 'cccc':
        default:
          return localize.day(dayOfWeek, { width: 'wide', context: 'standalone' })
      }
    },

    // ISO day of week
    i: function(date, token, localize) {
      var dayOfWeek = date.getUTCDay();
      var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
      switch (token) {
        // 2
        case 'i':
          return String(isoDayOfWeek)
        // 02
        case 'ii':
          return addLeadingZeros(isoDayOfWeek, token.length)
        // 2nd
        case 'io':
          return localize.ordinalNumber(isoDayOfWeek, { unit: 'day' })
        // Tue
        case 'iii':
          return localize.day(dayOfWeek, {
            width: 'abbreviated',
            context: 'formatting'
          })
        // T
        case 'iiiii':
          return localize.day(dayOfWeek, {
            width: 'narrow',
            context: 'formatting'
          })
        // Tu
        case 'iiiiii':
          return localize.day(dayOfWeek, {
            width: 'short',
            context: 'formatting'
          })
        // Tuesday
        case 'iiii':
        default:
          return localize.day(dayOfWeek, { width: 'wide', context: 'formatting' })
      }
    },

    // AM or PM
    a: function(date, token, localize) {
      var hours = date.getUTCHours();
      var dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';

      switch (token) {
        case 'a':
        case 'aa':
        case 'aaa':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting'
          })
        case 'aaaaa':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting'
          })
        case 'aaaa':
        default:
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting'
          })
      }
    },

    // AM, PM, midnight, noon
    b: function(date, token, localize) {
      var hours = date.getUTCHours();
      var dayPeriodEnumValue;
      if (hours === 12) {
        dayPeriodEnumValue = dayPeriodEnum.noon;
      } else if (hours === 0) {
        dayPeriodEnumValue = dayPeriodEnum.midnight;
      } else {
        dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
      }

      switch (token) {
        case 'b':
        case 'bb':
        case 'bbb':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting'
          })
        case 'bbbbb':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting'
          })
        case 'bbbb':
        default:
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting'
          })
      }
    },

    // in the morning, in the afternoon, in the evening, at night
    B: function(date, token, localize) {
      var hours = date.getUTCHours();
      var dayPeriodEnumValue;
      if (hours >= 17) {
        dayPeriodEnumValue = dayPeriodEnum.evening;
      } else if (hours >= 12) {
        dayPeriodEnumValue = dayPeriodEnum.afternoon;
      } else if (hours >= 4) {
        dayPeriodEnumValue = dayPeriodEnum.morning;
      } else {
        dayPeriodEnumValue = dayPeriodEnum.night;
      }

      switch (token) {
        case 'B':
        case 'BB':
        case 'BBB':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'abbreviated',
            context: 'formatting'
          })
        case 'BBBBB':
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'narrow',
            context: 'formatting'
          })
        case 'BBBB':
        default:
          return localize.dayPeriod(dayPeriodEnumValue, {
            width: 'wide',
            context: 'formatting'
          })
      }
    },

    // Hour [1-12]
    h: function(date, token, localize) {
      if (token === 'ho') {
        var hours = date.getUTCHours() % 12;
        if (hours === 0) { hours = 12; }
        return localize.ordinalNumber(hours, { unit: 'hour' })
      }

      return formatters.h(date, token)
    },

    // Hour [0-23]
    H: function(date, token, localize) {
      if (token === 'Ho') {
        return localize.ordinalNumber(date.getUTCHours(), { unit: 'hour' })
      }

      return formatters.H(date, token)
    },

    // Hour [0-11]
    K: function(date, token, localize) {
      var hours = date.getUTCHours() % 12;

      if (token === 'Ko') {
        return localize.ordinalNumber(hours, { unit: 'hour' })
      }

      return addLeadingZeros(hours, token.length)
    },

    // Hour [1-24]
    k: function(date, token, localize) {
      var hours = date.getUTCHours();
      if (hours === 0) { hours = 24; }

      if (token === 'ko') {
        return localize.ordinalNumber(hours, { unit: 'hour' })
      }

      return addLeadingZeros(hours, token.length)
    },

    // Minute
    m: function(date, token, localize) {
      if (token === 'mo') {
        return localize.ordinalNumber(date.getUTCMinutes(), { unit: 'minute' })
      }

      return formatters.m(date, token)
    },

    // Second
    s: function(date, token, localize) {
      if (token === 'so') {
        return localize.ordinalNumber(date.getUTCSeconds(), { unit: 'second' })
      }

      return formatters.s(date, token)
    },

    // Fraction of second
    S: function(date, token) {
      var numberOfDigits = token.length;
      var milliseconds = date.getUTCMilliseconds();
      var fractionalSeconds = Math.floor(
        milliseconds * Math.pow(10, numberOfDigits - 3)
      );
      return addLeadingZeros(fractionalSeconds, numberOfDigits)
    },

    // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
    X: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();

      if (timezoneOffset === 0) {
        return 'Z'
      }

      switch (token) {
        // Hours and optional minutes
        case 'X':
          return formatTimezoneWithOptionalMinutes(timezoneOffset)

        // Hours, minutes and optional seconds without `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `XX`
        case 'XXXX':
        case 'XX': // Hours and minutes without `:` delimiter
          return formatTimezone(timezoneOffset)

        // Hours, minutes and optional seconds with `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `XXX`
        case 'XXXXX':
        case 'XXX': // Hours and minutes with `:` delimiter
        default:
          return formatTimezone(timezoneOffset, ':')
      }
    },

    // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
    x: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();

      switch (token) {
        // Hours and optional minutes
        case 'x':
          return formatTimezoneWithOptionalMinutes(timezoneOffset)

        // Hours, minutes and optional seconds without `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `xx`
        case 'xxxx':
        case 'xx': // Hours and minutes without `:` delimiter
          return formatTimezone(timezoneOffset)

        // Hours, minutes and optional seconds with `:` delimiter
        // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
        // so this token always has the same output as `xxx`
        case 'xxxxx':
        case 'xxx': // Hours and minutes with `:` delimiter
        default:
          return formatTimezone(timezoneOffset, ':')
      }
    },

    // Timezone (GMT)
    O: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();

      switch (token) {
        // Short
        case 'O':
        case 'OO':
        case 'OOO':
          return 'GMT' + formatTimezoneShort(timezoneOffset, ':')
        // Long
        case 'OOOO':
        default:
          return 'GMT' + formatTimezone(timezoneOffset, ':')
      }
    },

    // Timezone (specific non-location)
    z: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timezoneOffset = originalDate.getTimezoneOffset();

      switch (token) {
        // Short
        case 'z':
        case 'zz':
        case 'zzz':
          return 'GMT' + formatTimezoneShort(timezoneOffset, ':')
        // Long
        case 'zzzz':
        default:
          return 'GMT' + formatTimezone(timezoneOffset, ':')
      }
    },

    // Seconds timestamp
    t: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timestamp = Math.floor(originalDate.getTime() / 1000);
      return addLeadingZeros(timestamp, token.length)
    },

    // Milliseconds timestamp
    T: function(date, token, _localize, options) {
      var originalDate = options._originalDate || date;
      var timestamp = originalDate.getTime();
      return addLeadingZeros(timestamp, token.length)
    }
  };

  function formatTimezoneShort(offset, dirtyDelimiter) {
    var sign = offset > 0 ? '-' : '+';
    var absOffset = Math.abs(offset);
    var hours = Math.floor(absOffset / 60);
    var minutes = absOffset % 60;
    if (minutes === 0) {
      return sign + String(hours)
    }
    var delimiter = dirtyDelimiter || '';
    return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2)
  }

  function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
    if (offset % 60 === 0) {
      var sign = offset > 0 ? '-' : '+';
      return sign + addLeadingZeros(Math.abs(offset) / 60, 2)
    }
    return formatTimezone(offset, dirtyDelimiter)
  }

  function formatTimezone(offset, dirtyDelimiter) {
    var delimiter = dirtyDelimiter || '';
    var sign = offset > 0 ? '-' : '+';
    var absOffset = Math.abs(offset);
    var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
    var minutes = addLeadingZeros(absOffset % 60, 2);
    return sign + hours + delimiter + minutes
  }

  function dateLongFormatter(pattern, formatLong) {
    switch (pattern) {
      case 'P':
        return formatLong.date({ width: 'short' })
      case 'PP':
        return formatLong.date({ width: 'medium' })
      case 'PPP':
        return formatLong.date({ width: 'long' })
      case 'PPPP':
      default:
        return formatLong.date({ width: 'full' })
    }
  }

  function timeLongFormatter(pattern, formatLong) {
    switch (pattern) {
      case 'p':
        return formatLong.time({ width: 'short' })
      case 'pp':
        return formatLong.time({ width: 'medium' })
      case 'ppp':
        return formatLong.time({ width: 'long' })
      case 'pppp':
      default:
        return formatLong.time({ width: 'full' })
    }
  }

  function dateTimeLongFormatter(pattern, formatLong) {
    var matchResult = pattern.match(/(P+)(p+)?/);
    var datePattern = matchResult[1];
    var timePattern = matchResult[2];

    if (!timePattern) {
      return dateLongFormatter(pattern, formatLong)
    }

    var dateTimeFormat;

    switch (datePattern) {
      case 'P':
        dateTimeFormat = formatLong.dateTime({ width: 'short' });
        break
      case 'PP':
        dateTimeFormat = formatLong.dateTime({ width: 'medium' });
        break
      case 'PPP':
        dateTimeFormat = formatLong.dateTime({ width: 'long' });
        break
      case 'PPPP':
      default:
        dateTimeFormat = formatLong.dateTime({ width: 'full' });
        break
    }

    return dateTimeFormat
      .replace('{{date}}', dateLongFormatter(datePattern, formatLong))
      .replace('{{time}}', timeLongFormatter(timePattern, formatLong))
  }

  var longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter
  };

  /**
   * @name subMilliseconds
   * @category Millisecond Helpers
   * @summary Subtract the specified number of milliseconds from the given date.
   *
   * @description
   * Subtract the specified number of milliseconds from the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of milliseconds to be subtracted
   * @returns {Date} the new date with the milliseconds subtracted
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
   * var result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
   * //=> Thu Jul 10 2014 12:45:29.250
   */
  function subMilliseconds(dirtyDate, dirtyAmount) {
    if (arguments.length < 2) {
      throw new TypeError(
        '2 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var amount = toInteger(dirtyAmount);
    return addMilliseconds(dirtyDate, -amount)
  }

  var protectedTokens = ['D', 'DD', 'YY', 'YYYY'];

  function isProtectedToken(token) {
    return protectedTokens.indexOf(token) !== -1
  }

  function throwProtectedError(token) {
    throw new RangeError(
      '`options.awareOfUnicodeTokens` must be set to `true` to use `' +
        token +
        '` token; see: https://git.io/fxCyr'
    )
  }

  // This RegExp consists of three parts separated by `|`:
  // - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
  //   (one of the certain letters followed by `o`)
  // - (\w)\1* matches any sequences of the same letter
  // - '' matches two quote characters in a row
  // - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
  //   except a single quote symbol, which ends the sequence.
  //   Two quote characters do not end the sequence.
  //   If there is no matching single quote
  //   then the sequence will continue until the end of the string.
  // - . matches any single character unmatched by previous parts of the RegExps
  var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

  // This RegExp catches symbols escaped by quotes, and also
  // sequences of symbols P, p, and the combinations like `PPPPPPPppppp`
  var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;

  var escapedStringRegExp = /^'(.*?)'?$/;
  var doubleQuoteRegExp = /''/g;

  /**
   * @name format
   * @category Common Helpers
   * @summary Format the date.
   *
   * @description
   * Return the formatted date string in the given format. The result may vary by locale.
   *
   * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
   * > See: https://git.io/fxCyr
   *
   * The characters wrapped between two single quotes characters (') are escaped.
   * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
   * (see the last example)
   *
   * Format of the string is based on Unicode Technical Standard #35:
   * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
   * with a few additions (see note 7 below the table).
   *
   * Accepted patterns:
   * | Unit                            | Pattern | Result examples                   | Notes |
   * |---------------------------------|---------|-----------------------------------|-------|
   * | Era                             | G..GGG  | AD, BC                            |       |
   * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
   * |                                 | GGGGG   | A, B                              |       |
   * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
   * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
   * |                                 | yy      | 44, 01, 00, 17                    | 5     |
   * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
   * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
   * |                                 | yyyyy   | ...                               | 3,5   |
   * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
   * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
   * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
   * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
   * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
   * |                                 | YYYYY   | ...                               | 3,5   |
   * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
   * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
   * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
   * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
   * |                                 | RRRRR   | ...                               | 3,5,7 |
   * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
   * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
   * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
   * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
   * |                                 | uuuuu   | ...                               | 3,5   |
   * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
   * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
   * |                                 | QQ      | 01, 02, 03, 04                    |       |
   * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
   * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
   * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
   * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
   * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
   * |                                 | qq      | 01, 02, 03, 04                    |       |
   * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
   * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
   * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
   * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
   * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
   * |                                 | MM      | 01, 02, ..., 12                   |       |
   * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
   * |                                 | MMMM    | January, February, ..., December  | 2     |
   * |                                 | MMMMM   | J, F, ..., D                      |       |
   * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
   * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
   * |                                 | LL      | 01, 02, ..., 12                   |       |
   * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
   * |                                 | LLLL    | January, February, ..., December  | 2     |
   * |                                 | LLLLL   | J, F, ..., D                      |       |
   * | Local week of year              | w       | 1, 2, ..., 53                     |       |
   * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
   * |                                 | ww      | 01, 02, ..., 53                   |       |
   * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
   * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
   * |                                 | II      | 01, 02, ..., 53                   | 7     |
   * | Day of month                    | d       | 1, 2, ..., 31                     |       |
   * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
   * |                                 | dd      | 01, 02, ..., 31                   |       |
   * | Day of year                     | D       | 1, 2, ..., 365, 366               | 8     |
   * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
   * |                                 | DD      | 01, 02, ..., 365, 366             | 8     |
   * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
   * |                                 | DDDD    | ...                               | 3     |
   * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Su            |       |
   * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
   * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
   * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
   * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
   * |                                 | ii      | 01, 02, ..., 07                   | 7     |
   * |                                 | iii     | Mon, Tue, Wed, ..., Su            | 7     |
   * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
   * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
   * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Su, Sa        | 7     |
   * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
   * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
   * |                                 | ee      | 02, 03, ..., 01                   |       |
   * |                                 | eee     | Mon, Tue, Wed, ..., Su            |       |
   * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
   * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
   * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
   * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
   * |                                 | cc      | 02, 03, ..., 01                   |       |
   * |                                 | ccc     | Mon, Tue, Wed, ..., Su            |       |
   * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
   * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
   * | AM, PM                          | a..aaa  | AM, PM                            |       |
   * |                                 | aaaa    | a.m., p.m.                        | 2     |
   * |                                 | aaaaa   | a, p                              |       |
   * | AM, PM, noon, midnight          | b..bbb  | AM, PM, noon, midnight            |       |
   * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
   * |                                 | bbbbb   | a, p, n, mi                       |       |
   * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
   * |                                 | BBBB    | at night, in the morning, ...     | 2     |
   * |                                 | BBBBB   | at night, in the morning, ...     |       |
   * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
   * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
   * |                                 | hh      | 01, 02, ..., 11, 12               |       |
   * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
   * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
   * |                                 | HH      | 00, 01, 02, ..., 23               |       |
   * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
   * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
   * |                                 | KK      | 1, 2, ..., 11, 0                  |       |
   * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
   * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
   * |                                 | kk      | 24, 01, 02, ..., 23               |       |
   * | Minute                          | m       | 0, 1, ..., 59                     |       |
   * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
   * |                                 | mm      | 00, 01, ..., 59                   |       |
   * | Second                          | s       | 0, 1, ..., 59                     |       |
   * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
   * |                                 | ss      | 00, 01, ..., 59                   |       |
   * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
   * |                                 | SS      | 00, 01, ..., 99                   |       |
   * |                                 | SSS     | 000, 0001, ..., 999               |       |
   * |                                 | SSSS    | ...                               | 3     |
   * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
   * |                                 | XX      | -0800, +0530, Z                   |       |
   * |                                 | XXX     | -08:00, +05:30, Z                 |       |
   * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
   * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
   * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
   * |                                 | xx      | -0800, +0530, +0000               |       |
   * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
   * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
   * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
   * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
   * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
   * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
   * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
   * | Seconds timestamp               | t       | 512969520                         | 7     |
   * |                                 | tt      | ...                               | 3,7   |
   * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
   * |                                 | TT      | ...                               | 3,7   |
   * | Long localized date             | P       | 05/29/1453                        | 7     |
   * |                                 | PP      | May 29, 1453                      | 7     |
   * |                                 | PPP     | May 29th, 1453                    | 7     |
   * |                                 | PPPP    | Sunday, May 29th, 1453            | 2,7   |
   * | Long localized time             | p       | 12:00 AM                          | 7     |
   * |                                 | pp      | 12:00:00 AM                       | 7     |
   * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
   * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
   * | Combination of date and time    | Pp      | 05/29/1453, 12:00 AM              | 7     |
   * |                                 | PPpp    | May 29, 1453, 12:00:00 AM         | 7     |
   * |                                 | PPPppp  | May 29th, 1453 at ...             | 7     |
   * |                                 | PPPPpppp| Sunday, May 29th, 1453 at ...     | 2,7   |
   * Notes:
   * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
   *    are the same as "stand-alone" units, but are different in some languages.
   *    "Formatting" units are declined according to the rules of the language
   *    in the context of a date. "Stand-alone" units are always nominative singular:
   *
   *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
   *
   *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
   *
   * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
   *    the single quote characters (see below).
   *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
   *    the output will be the same as default pattern for this unit, usually
   *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
   *    are marked with "2" in the last column of the table.
   *
   *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
   *
   *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
   *
   * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
   *    The output will be padded with zeros to match the length of the pattern.
   *
   *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
   *
   * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
   *    These tokens represent the shortest form of the quarter.
   *
   * 5. The main difference between `y` and `u` patterns are B.C. years:
   *
   *    | Year | `y` | `u` |
   *    |------|-----|-----|
   *    | AC 1 |   1 |   1 |
   *    | BC 1 |   1 |   0 |
   *    | BC 2 |   2 |  -1 |
   *
   *    Also `yy` always returns the last two digits of a year,
   *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
   *
   *    | Year | `yy` | `uu` |
   *    |------|------|------|
   *    | 1    |   01 |   01 |
   *    | 14   |   14 |   14 |
   *    | 376  |   76 |  376 |
   *    | 1453 |   53 | 1453 |
   *
   *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
   *    except local week-numbering years are dependent on `options.weekStartsOn`
   *    and `options.firstWeekContainsDate` (compare [getISOWeekYear]{@link https://date-fns.org/docs/getISOWeekYear}
   *    and [getWeekYear]{@link https://date-fns.org/docs/getWeekYear}).
   *
   * 6. Specific non-location timezones are currently unavailable in `date-fns`,
   *    so right now these tokens fall back to GMT timezones.
   *
   * 7. These patterns are not in the Unicode Technical Standard #35:
   *    - `i`: ISO day of week
   *    - `I`: ISO week of year
   *    - `R`: ISO week-numbering year
   *    - `t`: seconds timestamp
   *    - `T`: milliseconds timestamp
   *    - `o`: ordinal number modifier
   *    - `P`: long localized date
   *    - `p`: long localized time
   *
   * 8. These tokens are often confused with others. See: https://git.io/fxCyr
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * - The second argument is now required for the sake of explicitness.
   *
   *   ```javascript
   *   // Before v2.0.0
   *   format(new Date(2016, 0, 1))
   *
   *   // v2.0.0 onward
   *   format(new Date(2016, 0, 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
   *   ```
   *
   * - New format string API for `format` function
   *   which is based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table).
   *   See [this post](https://blog.date-fns.org/post/unicode-tokens-in-date-fns-v2-sreatyki91jg) for more details.
   *
   * - Characters are now escaped using single quote symbols (`'`) instead of square brackets.
   *
   * @param {Date|Number} date - the original date
   * @param {String} format - the string of tokens
   * @param {Object} [options] - an object with options.
   * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @param {Number} [options.firstWeekContainsDate=1] - the day of January, which is
   * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
   * @param {Boolean} [options.awareOfUnicodeTokens=false] - if true, allows usage of Unicode tokens causes confusion:
   *   - Some of the day of year tokens (`D`, `DD`) that are confused with the day of month tokens (`d`, `dd`).
   *   - Some of the local week-numbering year tokens (`YY`, `YYYY`) that are confused with the calendar year tokens (`yy`, `yyyy`).
   *   See: https://git.io/fxCyr
   * @returns {String} the formatted date string
   * @throws {TypeError} 2 arguments required
   * @throws {RangeError} `options.locale` must contain `localize` property
   * @throws {RangeError} `options.locale` must contain `formatLong` property
   * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
   * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
   * @throws {RangeError} `options.awareOfUnicodeTokens` must be set to `true` to use `XX` token; see: https://git.io/fxCyr
   *
   * @example
   * // Represent 11 February 2014 in middle-endian format:
   * var result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
   * //=> '02/11/2014'
   *
   * @example
   * // Represent 2 July 2014 in Esperanto:
   * import { eoLocale } from 'date-fns/locale/eo'
   * var result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
   *   locale: eoLocale
   * })
   * //=> '2-a de julio 2014'
   *
   * @example
   * // Escape string by single quote characters:
   * var result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
   * //=> "3 o'clock"
   */
  function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
    if (arguments.length < 2) {
      throw new TypeError(
        '2 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var formatStr = String(dirtyFormatStr);
    var options = dirtyOptions || {};

    var locale$1 = options.locale || locale;

    var localeFirstWeekContainsDate =
      locale$1.options && locale$1.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate =
      localeFirstWeekContainsDate == null
        ? 1
        : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate =
      options.firstWeekContainsDate == null
        ? defaultFirstWeekContainsDate
        : toInteger(options.firstWeekContainsDate);

    // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError(
        'firstWeekContainsDate must be between 1 and 7 inclusively'
      )
    }

    var localeWeekStartsOn = locale$1.options && locale$1.options.weekStartsOn;
    var defaultWeekStartsOn =
      localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn =
      options.weekStartsOn == null
        ? defaultWeekStartsOn
        : toInteger(options.weekStartsOn);

    // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError('weekStartsOn must be between 0 and 6 inclusively')
    }

    if (!locale$1.localize) {
      throw new RangeError('locale must contain localize property')
    }

    if (!locale$1.formatLong) {
      throw new RangeError('locale must contain formatLong property')
    }

    var originalDate = toDate(dirtyDate);

    if (!isValid(originalDate)) {
      throw new RangeError('Invalid time value')
    }

    // Convert the date in system timezone to the same date in UTC+00:00 timezone.
    // This ensures that when UTC functions will be implemented, locales will be compatible with them.
    // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376
    var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
    var utcDate = subMilliseconds(originalDate, timezoneOffset);

    var formatterOptions = {
      firstWeekContainsDate: firstWeekContainsDate,
      weekStartsOn: weekStartsOn,
      locale: locale$1,
      _originalDate: originalDate
    };

    var result = formatStr
      .match(longFormattingTokensRegExp)
      .map(function(substring) {
        var firstCharacter = substring[0];
        if (firstCharacter === 'p' || firstCharacter === 'P') {
          var longFormatter = longFormatters[firstCharacter];
          return longFormatter(substring, locale$1.formatLong, formatterOptions)
        }
        return substring
      })
      .join('')
      .match(formattingTokensRegExp)
      .map(function(substring) {
        // Replace two single quote characters with one single quote character
        if (substring === "''") {
          return "'"
        }

        var firstCharacter = substring[0];
        if (firstCharacter === "'") {
          return cleanEscapedString(substring)
        }

        var formatter = formatters$1[firstCharacter];
        if (formatter) {
          if (!options.awareOfUnicodeTokens && isProtectedToken(substring)) {
            throwProtectedError(substring);
          }
          return formatter(utcDate, substring, locale$1.localize, formatterOptions)
        }

        return substring
      })
      .join('');

    return result
  }

  function cleanEscapedString(input) {
    return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'")
  }

  function assign(target, dirtyObject) {
    if (target == null) {
      throw new TypeError(
        'assign requires that input parameter not be null or undefined'
      )
    }

    dirtyObject = dirtyObject || {};

    for (var property in dirtyObject) {
      if (dirtyObject.hasOwnProperty(property)) {
        target[property] = dirtyObject[property];
      }
    }

    return target
  }

  /**
   * @name isAfter
   * @category Common Helpers
   * @summary Is the first date after the second one?
   *
   * @description
   * Is the first date after the second one?
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date that should be after the other one to return true
   * @param {Date|Number} dateToCompare - the date to compare with
   * @returns {Boolean} the first date is after the second date
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Is 10 July 1989 after 11 February 1987?
   * var result = isAfter(new Date(1989, 6, 10), new Date(1987, 1, 11))
   * //=> true
   */
  function isAfter(dirtyDate, dirtyDateToCompare) {
    if (arguments.length < 2) {
      throw new TypeError(
        '2 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var date = toDate(dirtyDate);
    var dateToCompare = toDate(dirtyDateToCompare);
    return date.getTime() > dateToCompare.getTime()
  }

  /**
   * @name isBefore
   * @category Common Helpers
   * @summary Is the first date before the second one?
   *
   * @description
   * Is the first date before the second one?
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date that should be before the other one to return true
   * @param {Date|Number} dateToCompare - the date to compare with
   * @returns {Boolean} the first date is before the second date
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Is 10 July 1989 before 11 February 1987?
   * var result = isBefore(new Date(1989, 6, 10), new Date(1987, 1, 11))
   * //=> false
   */
  function isBefore(dirtyDate, dirtyDateToCompare) {
    if (arguments.length < 2) {
      throw new TypeError(
        '2 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var date = toDate(dirtyDate);
    var dateToCompare = toDate(dirtyDateToCompare);
    return date.getTime() < dateToCompare.getTime()
  }

  /**
   * @name isDate
   * @category Common Helpers
   * @summary Is the given value a date?
   *
   * @description
   * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {*} value - the value to check
   * @returns {boolean} true if the given value is a date
   * @throws {TypeError} 1 arguments required
   *
   * @example
   * // For a valid date:
   * var result = isDate(new Date())
   * //=> true
   *
   * @example
   * // For an invalid date:
   * var result = isDate(new Date(NaN))
   * //=> true
   *
   * @example
   * // For some value:
   * var result = isDate('2014-02-31')
   * //=> false
   *
   * @example
   * // For an object:
   * var result = isDate({})
   * //=> false
   */

  /**
   * @name isEqual
   * @category Common Helpers
   * @summary Are the given dates equal?
   *
   * @description
   * Are the given dates equal?
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} dateLeft - the first date to compare
   * @param {Date|Number} dateRight - the second date to compare
   * @returns {Boolean} the dates are equal
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Are 2 July 2014 06:30:45.000 and 2 July 2014 06:30:45.500 equal?
   * var result = isEqual(
   *   new Date(2014, 6, 2, 6, 30, 45, 0),
   *   new Date(2014, 6, 2, 6, 30, 45, 500)
   * )
   * //=> false
   */
  function isEqual(dirtyLeftDate, dirtyRightDate) {
    if (arguments.length < 2) {
      throw new TypeError(
        '2 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var dateLeft = toDate(dirtyLeftDate);
    var dateRight = toDate(dirtyRightDate);
    return dateLeft.getTime() === dateRight.getTime()
  }

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function setUTCDay(dirtyDate, dirtyDay, dirtyOptions) {
    if (arguments.length < 2) {
      throw new TypeError(
        '2 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var options = dirtyOptions || {};
    var locale = options.locale;
    var localeWeekStartsOn =
      locale && locale.options && locale.options.weekStartsOn;
    var defaultWeekStartsOn =
      localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn =
      options.weekStartsOn == null
        ? defaultWeekStartsOn
        : toInteger(options.weekStartsOn);

    // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError('weekStartsOn must be between 0 and 6 inclusively')
    }

    var date = toDate(dirtyDate);
    var day = toInteger(dirtyDay);

    var currentDay = date.getUTCDay();

    var remainder = day % 7;
    var dayIndex = (remainder + 7) % 7;

    var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;

    date.setUTCDate(date.getUTCDate() + diff);
    return date
  }

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function setUTCWeek(dirtyDate, dirtyWeek, options) {
    if (arguments.length < 2) {
      throw new TypeError(
        '2 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var date = toDate(dirtyDate);
    var week = toInteger(dirtyWeek);
    var diff = getUTCWeek(date, options) - week;
    date.setUTCDate(date.getUTCDate() - diff * 7);
    return date
  }

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function setUTCISODay(dirtyDate, dirtyDay) {
    if (arguments.length < 2) {
      throw new TypeError(
        '2 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var day = toInteger(dirtyDay);

    if (day % 7 === 0) {
      day = day - 7;
    }

    var weekStartsOn = 1;
    var date = toDate(dirtyDate);
    var currentDay = date.getUTCDay();

    var remainder = day % 7;
    var dayIndex = (remainder + 7) % 7;

    var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;

    date.setUTCDate(date.getUTCDate() + diff);
    return date
  }

  // This function will be a part of public API when UTC function will be implemented.
  // See issue: https://github.com/date-fns/date-fns/issues/376
  function setUTCISOWeek(dirtyDate, dirtyISOWeek) {
    if (arguments.length < 2) {
      throw new TypeError(
        '2 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var date = toDate(dirtyDate);
    var isoWeek = toInteger(dirtyISOWeek);
    var diff = getUTCISOWeek(date) - isoWeek;
    date.setUTCDate(date.getUTCDate() - diff * 7);
    return date
  }

  var MILLISECONDS_IN_HOUR = 3600000;
  var MILLISECONDS_IN_MINUTE$1 = 60000;
  var MILLISECONDS_IN_SECOND = 1000;

  var numericPatterns = {
    month: /^(1[0-2]|0?\d)/, // 0 to 12
    date: /^(3[0-1]|[0-2]?\d)/, // 0 to 31
    dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/, // 0 to 366
    week: /^(5[0-3]|[0-4]?\d)/, // 0 to 53
    hour23h: /^(2[0-3]|[0-1]?\d)/, // 0 to 23
    hour24h: /^(2[0-4]|[0-1]?\d)/, // 0 to 24
    hour11h: /^(1[0-1]|0?\d)/, // 0 to 11
    hour12h: /^(1[0-2]|0?\d)/, // 0 to 12
    minute: /^[0-5]?\d/, // 0 to 59
    second: /^[0-5]?\d/, // 0 to 59

    singleDigit: /^\d/, // 0 to 9
    twoDigits: /^\d{1,2}/, // 0 to 99
    threeDigits: /^\d{1,3}/, // 0 to 999
    fourDigits: /^\d{1,4}/, // 0 to 9999

    anyDigitsSigned: /^-?\d+/,
    singleDigitSigned: /^-?\d/, // 0 to 9, -0 to -9
    twoDigitsSigned: /^-?\d{1,2}/, // 0 to 99, -0 to -99
    threeDigitsSigned: /^-?\d{1,3}/, // 0 to 999, -0 to -999
    fourDigitsSigned: /^-?\d{1,4}/ // 0 to 9999, -0 to -9999
  };

  var timezonePatterns = {
    basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
    basic: /^([+-])(\d{2})(\d{2})|Z/,
    basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
    extended: /^([+-])(\d{2}):(\d{2})|Z/,
    extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
  };

  function parseNumericPattern(pattern, string, valueCallback) {
    var matchResult = string.match(pattern);

    if (!matchResult) {
      return null
    }

    var value = parseInt(matchResult[0], 10);

    return {
      value: valueCallback ? valueCallback(value) : value,
      rest: string.slice(matchResult[0].length)
    }
  }

  function parseTimezonePattern(pattern, string) {
    var matchResult = string.match(pattern);

    if (!matchResult) {
      return null
    }

    // Input is 'Z'
    if (matchResult[0] === 'Z') {
      return {
        value: 0,
        rest: string.slice(1)
      }
    }

    var sign = matchResult[1] === '+' ? 1 : -1;
    var hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
    var minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
    var seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;

    return {
      value:
        sign *
        (hours * MILLISECONDS_IN_HOUR +
          minutes * MILLISECONDS_IN_MINUTE$1 +
          seconds * MILLISECONDS_IN_SECOND),
      rest: string.slice(matchResult[0].length)
    }
  }

  function parseAnyDigitsSigned(string, valueCallback) {
    return parseNumericPattern(
      numericPatterns.anyDigitsSigned,
      string,
      valueCallback
    )
  }

  function parseNDigits(n, string, valueCallback) {
    switch (n) {
      case 1:
        return parseNumericPattern(
          numericPatterns.singleDigit,
          string,
          valueCallback
        )
      case 2:
        return parseNumericPattern(
          numericPatterns.twoDigits,
          string,
          valueCallback
        )
      case 3:
        return parseNumericPattern(
          numericPatterns.threeDigits,
          string,
          valueCallback
        )
      case 4:
        return parseNumericPattern(
          numericPatterns.fourDigits,
          string,
          valueCallback
        )
      default:
        return parseNumericPattern(
          new RegExp('^\\d{1,' + n + '}'),
          string,
          valueCallback
        )
    }
  }

  function parseNDigitsSigned(n, string, valueCallback) {
    switch (n) {
      case 1:
        return parseNumericPattern(
          numericPatterns.singleDigitSigned,
          string,
          valueCallback
        )
      case 2:
        return parseNumericPattern(
          numericPatterns.twoDigitsSigned,
          string,
          valueCallback
        )
      case 3:
        return parseNumericPattern(
          numericPatterns.threeDigitsSigned,
          string,
          valueCallback
        )
      case 4:
        return parseNumericPattern(
          numericPatterns.fourDigitsSigned,
          string,
          valueCallback
        )
      default:
        return parseNumericPattern(
          new RegExp('^-?\\d{1,' + n + '}'),
          string,
          valueCallback
        )
    }
  }

  function dayPeriodEnumToHours(enumValue) {
    switch (enumValue) {
      case 'morning':
        return 4
      case 'evening':
        return 17
      case 'pm':
      case 'noon':
      case 'afternoon':
        return 12
      case 'am':
      case 'midnight':
      case 'night':
      default:
        return 0
    }
  }

  function normalizeTwoDigitYear(twoDigitYear, currentYear) {
    var isCommonEra = currentYear > 0;
    // Absolute number of the current year:
    // 1 -> 1 AC
    // 0 -> 1 BC
    // -1 -> 2 BC
    var absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;

    var result;
    if (absCurrentYear <= 50) {
      result = twoDigitYear || 100;
    } else {
      var rangeEnd = absCurrentYear + 50;
      var rangeEndCentury = Math.floor(rangeEnd / 100) * 100;
      var isPreviousCentury = twoDigitYear >= rangeEnd % 100;
      result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
    }

    return isCommonEra ? result : 1 - result
  }

  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // User for validation
  function isLeapYearIndex(year) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
  }

  /*
   * |     | Unit                           |     | Unit                           |
   * |-----|--------------------------------|-----|--------------------------------|
   * |  a  | AM, PM                         |  A* | Milliseconds in day            |
   * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
   * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
   * |  d  | Day of month                   |  D  | Day of year                    |
   * |  e  | Local day of week              |  E  | Day of week                    |
   * |  f  |                                |  F* | Day of week in month           |
   * |  g* | Modified Julian day            |  G  | Era                            |
   * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
   * |  i! | ISO day of week                |  I! | ISO week of year               |
   * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
   * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
   * |  l* | (deprecated)                   |  L  | Stand-alone month              |
   * |  m  | Minute                         |  M  | Month                          |
   * |  n  |                                |  N  |                                |
   * |  o! | Ordinal number modifier        |  O* | Timezone (GMT)                 |
   * |  p  |                                |  P  |                                |
   * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
   * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
   * |  s  | Second                         |  S  | Fraction of second             |
   * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
   * |  u  | Extended year                  |  U* | Cyclic year                    |
   * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
   * |  w  | Local week of year             |  W* | Week of month                  |
   * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
   * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
   * |  z* | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
   *
   * Letters marked by * are not implemented but reserved by Unicode standard.
   *
   * Letters marked by ! are non-standard, but implemented by date-fns:
   * - `o` modifies the previous token to turn it into an ordinal (see `parse` docs)
   * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
   *   i.e. 7 for Sunday, 1 for Monday, etc.
   * - `I` is ISO week of year, as opposed to `w` which is local week of year.
   * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
   *   `R` is supposed to be used in conjunction with `I` and `i`
   *   for universal ISO week-numbering date, whereas
   *   `Y` is supposed to be used in conjunction with `w` and `e`
   *   for week-numbering date specific to the locale.
   */
  var parsers = {
    // Era
    G: {
      priority: 140,
      parse: function(string, token, match, options) {
        switch (token) {
          // AD, BC
          case 'G':
          case 'GG':
          case 'GGG':
            return (
              match.era(string, { width: 'abbreviated' }) ||
              match.era(string, { width: 'narrow' })
            )
          // A, B
          case 'GGGGG':
            return match.era(string, { width: 'narrow' })
          // Anno Domini, Before Christ
          case 'GGGG':
          default:
            return (
              match.era(string, { width: 'wide' }) ||
              match.era(string, { width: 'abbreviated' }) ||
              match.era(string, { width: 'narrow' })
            )
        }
      },
      set: function(date, flags, value, options) {
        // Sets year 10 BC if BC, or 10 AC if AC
        date.setUTCFullYear(value === 1 ? 10 : -9, 0, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Year
    y: {
      // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_Patterns
      // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
      // |----------|-------|----|-------|-------|-------|
      // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
      // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
      // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
      // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
      // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |

      priority: 130,
      parse: function(string, token, match, options) {
        var valueCallback = function(year) {
          return {
            year: year,
            isTwoDigitYear: token === 'yy'
          }
        };

        switch (token) {
          case 'y':
            return parseNDigits(4, string, valueCallback)
          case 'yo':
            return match.ordinalNumber(string, {
              unit: 'year',
              valueCallback: valueCallback
            })
          default:
            return parseNDigits(token.length, string, valueCallback)
        }
      },
      validate: function(date, value, options) {
        return value.isTwoDigitYear || value.year > 0
      },
      set: function(date, flags, value, options) {
        var currentYear = getUTCWeekYear(date, options);

        if (value.isTwoDigitYear) {
          var normalizedTwoDigitYear = normalizeTwoDigitYear(
            value.year,
            currentYear
          );
          date.setUTCFullYear(normalizedTwoDigitYear, 0, 1);
          date.setUTCHours(0, 0, 0, 0);
          return date
        }

        var year = currentYear > 0 ? value.year : 1 - value.year;
        date.setUTCFullYear(year, 0, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Local week-numbering year
    Y: {
      priority: 130,
      parse: function(string, token, match, options) {
        var valueCallback = function(year) {
          return {
            year: year,
            isTwoDigitYear: token === 'YY'
          }
        };

        switch (token) {
          case 'Y':
            return parseNDigits(4, string, valueCallback)
          case 'Yo':
            return match.ordinalNumber(string, {
              unit: 'year',
              valueCallback: valueCallback
            })
          default:
            return parseNDigits(token.length, string, valueCallback)
        }
      },
      validate: function(date, value, options) {
        return value.isTwoDigitYear || value.year > 0
      },
      set: function(date, flags, value, options) {
        var currentYear = date.getUTCFullYear();

        if (value.isTwoDigitYear) {
          var normalizedTwoDigitYear = normalizeTwoDigitYear(
            value.year,
            currentYear
          );
          date.setUTCFullYear(
            normalizedTwoDigitYear,
            0,
            options.firstWeekContainsDate
          );
          date.setUTCHours(0, 0, 0, 0);
          return startOfUTCWeek(date, options)
        }

        var year = currentYear > 0 ? value.year : 1 - value.year;
        date.setUTCFullYear(year, 0, options.firstWeekContainsDate);
        date.setUTCHours(0, 0, 0, 0);
        return startOfUTCWeek(date, options)
      }
    },

    // ISO week-numbering year
    R: {
      priority: 130,
      parse: function(string, token, match, options) {
        if (token === 'R') {
          return parseNDigitsSigned(4, string)
        }

        return parseNDigitsSigned(token.length, string)
      },
      set: function(date, flags, value, options) {
        var firstWeekOfYear = new Date(0);
        firstWeekOfYear.setUTCFullYear(value, 0, 4);
        firstWeekOfYear.setUTCHours(0, 0, 0, 0);
        return startOfUTCISOWeek(firstWeekOfYear)
      }
    },

    // Extended year
    u: {
      priority: 130,
      parse: function(string, token, match, options) {
        if (token === 'u') {
          return parseNDigitsSigned(4, string)
        }

        return parseNDigitsSigned(token.length, string)
      },
      set: function(date, flags, value, options) {
        date.setUTCFullYear(value, 0, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Quarter
    Q: {
      priority: 120,
      parse: function(string, token, match, options) {
        switch (token) {
          // 1, 2, 3, 4
          case 'Q':
          case 'QQ': // 01, 02, 03, 04
            return parseNDigits(token.length, string)
          // 1st, 2nd, 3rd, 4th
          case 'Qo':
            return match.ordinalNumber(string, { unit: 'quarter' })
          // Q1, Q2, Q3, Q4
          case 'QQQ':
            return (
              match.quarter(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.quarter(string, { width: 'narrow', context: 'formatting' })
            )
          // 1, 2, 3, 4 (narrow quarter; could be not numerical)
          case 'QQQQQ':
            return match.quarter(string, {
              width: 'narrow',
              context: 'formatting'
            })
          // 1st quarter, 2nd quarter, ...
          case 'QQQQ':
          default:
            return (
              match.quarter(string, { width: 'wide', context: 'formatting' }) ||
              match.quarter(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.quarter(string, { width: 'narrow', context: 'formatting' })
            )
        }
      },
      validate: function(date, value, options) {
        return value >= 1 && value <= 4
      },
      set: function(date, flags, value, options) {
        date.setUTCMonth((value - 1) * 3, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Stand-alone quarter
    q: {
      priority: 120,
      parse: function(string, token, match, options) {
        switch (token) {
          // 1, 2, 3, 4
          case 'q':
          case 'qq': // 01, 02, 03, 04
            return parseNDigits(token.length, string)
          // 1st, 2nd, 3rd, 4th
          case 'qo':
            return match.ordinalNumber(string, { unit: 'quarter' })
          // Q1, Q2, Q3, Q4
          case 'qqq':
            return (
              match.quarter(string, {
                width: 'abbreviated',
                context: 'standalone'
              }) ||
              match.quarter(string, { width: 'narrow', context: 'standalone' })
            )
          // 1, 2, 3, 4 (narrow quarter; could be not numerical)
          case 'qqqqq':
            return match.quarter(string, {
              width: 'narrow',
              context: 'standalone'
            })
          // 1st quarter, 2nd quarter, ...
          case 'qqqq':
          default:
            return (
              match.quarter(string, { width: 'wide', context: 'standalone' }) ||
              match.quarter(string, {
                width: 'abbreviated',
                context: 'standalone'
              }) ||
              match.quarter(string, { width: 'narrow', context: 'standalone' })
            )
        }
      },
      validate: function(date, value, options) {
        return value >= 1 && value <= 4
      },
      set: function(date, flags, value, options) {
        date.setUTCMonth((value - 1) * 3, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Month
    M: {
      priority: 110,
      parse: function(string, token, match, options) {
        var valueCallback = function(value) {
          return value - 1
        };

        switch (token) {
          // 1, 2, ..., 12
          case 'M':
            return parseNumericPattern(
              numericPatterns.month,
              string,
              valueCallback
            )
          // 01, 02, ..., 12
          case 'MM':
            return parseNDigits(2, string, valueCallback)
          // 1st, 2nd, ..., 12th
          case 'Mo':
            return match.ordinalNumber(string, {
              unit: 'month',
              valueCallback: valueCallback
            })
          // Jan, Feb, ..., Dec
          case 'MMM':
            return (
              match.month(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.month(string, { width: 'narrow', context: 'formatting' })
            )
          // J, F, ..., D
          case 'MMMMM':
            return match.month(string, { width: 'narrow', context: 'formatting' })
          // January, February, ..., December
          case 'MMMM':
          default:
            return (
              match.month(string, { width: 'wide', context: 'formatting' }) ||
              match.month(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.month(string, { width: 'narrow', context: 'formatting' })
            )
        }
      },
      validate: function(date, value, options) {
        return value >= 0 && value <= 11
      },
      set: function(date, flags, value, options) {
        date.setUTCMonth(value, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Stand-alone month
    L: {
      priority: 110,
      parse: function(string, token, match, options) {
        var valueCallback = function(value) {
          return value - 1
        };

        switch (token) {
          // 1, 2, ..., 12
          case 'L':
            return parseNumericPattern(
              numericPatterns.month,
              string,
              valueCallback
            )
          // 01, 02, ..., 12
          case 'LL':
            return parseNDigits(2, string, valueCallback)
          // 1st, 2nd, ..., 12th
          case 'Lo':
            return match.ordinalNumber(string, {
              unit: 'month',
              valueCallback: valueCallback
            })
          // Jan, Feb, ..., Dec
          case 'LLL':
            return (
              match.month(string, {
                width: 'abbreviated',
                context: 'standalone'
              }) ||
              match.month(string, { width: 'narrow', context: 'standalone' })
            )
          // J, F, ..., D
          case 'LLLLL':
            return match.month(string, { width: 'narrow', context: 'standalone' })
          // January, February, ..., December
          case 'LLLL':
          default:
            return (
              match.month(string, { width: 'wide', context: 'standalone' }) ||
              match.month(string, {
                width: 'abbreviated',
                context: 'standalone'
              }) ||
              match.month(string, { width: 'narrow', context: 'standalone' })
            )
        }
      },
      validate: function(date, value, options) {
        return value >= 0 && value <= 11
      },
      set: function(date, flags, value, options) {
        date.setUTCMonth(value, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Local week of year
    w: {
      priority: 100,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'w':
            return parseNumericPattern(numericPatterns.week, string)
          case 'wo':
            return match.ordinalNumber(string, { unit: 'week' })
          default:
            return parseNDigits(token.length, string)
        }
      },
      validate: function(date, value, options) {
        return value >= 1 && value <= 53
      },
      set: function(date, flags, value, options) {
        return startOfUTCWeek(setUTCWeek(date, value, options), options)
      }
    },

    // ISO week of year
    I: {
      priority: 100,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'I':
            return parseNumericPattern(numericPatterns.week, string)
          case 'Io':
            return match.ordinalNumber(string, { unit: 'week' })
          default:
            return parseNDigits(token.length, string)
        }
      },
      validate: function(date, value, options) {
        return value >= 1 && value <= 53
      },
      set: function(date, flags, value, options) {
        return startOfUTCISOWeek(setUTCISOWeek(date, value, options), options)
      }
    },

    // Day of the month
    d: {
      priority: 90,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'd':
            return parseNumericPattern(numericPatterns.date, string)
          case 'do':
            return match.ordinalNumber(string, { unit: 'date' })
          default:
            return parseNDigits(token.length, string)
        }
      },
      validate: function(date, value, options) {
        var year = date.getUTCFullYear();
        var isLeapYear = isLeapYearIndex(year);
        var month = date.getUTCMonth();
        if (isLeapYear) {
          return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month]
        } else {
          return value >= 1 && value <= DAYS_IN_MONTH[month]
        }
      },
      set: function(date, flags, value, options) {
        date.setUTCDate(value);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Day of year
    D: {
      priority: 90,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'D':
          case 'DD':
            return parseNumericPattern(numericPatterns.dayOfYear, string)
          case 'Do':
            return match.ordinalNumber(string, { unit: 'date' })
          default:
            return parseNDigits(token.length, string)
        }
      },
      validate: function(date, value, options) {
        var year = date.getUTCFullYear();
        var isLeapYear = isLeapYearIndex(year);
        if (isLeapYear) {
          return value >= 1 && value <= 366
        } else {
          return value >= 1 && value <= 365
        }
      },
      set: function(date, flags, value, options) {
        date.setUTCMonth(0, value);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Day of week
    E: {
      priority: 90,
      parse: function(string, token, match, options) {
        switch (token) {
          // Tue
          case 'E':
          case 'EE':
          case 'EEE':
            return (
              match.day(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.day(string, { width: 'short', context: 'formatting' }) ||
              match.day(string, { width: 'narrow', context: 'formatting' })
            )
          // T
          case 'EEEEE':
            return match.day(string, { width: 'narrow', context: 'formatting' })
          // Tu
          case 'EEEEEE':
            return (
              match.day(string, { width: 'short', context: 'formatting' }) ||
              match.day(string, { width: 'narrow', context: 'formatting' })
            )
          // Tuesday
          case 'EEEE':
          default:
            return (
              match.day(string, { width: 'wide', context: 'formatting' }) ||
              match.day(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.day(string, { width: 'short', context: 'formatting' }) ||
              match.day(string, { width: 'narrow', context: 'formatting' })
            )
        }
      },
      validate: function(date, value, options) {
        return value >= 0 && value <= 6
      },
      set: function(date, flags, value, options) {
        date = setUTCDay(date, value, options);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Local day of week
    e: {
      priority: 90,
      parse: function(string, token, match, options) {
        var valueCallback = function(value) {
          var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
          return ((value + options.weekStartsOn + 6) % 7) + wholeWeekDays
        };

        switch (token) {
          // 3
          case 'e':
          case 'ee': // 03
            return parseNDigits(token.length, string, valueCallback)
          // 3rd
          case 'eo':
            return match.ordinalNumber(string, {
              unit: 'day',
              valueCallback: valueCallback
            })
          // Tue
          case 'eee':
            return (
              match.day(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.day(string, { width: 'short', context: 'formatting' }) ||
              match.day(string, { width: 'narrow', context: 'formatting' })
            )
          // T
          case 'eeeee':
            return match.day(string, { width: 'narrow', context: 'formatting' })
          // Tu
          case 'eeeeee':
            return (
              match.day(string, { width: 'short', context: 'formatting' }) ||
              match.day(string, { width: 'narrow', context: 'formatting' })
            )
          // Tuesday
          case 'eeee':
          default:
            return (
              match.day(string, { width: 'wide', context: 'formatting' }) ||
              match.day(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.day(string, { width: 'short', context: 'formatting' }) ||
              match.day(string, { width: 'narrow', context: 'formatting' })
            )
        }
      },
      validate: function(date, value, options) {
        return value >= 0 && value <= 6
      },
      set: function(date, flags, value, options) {
        date = setUTCDay(date, value, options);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // Stand-alone local day of week
    c: {
      priority: 90,
      parse: function(string, token, match, options) {
        var valueCallback = function(value) {
          var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
          return ((value + options.weekStartsOn + 6) % 7) + wholeWeekDays
        };

        switch (token) {
          // 3
          case 'c':
          case 'cc': // 03
            return parseNDigits(token.length, string, valueCallback)
          // 3rd
          case 'co':
            return match.ordinalNumber(string, {
              unit: 'day',
              valueCallback: valueCallback
            })
          // Tue
          case 'ccc':
            return (
              match.day(string, {
                width: 'abbreviated',
                context: 'standalone'
              }) ||
              match.day(string, { width: 'short', context: 'standalone' }) ||
              match.day(string, { width: 'narrow', context: 'standalone' })
            )
          // T
          case 'ccccc':
            return match.day(string, { width: 'narrow', context: 'standalone' })
          // Tu
          case 'cccccc':
            return (
              match.day(string, { width: 'short', context: 'standalone' }) ||
              match.day(string, { width: 'narrow', context: 'standalone' })
            )
          // Tuesday
          case 'cccc':
          default:
            return (
              match.day(string, { width: 'wide', context: 'standalone' }) ||
              match.day(string, {
                width: 'abbreviated',
                context: 'standalone'
              }) ||
              match.day(string, { width: 'short', context: 'standalone' }) ||
              match.day(string, { width: 'narrow', context: 'standalone' })
            )
        }
      },
      validate: function(date, value, options) {
        return value >= 0 && value <= 6
      },
      set: function(date, flags, value, options) {
        date = setUTCDay(date, value, options);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // ISO day of week
    i: {
      priority: 90,
      parse: function(string, token, match, options) {
        var valueCallback = function(value) {
          if (value === 0) {
            return 7
          }
          return value
        };

        switch (token) {
          // 2
          case 'i':
          case 'ii': // 02
            return parseNDigits(token.length, string)
          // 2nd
          case 'io':
            return match.ordinalNumber(string, { unit: 'day' })
          // Tue
          case 'iii':
            return (
              match.day(string, {
                width: 'abbreviated',
                context: 'formatting',
                valueCallback: valueCallback
              }) ||
              match.day(string, {
                width: 'short',
                context: 'formatting',
                valueCallback: valueCallback
              }) ||
              match.day(string, {
                width: 'narrow',
                context: 'formatting',
                valueCallback: valueCallback
              })
            )
          // T
          case 'iiiii':
            return match.day(string, {
              width: 'narrow',
              context: 'formatting',
              valueCallback: valueCallback
            })
          // Tu
          case 'iiiiii':
            return (
              match.day(string, {
                width: 'short',
                context: 'formatting',
                valueCallback: valueCallback
              }) ||
              match.day(string, {
                width: 'narrow',
                context: 'formatting',
                valueCallback: valueCallback
              })
            )
          // Tuesday
          case 'iiii':
          default:
            return (
              match.day(string, {
                width: 'wide',
                context: 'formatting',
                valueCallback: valueCallback
              }) ||
              match.day(string, {
                width: 'abbreviated',
                context: 'formatting',
                valueCallback: valueCallback
              }) ||
              match.day(string, {
                width: 'short',
                context: 'formatting',
                valueCallback: valueCallback
              }) ||
              match.day(string, {
                width: 'narrow',
                context: 'formatting',
                valueCallback: valueCallback
              })
            )
        }
      },
      validate: function(date, value, options) {
        return value >= 1 && value <= 7
      },
      set: function(date, flags, value, options) {
        date = setUTCISODay(date, value, options);
        date.setUTCHours(0, 0, 0, 0);
        return date
      }
    },

    // AM or PM
    a: {
      priority: 80,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'a':
          case 'aa':
          case 'aaa':
            return (
              match.dayPeriod(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.dayPeriod(string, { width: 'narrow', context: 'formatting' })
            )
          case 'aaaaa':
            return match.dayPeriod(string, {
              width: 'narrow',
              context: 'formatting'
            })
          case 'aaaa':
          default:
            return (
              match.dayPeriod(string, { width: 'wide', context: 'formatting' }) ||
              match.dayPeriod(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.dayPeriod(string, { width: 'narrow', context: 'formatting' })
            )
        }
      },
      set: function(date, flags, value, options) {
        date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
        return date
      }
    },

    // AM, PM, midnight
    b: {
      priority: 80,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'b':
          case 'bb':
          case 'bbb':
            return (
              match.dayPeriod(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.dayPeriod(string, { width: 'narrow', context: 'formatting' })
            )
          case 'bbbbb':
            return match.dayPeriod(string, {
              width: 'narrow',
              context: 'formatting'
            })
          case 'bbbb':
          default:
            return (
              match.dayPeriod(string, { width: 'wide', context: 'formatting' }) ||
              match.dayPeriod(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.dayPeriod(string, { width: 'narrow', context: 'formatting' })
            )
        }
      },
      set: function(date, flags, value, options) {
        date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
        return date
      }
    },

    // in the morning, in the afternoon, in the evening, at night
    B: {
      priority: 80,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'B':
          case 'BB':
          case 'BBB':
            return (
              match.dayPeriod(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.dayPeriod(string, { width: 'narrow', context: 'formatting' })
            )
          case 'BBBBB':
            return match.dayPeriod(string, {
              width: 'narrow',
              context: 'formatting'
            })
          case 'BBBB':
          default:
            return (
              match.dayPeriod(string, { width: 'wide', context: 'formatting' }) ||
              match.dayPeriod(string, {
                width: 'abbreviated',
                context: 'formatting'
              }) ||
              match.dayPeriod(string, { width: 'narrow', context: 'formatting' })
            )
        }
      },
      set: function(date, flags, value, options) {
        date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
        return date
      }
    },

    // Hour [1-12]
    h: {
      priority: 70,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'h':
            return parseNumericPattern(numericPatterns.hour12h, string)
          case 'ho':
            return match.ordinalNumber(string, { unit: 'hour' })
          default:
            return parseNDigits(token.length, string)
        }
      },
      validate: function(date, value, options) {
        return value >= 1 && value <= 12
      },
      set: function(date, flags, value, options) {
        var isPM = date.getUTCHours() >= 12;
        if (isPM && value < 12) {
          date.setUTCHours(value + 12, 0, 0, 0);
        } else if (!isPM && value === 12) {
          date.setUTCHours(0, 0, 0, 0);
        } else {
          date.setUTCHours(value, 0, 0, 0);
        }
        return date
      }
    },

    // Hour [0-23]
    H: {
      priority: 70,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'H':
            return parseNumericPattern(numericPatterns.hour23h, string)
          case 'Ho':
            return match.ordinalNumber(string, { unit: 'hour' })
          default:
            return parseNDigits(token.length, string)
        }
      },
      validate: function(date, value, options) {
        return value >= 0 && value <= 23
      },
      set: function(date, flags, value, options) {
        date.setUTCHours(value, 0, 0, 0);
        return date
      }
    },

    // Hour [0-11]
    K: {
      priority: 70,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'K':
            return parseNumericPattern(numericPatterns.hour11h, string)
          case 'Ko':
            return match.ordinalNumber(string, { unit: 'hour' })
          default:
            return parseNDigits(token.length, string)
        }
      },
      validate: function(date, value, options) {
        return value >= 0 && value <= 11
      },
      set: function(date, flags, value, options) {
        var isPM = date.getUTCHours() >= 12;
        if (isPM && value < 12) {
          date.setUTCHours(value + 12, 0, 0, 0);
        } else {
          date.setUTCHours(value, 0, 0, 0);
        }
        return date
      }
    },

    // Hour [1-24]
    k: {
      priority: 70,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'k':
            return parseNumericPattern(numericPatterns.hour24h, string)
          case 'ko':
            return match.ordinalNumber(string, { unit: 'hour' })
          default:
            return parseNDigits(token.length, string)
        }
      },
      validate: function(date, value, options) {
        return value >= 1 && value <= 24
      },
      set: function(date, flags, value, options) {
        var hours = value <= 24 ? value % 24 : value;
        date.setUTCHours(hours, 0, 0, 0);
        return date
      }
    },

    // Minute
    m: {
      priority: 60,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'm':
            return parseNumericPattern(numericPatterns.minute, string)
          case 'mo':
            return match.ordinalNumber(string, { unit: 'minute' })
          default:
            return parseNDigits(token.length, string)
        }
      },
      validate: function(date, value, options) {
        return value >= 0 && value <= 59
      },
      set: function(date, flags, value, options) {
        date.setUTCMinutes(value, 0, 0);
        return date
      }
    },

    // Second
    s: {
      priority: 50,
      parse: function(string, token, match, options) {
        switch (token) {
          case 's':
            return parseNumericPattern(numericPatterns.second, string)
          case 'so':
            return match.ordinalNumber(string, { unit: 'second' })
          default:
            return parseNDigits(token.length, string)
        }
      },
      validate: function(date, value, options) {
        return value >= 0 && value <= 59
      },
      set: function(date, flags, value, options) {
        date.setUTCSeconds(value, 0);
        return date
      }
    },

    // Fraction of second
    S: {
      priority: 30,
      parse: function(string, token, match, options) {
        var valueCallback = function(value) {
          return Math.floor(value * Math.pow(10, -token.length + 3))
        };
        return parseNDigits(token.length, string, valueCallback)
      },
      set: function(date, flags, value, options) {
        date.setUTCMilliseconds(value);
        return date
      }
    },

    // Timezone (ISO-8601. +00:00 is `'Z'`)
    X: {
      priority: 10,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'X':
            return parseTimezonePattern(
              timezonePatterns.basicOptionalMinutes,
              string
            )
          case 'XX':
            return parseTimezonePattern(timezonePatterns.basic, string)
          case 'XXXX':
            return parseTimezonePattern(
              timezonePatterns.basicOptionalSeconds,
              string
            )
          case 'XXXXX':
            return parseTimezonePattern(
              timezonePatterns.extendedOptionalSeconds,
              string
            )
          case 'XXX':
          default:
            return parseTimezonePattern(timezonePatterns.extended, string)
        }
      },
      set: function(date, flags, value, options) {
        if (flags.timestampIsSet) {
          return date
        }
        return new Date(date.getTime() - value)
      }
    },

    // Timezone (ISO-8601)
    x: {
      priority: 10,
      parse: function(string, token, match, options) {
        switch (token) {
          case 'x':
            return parseTimezonePattern(
              timezonePatterns.basicOptionalMinutes,
              string
            )
          case 'xx':
            return parseTimezonePattern(timezonePatterns.basic, string)
          case 'xxxx':
            return parseTimezonePattern(
              timezonePatterns.basicOptionalSeconds,
              string
            )
          case 'xxxxx':
            return parseTimezonePattern(
              timezonePatterns.extendedOptionalSeconds,
              string
            )
          case 'xxx':
          default:
            return parseTimezonePattern(timezonePatterns.extended, string)
        }
      },
      set: function(date, flags, value, options) {
        if (flags.timestampIsSet) {
          return date
        }
        return new Date(date.getTime() - value)
      }
    },

    // Seconds timestamp
    t: {
      priority: 40,
      parse: function(string, token, match, options) {
        return parseAnyDigitsSigned(string)
      },
      set: function(date, flags, value, options) {
        return [new Date(value * 1000), { timestampIsSet: true }]
      }
    },

    // Milliseconds timestamp
    T: {
      priority: 20,
      parse: function(string, token, match, options) {
        return parseAnyDigitsSigned(string)
      },
      set: function(date, flags, value, options) {
        return [new Date(value), { timestampIsSet: true }]
      }
    }
  };

  var TIMEZONE_UNIT_PRIORITY = 10;

  // This RegExp consists of three parts separated by `|`:
  // - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
  //   (one of the certain letters followed by `o`)
  // - (\w)\1* matches any sequences of the same letter
  // - '' matches two quote characters in a row
  // - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
  //   except a single quote symbol, which ends the sequence.
  //   Two quote characters do not end the sequence.
  //   If there is no matching single quote
  //   then the sequence will continue until the end of the string.
  // - . matches any single character unmatched by previous parts of the RegExps
  var formattingTokensRegExp$1 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

  var escapedStringRegExp$1 = /^'(.*?)'?$/;
  var doubleQuoteRegExp$1 = /''/g;

  var notWhitespaceRegExp = /\S/;

  /**
   * @name parse
   * @category Common Helpers
   * @summary Parse the date.
   *
   * @description
   * Return the date parsed from string using the given format string.
   *
   * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
   * > See: https://git.io/fxCyr
   *
   * The characters in the format string wrapped between two single quotes characters (') are escaped.
   * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
   *
   * Format of the format string is based on Unicode Technical Standard #35:
   * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
   * with a few additions (see note 5 below the table).
   *
   * Accepted format string patterns:
   * | Unit                            |Prior| Pattern | Result examples                   | Notes |
   * |---------------------------------|-----|---------|-----------------------------------|-------|
   * | Era                             | 140 | G..GGG  | AD, BC                            |       |
   * |                                 |     | GGGG    | Anno Domini, Before Christ        | 2     |
   * |                                 |     | GGGGG   | A, B                              |       |
   * | Calendar year                   | 130 | y       | 44, 1, 1900, 2017, 9999           | 4     |
   * |                                 |     | yo      | 44th, 1st, 1900th, 9999999th      | 4,5   |
   * |                                 |     | yy      | 44, 01, 00, 17                    | 4     |
   * |                                 |     | yyy     | 044, 001, 123, 999                | 4     |
   * |                                 |     | yyyy    | 0044, 0001, 1900, 2017            | 4     |
   * |                                 |     | yyyyy   | ...                               | 2,4   |
   * | Local week-numbering year       | 130 | Y       | 44, 1, 1900, 2017, 9000           | 4     |
   * |                                 |     | Yo      | 44th, 1st, 1900th, 9999999th      | 4,5   |
   * |                                 |     | YY      | 44, 01, 00, 17                    | 4,6   |
   * |                                 |     | YYY     | 044, 001, 123, 999                | 4     |
   * |                                 |     | YYYY    | 0044, 0001, 1900, 2017            | 4,6   |
   * |                                 |     | YYYYY   | ...                               | 2,4   |
   * | ISO week-numbering year         | 130 | R       | -43, 1, 1900, 2017, 9999, -9999   | 4,5   |
   * |                                 |     | RR      | -43, 01, 00, 17                   | 4,5   |
   * |                                 |     | RRR     | -043, 001, 123, 999, -999         | 4,5   |
   * |                                 |     | RRRR    | -0043, 0001, 2017, 9999, -9999    | 4,5   |
   * |                                 |     | RRRRR   | ...                               | 2,4,5 |
   * | Extended year                   | 130 | u       | -43, 1, 1900, 2017, 9999, -999    | 4     |
   * |                                 |     | uu      | -43, 01, 99, -99                  | 4     |
   * |                                 |     | uuu     | -043, 001, 123, 999, -999         | 4     |
   * |                                 |     | uuuu    | -0043, 0001, 2017, 9999, -9999    | 4     |
   * |                                 |     | uuuuu   | ...                               | 2,4   |
   * | Quarter (formatting)            | 120 | Q       | 1, 2, 3, 4                        |       |
   * |                                 |     | Qo      | 1st, 2nd, 3rd, 4th                | 5     |
   * |                                 |     | QQ      | 01, 02, 03, 04                    |       |
   * |                                 |     | QQQ     | Q1, Q2, Q3, Q4                    |       |
   * |                                 |     | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
   * |                                 |     | QQQQQ   | 1, 2, 3, 4                        | 4     |
   * | Quarter (stand-alone)           | 120 | q       | 1, 2, 3, 4                        |       |
   * |                                 |     | qo      | 1st, 2nd, 3rd, 4th                | 5     |
   * |                                 |     | qq      | 01, 02, 03, 04                    |       |
   * |                                 |     | qqq     | Q1, Q2, Q3, Q4                    |       |
   * |                                 |     | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
   * |                                 |     | qqqqq   | 1, 2, 3, 4                        | 3     |
   * | Month (formatting)              | 110 | M       | 1, 2, ..., 12                     |       |
   * |                                 |     | Mo      | 1st, 2nd, ..., 12th               | 5     |
   * |                                 |     | MM      | 01, 02, ..., 12                   |       |
   * |                                 |     | MMM     | Jan, Feb, ..., Dec                |       |
   * |                                 |     | MMMM    | January, February, ..., December  | 2     |
   * |                                 |     | MMMMM   | J, F, ..., D                      |       |
   * | Month (stand-alone)             | 110 | L       | 1, 2, ..., 12                     |       |
   * |                                 |     | Lo      | 1st, 2nd, ..., 12th               | 5     |
   * |                                 |     | LL      | 01, 02, ..., 12                   |       |
   * |                                 |     | LLL     | Jan, Feb, ..., Dec                |       |
   * |                                 |     | LLLL    | January, February, ..., December  | 2     |
   * |                                 |     | LLLLL   | J, F, ..., D                      |       |
   * | Local week of year              | 100 | w       | 1, 2, ..., 53                     |       |
   * |                                 |     | wo      | 1st, 2nd, ..., 53th               | 5     |
   * |                                 |     | ww      | 01, 02, ..., 53                   |       |
   * | ISO week of year                | 100 | I       | 1, 2, ..., 53                     | 5     |
   * |                                 |     | Io      | 1st, 2nd, ..., 53th               | 5     |
   * |                                 |     | II      | 01, 02, ..., 53                   | 5     |
   * | Day of month                    |  90 | d       | 1, 2, ..., 31                     |       |
   * |                                 |     | do      | 1st, 2nd, ..., 31st               | 5     |
   * |                                 |     | dd      | 01, 02, ..., 31                   |       |
   * | Day of year                     |  90 | D       | 1, 2, ..., 365, 366               | 6     |
   * |                                 |     | Do      | 1st, 2nd, ..., 365th, 366th       | 5     |
   * |                                 |     | DD      | 01, 02, ..., 365, 366             | 6     |
   * |                                 |     | DDD     | 001, 002, ..., 365, 366           |       |
   * |                                 |     | DDDD    | ...                               | 2     |
   * | Day of week (formatting)        |  90 | E..EEE  | Mon, Tue, Wed, ..., Su            |       |
   * |                                 |     | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 |     | EEEEE   | M, T, W, T, F, S, S               |       |
   * |                                 |     | EEEEEE  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
   * | ISO day of week (formatting)    |  90 | i       | 1, 2, 3, ..., 7                   | 5     |
   * |                                 |     | io      | 1st, 2nd, ..., 7th                | 5     |
   * |                                 |     | ii      | 01, 02, ..., 07                   | 5     |
   * |                                 |     | iii     | Mon, Tue, Wed, ..., Su            | 5     |
   * |                                 |     | iiii    | Monday, Tuesday, ..., Sunday      | 2,5   |
   * |                                 |     | iiiii   | M, T, W, T, F, S, S               | 5     |
   * |                                 |     | iiiiii  | Mo, Tu, We, Th, Fr, Su, Sa        | 5     |
   * | Local day of week (formatting)  |  90 | e       | 2, 3, 4, ..., 1                   |       |
   * |                                 |     | eo      | 2nd, 3rd, ..., 1st                | 5     |
   * |                                 |     | ee      | 02, 03, ..., 01                   |       |
   * |                                 |     | eee     | Mon, Tue, Wed, ..., Su            |       |
   * |                                 |     | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 |     | eeeee   | M, T, W, T, F, S, S               |       |
   * |                                 |     | eeeeee  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
   * | Local day of week (stand-alone) |  90 | c       | 2, 3, 4, ..., 1                   |       |
   * |                                 |     | co      | 2nd, 3rd, ..., 1st                | 5     |
   * |                                 |     | cc      | 02, 03, ..., 01                   |       |
   * |                                 |     | ccc     | Mon, Tue, Wed, ..., Su            |       |
   * |                                 |     | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
   * |                                 |     | ccccc   | M, T, W, T, F, S, S               |       |
   * |                                 |     | cccccc  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
   * | AM, PM                          |  80 | a..aaa  | AM, PM                            |       |
   * |                                 |     | aaaa    | a.m., p.m.                        | 2     |
   * |                                 |     | aaaaa   | a, p                              |       |
   * | AM, PM, noon, midnight          |  80 | b..bbb  | AM, PM, noon, midnight            |       |
   * |                                 |     | bbbb    | a.m., p.m., noon, midnight        | 2     |
   * |                                 |     | bbbbb   | a, p, n, mi                       |       |
   * | Flexible day period             |  80 | B..BBB  | at night, in the morning, ...     |       |
   * |                                 |     | BBBB    | at night, in the morning, ...     | 2     |
   * |                                 |     | BBBBB   | at night, in the morning, ...     |       |
   * | Hour [1-12]                     |  70 | h       | 1, 2, ..., 11, 12                 |       |
   * |                                 |     | ho      | 1st, 2nd, ..., 11th, 12th         | 5     |
   * |                                 |     | hh      | 01, 02, ..., 11, 12               |       |
   * | Hour [0-23]                     |  70 | H       | 0, 1, 2, ..., 23                  |       |
   * |                                 |     | Ho      | 0th, 1st, 2nd, ..., 23rd          | 5     |
   * |                                 |     | HH      | 00, 01, 02, ..., 23               |       |
   * | Hour [0-11]                     |  70 | K       | 1, 2, ..., 11, 0                  |       |
   * |                                 |     | Ko      | 1st, 2nd, ..., 11th, 0th          | 5     |
   * |                                 |     | KK      | 1, 2, ..., 11, 0                  |       |
   * | Hour [1-24]                     |  70 | k       | 24, 1, 2, ..., 23                 |       |
   * |                                 |     | ko      | 24th, 1st, 2nd, ..., 23rd         | 5     |
   * |                                 |     | kk      | 24, 01, 02, ..., 23               |       |
   * | Minute                          |  60 | m       | 0, 1, ..., 59                     |       |
   * |                                 |     | mo      | 0th, 1st, ..., 59th               | 5     |
   * |                                 |     | mm      | 00, 01, ..., 59                   |       |
   * | Second                          |  50 | s       | 0, 1, ..., 59                     |       |
   * |                                 |     | so      | 0th, 1st, ..., 59th               | 5     |
   * |                                 |     | ss      | 00, 01, ..., 59                   |       |
   * | Seconds timestamp               |  40 | t       | 512969520                         |       |
   * |                                 |     | tt      | ...                               | 2     |
   * | Fraction of second              |  30 | S       | 0, 1, ..., 9                      |       |
   * |                                 |     | SS      | 00, 01, ..., 99                   |       |
   * |                                 |     | SSS     | 000, 0001, ..., 999               |       |
   * |                                 |     | SSSS    | ...                               | 2     |
   * | Milliseconds timestamp          |  20 | T       | 512969520900                      |       |
   * |                                 |     | TT      | ...                               | 2     |
   * | Timezone (ISO-8601 w/ Z)        |  10 | X       | -08, +0530, Z                     |       |
   * |                                 |     | XX      | -0800, +0530, Z                   |       |
   * |                                 |     | XXX     | -08:00, +05:30, Z                 |       |
   * |                                 |     | XXXX    | -0800, +0530, Z, +123456          | 2     |
   * |                                 |     | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
   * | Timezone (ISO-8601 w/o Z)       |  10 | x       | -08, +0530, +00                   |       |
   * |                                 |     | xx      | -0800, +0530, +0000               |       |
   * |                                 |     | xxx     | -08:00, +05:30, +00:00            | 2     |
   * |                                 |     | xxxx    | -0800, +0530, +0000, +123456      |       |
   * |                                 |     | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
   * Notes:
   * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
   *    are the same as "stand-alone" units, but are different in some languages.
   *    "Formatting" units are declined according to the rules of the language
   *    in the context of a date. "Stand-alone" units are always nominative singular.
   *    In `format` function, they will produce different result:
   *
   *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
   *
   *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
   *
   *    `parse` will try to match both formatting and stand-alone units interchangably.
   *
   * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
   *    the single quote characters (see below).
   *    If the sequence is longer than listed in table:
   *    - for numerical units (`yyyyyyyy`) `parse` will try to match a number
   *      as wide as the sequence
   *    - for text units (`MMMMMMMM`) `parse` will try to match the widest variation of the unit.
   *      These variations are marked with "2" in the last column of the table.
   *
   * 3. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
   *    These tokens represent the shortest form of the quarter.
   *
   * 4. The main difference between `y` and `u` patterns are B.C. years:
   *
   *    | Year | `y` | `u` |
   *    |------|-----|-----|
   *    | AC 1 |   1 |   1 |
   *    | BC 1 |   1 |   0 |
   *    | BC 2 |   2 |  -1 |
   *
   *    Also `yy` will try to guess the century of two digit year by proximity with `baseDate`:
   *
   *    `parse('50', 'yy', new Date(2018, 0, 1)) //=> Sat Jan 01 2050 00:00:00`
   *
   *    `parse('75', 'yy', new Date(2018, 0, 1)) //=> Wed Jan 01 1975 00:00:00`
   *
   *    while `uu` will just assign the year as is:
   *
   *    `parse('50', 'uu', new Date(2018, 0, 1)) //=> Sat Jan 01 0050 00:00:00`
   *
   *    `parse('75', 'uu', new Date(2018, 0, 1)) //=> Tue Jan 01 0075 00:00:00`
   *
   *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
   *    except local week-numbering years are dependent on `options.weekStartsOn`
   *    and `options.firstWeekContainsDate` (compare [setISOWeekYear]{@link https://date-fns.org/docs/setISOWeekYear}
   *    and [setWeekYear]{@link https://date-fns.org/docs/setWeekYear}).
   *
   * 5. These patterns are not in the Unicode Technical Standard #35:
   *    - `i`: ISO day of week
   *    - `I`: ISO week of year
   *    - `R`: ISO week-numbering year
   *    - `o`: ordinal number modifier
   *
   * 6. These tokens are often confused with others. See: https://git.io/fxCyr
   *
   * Values will be assigned to the date in the descending order of its unit's priority.
   * Units of an equal priority overwrite each other in the order of appearance.
   *
   * If no values of higher priority are parsed (e.g. when parsing string 'January 1st' without a year),
   * the values will be taken from 3rd argument `baseDate` which works as a context of parsing.
   *
   * `baseDate` must be passed for correct work of the function.
   * If you're not sure which `baseDate` to supply, create a new instance of Date:
   * `parse('02/11/2014', 'MM/dd/yyyy', new Date())`
   * In this case parsing will be done in the context of the current date.
   * If `baseDate` is `Invalid Date` or a value not convertible to valid `Date`,
   * then `Invalid Date` will be returned.
   *
   * The result may vary by locale.
   *
   * If `formatString` matches with `dateString` but does not provides tokens, `baseDate` will be returned.
   *
   * If parsing failed, `Invalid Date` will be returned.
   * Invalid Date is a Date, whose time value is NaN.
   * Time value of Date: http://es5.github.io/#x15.9.1.1
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * - Old `parse` was renamed to `toDate`.
   *   Now `parse` is a new function which parses a string using a provided format.
   *
   *   ```javascript
   *   // Before v2.0.0
   *   parse('2016-01-01')
   *
   *   // v2.0.0 onward
   *   toDate('2016-01-01')
   *   parse('2016-01-01', 'yyyy-MM-dd', new Date())
   *   ```
   *
   * @param {String} dateString - the string to parse
   * @param {String} formatString - the string of tokens
   * @param {Date|Number} baseDate - defines values missing from the parsed dateString
   * @param {Object} [options] - an object with options.
   * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
   * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
   * @param {1|2|3|4|5|6|7} [options.firstWeekContainsDate=1] - the day of January, which is always in the first week of the year
   * @param {Boolean} [options.awareOfUnicodeTokens=false] - if true, allows usage of Unicode tokens causes confusion:
   *   - Some of the day of year tokens (`D`, `DD`) that are confused with the day of month tokens (`d`, `dd`).
   *   - Some of the local week-numbering year tokens (`YY`, `YYYY`) that are confused with the calendar year tokens (`yy`, `yyyy`).
   *   See: https://git.io/fxCyr
   * @returns {Date} the parsed date
   * @throws {TypeError} 3 arguments required
   * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
   * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
   * @throws {RangeError} `options.locale` must contain `match` property
   * @throws {RangeError} `options.awareOfUnicodeTokens` must be set to `true` to use `XX` token; see: https://git.io/fxCyr
   *
   * @example
   * // Parse 11 February 2014 from middle-endian format:
   * var result = parse('02/11/2014', 'MM/dd/yyyy', new Date())
   * //=> Tue Feb 11 2014 00:00:00
   *
   * @example
   * // Parse 28th of February in Esperanto locale in the context of 2010 year:
   * import eo from 'date-fns/locale/eo'
   * var result = parse('28-a de februaro', "do 'de' MMMM", new Date(2010, 0, 1), {
   *   locale: eo
   * })
   * //=> Sun Feb 28 2010 00:00:00
   */
  function parse(
    dirtyDateString,
    dirtyFormatString,
    dirtyBaseDate,
    dirtyOptions
  ) {
    if (arguments.length < 3) {
      throw new TypeError(
        '3 arguments required, but only ' + arguments.length + ' present'
      )
    }

    var dateString = String(dirtyDateString);
    var formatString = String(dirtyFormatString);
    var options = dirtyOptions || {};

    var locale$1 = options.locale || locale;

    if (!locale$1.match) {
      throw new RangeError('locale must contain match property')
    }

    var localeFirstWeekContainsDate =
      locale$1.options && locale$1.options.firstWeekContainsDate;
    var defaultFirstWeekContainsDate =
      localeFirstWeekContainsDate == null
        ? 1
        : toInteger(localeFirstWeekContainsDate);
    var firstWeekContainsDate =
      options.firstWeekContainsDate == null
        ? defaultFirstWeekContainsDate
        : toInteger(options.firstWeekContainsDate);

    // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
    if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
      throw new RangeError(
        'firstWeekContainsDate must be between 1 and 7 inclusively'
      )
    }

    var localeWeekStartsOn = locale$1.options && locale$1.options.weekStartsOn;
    var defaultWeekStartsOn =
      localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
    var weekStartsOn =
      options.weekStartsOn == null
        ? defaultWeekStartsOn
        : toInteger(options.weekStartsOn);

    // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
    if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
      throw new RangeError('weekStartsOn must be between 0 and 6 inclusively')
    }

    if (formatString === '') {
      if (dateString === '') {
        return toDate(dirtyBaseDate)
      } else {
        return new Date(NaN)
      }
    }

    var subFnOptions = {
      firstWeekContainsDate: firstWeekContainsDate,
      weekStartsOn: weekStartsOn,
      locale: locale$1
    };

    // If timezone isn't specified, it will be set to the system timezone
    var setters = [
      {
        priority: TIMEZONE_UNIT_PRIORITY,
        set: dateToSystemTimezone,
        index: 0
      }
    ];

    var i;

    var tokens = formatString.match(formattingTokensRegExp$1);

    for (i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (!options.awareOfUnicodeTokens && isProtectedToken(token)) {
        throwProtectedError(token);
      }

      var firstCharacter = token[0];
      var parser = parsers[firstCharacter];
      if (parser) {
        var parseResult = parser.parse(
          dateString,
          token,
          locale$1.match,
          subFnOptions
        );

        if (!parseResult) {
          return new Date(NaN)
        }

        setters.push({
          priority: parser.priority,
          set: parser.set,
          validate: parser.validate,
          value: parseResult.value,
          index: setters.length
        });

        dateString = parseResult.rest;
      } else {
        // Replace two single quote characters with one single quote character
        if (token === "''") {
          token = "'";
        } else if (firstCharacter === "'") {
          token = cleanEscapedString$1(token);
        }

        // Cut token from string, or, if string doesn't match the token, return Invalid Date
        if (dateString.indexOf(token) === 0) {
          dateString = dateString.slice(token.length);
        } else {
          return new Date(NaN)
        }
      }
    }

    // Check if the remaining input contains something other than whitespace
    if (dateString.length > 0 && notWhitespaceRegExp.test(dateString)) {
      return new Date(NaN)
    }

    var uniquePrioritySetters = setters
      .map(function(setter) {
        return setter.priority
      })
      .sort(function(a, b) {
        return b - a
      })
      .filter(function(priority, index, array) {
        return array.indexOf(priority) === index
      })
      .map(function(priority) {
        return setters
          .filter(function(setter) {
            return setter.priority === priority
          })
          .reverse()
      })
      .map(function(setterArray) {
        return setterArray[0]
      });

    var date = toDate(dirtyBaseDate);

    if (isNaN(date)) {
      return new Date(NaN)
    }

    // Convert the date in system timezone to the same date in UTC+00:00 timezone.
    // This ensures that when UTC functions will be implemented, locales will be compatible with them.
    // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/37
    var utcDate = subMilliseconds(date, getTimezoneOffsetInMilliseconds(date));

    var flags = {};
    for (i = 0; i < uniquePrioritySetters.length; i++) {
      var setter = uniquePrioritySetters[i];

      if (
        setter.validate &&
        !setter.validate(utcDate, setter.value, subFnOptions)
      ) {
        return new Date(NaN)
      }

      var result = setter.set(utcDate, flags, setter.value, subFnOptions);
      // Result is tuple (date, flags)
      if (result[0]) {
        utcDate = result[0];
        assign(flags, result[1]);
        // Result is date
      } else {
        utcDate = result;
      }
    }

    return utcDate
  }

  function dateToSystemTimezone(date, flags) {
    if (flags.timestampIsSet) {
      return date
    }

    var convertedDate = new Date(0);
    convertedDate.setFullYear(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
    convertedDate.setHours(
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    );
    return convertedDate
  }

  function cleanEscapedString$1(input) {
    return input.match(escapedStringRegExp$1)[1].replace(doubleQuoteRegExp$1, "'")
  }

  // This file is generated automatically by `scripts/build/indices.js`. Please, don't change it.

  // 

  /**
   * Custom parse behavior on top of date-fns parse function.
   */
  function parseDate (date, format$1) {
    if (typeof date !== 'string') {
      return isValid(date) ? date : null
    }

    var parsed = parse(date, format$1, new Date());

    // if date is not valid or the formatted output after parsing does not match
    // the string value passed in (avoids overflows)
    if (!isValid(parsed) || format(parsed, format$1) !== date) {
      return null
    }

    return parsed
  }

  var afterValidator = function (value, ref) {
    if ( ref === void 0 ) ref = {};
    var targetValue = ref.targetValue;
    var inclusion = ref.inclusion; if ( inclusion === void 0 ) inclusion = false;
    var format = ref.format;

    if (typeof format === 'undefined') {
      format = inclusion;
      inclusion = false;
    }

    value = parseDate(value, format);
    targetValue = parseDate(targetValue, format);

    // if either is not valid.
    if (!value || !targetValue) {
      return false
    }

    return isAfter(value, targetValue) || (inclusion && isEqual(value, targetValue))
  };

  var options = {
    hasTarget: true,
    isDate: true,
  };

  // required to convert from a list of array values to an object.
  var paramNames = ['targetValue', 'inclusion', 'format'];

  var after = {
    validate: afterValidator,
    options: options,
    paramNames: paramNames,
  };

  /**
   * Some Alpha Regex helpers.
   * https://github.com/chriso/validator.js/blob/master/src/lib/alpha.js
   */

  var alpha = {
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
    sv: /^[A-ZÅÄÖ]*$/i,
    tr: /^[A-ZÇĞİıÖŞÜ]*$/i,
    uk: /^[А-ЩЬЮЯЄІЇҐ]*$/i,
    ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/,
    az: /^[A-ZÇƏĞİıÖŞÜ]*$/i,
  };

  var alphaSpaces = {
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
    sv: /^[A-ZÅÄÖ\s]*$/i,
    tr: /^[A-ZÇĞİıÖŞÜ\s]*$/i,
    uk: /^[А-ЩЬЮЯЄІЇҐ\s]*$/i,
    ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ\s]*$/,
    az: /^[A-ZÇƏĞİıÖŞÜ\s]*$/i,
  };

  var alphanumeric = {
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
    sv: /^[0-9A-ZÅÄÖ]*$/i,
    tr: /^[0-9A-ZÇĞİıÖŞÜ]*$/i,
    uk: /^[0-9А-ЩЬЮЯЄІЇҐ]*$/i,
    ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/,
    az: /^[0-9A-ZÇƏĞİıÖŞÜ]*$/i,
  };

  var alphaDash = {
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
    sv: /^[0-9A-ZÅÄÖ_-]*$/i,
    tr: /^[0-9A-ZÇĞİıÖŞÜ_-]*$/i,
    uk: /^[0-9А-ЩЬЮЯЄІЇҐ_-]*$/i,
    ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ_-]*$/,
    az: /^[0-9A-ZÇƏĞİıÖŞÜ_-]*$/i,
  };

  var validate = function (value, ref) {
    if ( ref === void 0 ) ref = {};
    var locale = ref.locale;

    if (Array.isArray(value)) {
      return value.every(function (val) { return validate(val, [locale]); })
    }

    // Match at least one locale.
    if (!locale) {
      return Object.keys(alpha).some(function (loc) { return alpha[loc].test(value); })
    }

    return (alpha[locale] || alpha.en).test(value)
  };

  var paramNames$1 = ['locale'];

  var alpha$1 = {
    validate: validate,
    paramNames: paramNames$1,
  };

  var validate$1 = function (value, ref) {
    if ( ref === void 0 ) ref = {};
    var locale = ref.locale;

    if (Array.isArray(value)) {
      return value.every(function (val) { return validate$1(val, [locale]); })
    }

    // Match at least one locale.
    if (!locale) {
      return Object.keys(alphaDash).some(function (loc) { return alphaDash[loc].test(value); })
    }

    return (alphaDash[locale] || alphaDash.en).test(value)
  };

  var paramNames$2 = ['locale'];

  var alpha_dash = {
    validate: validate$1,
    paramNames: paramNames$2,
  };

  var validate$2 = function (value, ref) {
    if ( ref === void 0 ) ref = {};
    var locale = ref.locale;

    if (Array.isArray(value)) {
      return value.every(function (val) { return validate$2(val, [locale]); })
    }

    // Match at least one locale.
    if (!locale) {
      return Object.keys(alphanumeric).some(function (loc) { return alphanumeric[loc].test(value); })
    }

    return (alphanumeric[locale] || alphanumeric.en).test(value)
  };

  var paramNames$3 = ['locale'];

  var alpha_num = {
    validate: validate$2,
    paramNames: paramNames$3,
  };

  var validate$3 = function (value, ref) {
    if ( ref === void 0 ) ref = {};
    var locale = ref.locale;

    if (Array.isArray(value)) {
      return value.every(function (val) { return validate$3(val, [locale]); })
    }

    // Match at least one locale.
    if (!locale) {
      return Object.keys(alphaSpaces).some(function (loc) { return alphaSpaces[loc].test(value); })
    }

    return (alphaSpaces[locale] || alphaSpaces.en).test(value)
  };

  var paramNames$4 = ['locale'];

  var alpha_spaces = {
    validate: validate$3,
    paramNames: paramNames$4,
  };

  var validate$4 = function (value, ref) {
    if ( ref === void 0 ) ref = {};
    var targetValue = ref.targetValue;
    var inclusion = ref.inclusion; if ( inclusion === void 0 ) inclusion = false;
    var format = ref.format;

    if (typeof format === 'undefined') {
      format = inclusion;
      inclusion = false;
    }

    value = parseDate(value, format);
    targetValue = parseDate(targetValue, format);

    // if either is not valid.
    if (!value || !targetValue) {
      return false
    }

    return isBefore(value, targetValue) || (inclusion && isEqual(value, targetValue))
  };

  var options$1 = {
    hasTarget: true,
    isDate: true,
  };

  var paramNames$5 = ['targetValue', 'inclusion', 'format'];

  var before = {
    validate: validate$4,
    options: options$1,
    paramNames: paramNames$5,
  };

  var validate$5 = function (value, ref) {
    if ( ref === void 0 ) ref = {};
    var min = ref.min;
    var max = ref.max;

    if (Array.isArray(value)) {
      return value.every(function (val) { return validate$5(val, { min: min, max: max }); })
    }

    return Number(min) <= value && Number(max) >= value
  };

  var paramNames$6 = ['min', 'max'];

  var between = {
    validate: validate$5,
    paramNames: paramNames$6,
  };

  var validate$6 = function (value, ref) {
    var targetValue = ref.targetValue;

    return String(value) === String(targetValue);
  };
  var options$2 = {
    hasTarget: true,
  };

  var paramNames$7 = ['targetValue'];

  var confirmed = {
    validate: validate$6,
    options: options$2,
    paramNames: paramNames$7,
  };

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var assertString_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = assertString;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function assertString(input) {
    var isString = typeof input === 'string' || input instanceof String;

    if (!isString) {
      var invalidType;

      if (input === null) {
        invalidType = 'null';
      } else {
        invalidType = _typeof(input);

        if (invalidType === 'object' && input.constructor && input.constructor.hasOwnProperty('name')) {
          invalidType = input.constructor.name;
        } else {
          invalidType = "a ".concat(invalidType);
        }
      }

      throw new TypeError("Expected string but received ".concat(invalidType, "."));
    }
  }

  module.exports = exports.default;
  module.exports.default = exports.default;
  });

  unwrapExports(assertString_1);

  var isCreditCard_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isCreditCard;

  var _assertString = _interopRequireDefault(assertString_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /* eslint-disable max-len */
  var creditCard = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|6[27][0-9]{14})$/;
  /* eslint-enable max-len */

  function isCreditCard(str) {
    (0, _assertString.default)(str);
    var sanitized = str.replace(/[- ]+/g, '');

    if (!creditCard.test(sanitized)) {
      return false;
    }

    var sum = 0;
    var digit;
    var tmpNum;
    var shouldDouble;

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

  module.exports = exports.default;
  module.exports.default = exports.default;
  });

  var isCreditCard = unwrapExports(isCreditCard_1);

  var validate$7 = function (value) { return isCreditCard(String(value)); };

  var credit_card = {
    validate: validate$7,
  };

  var validate$8 = function (value, ref) {
    if ( ref === void 0 ) ref = {};
    var min = ref.min;
    var max = ref.max;
    var inclusivity = ref.inclusivity; if ( inclusivity === void 0 ) inclusivity = '()';
    var format = ref.format;

    if (typeof format === 'undefined') {
      format = inclusivity;
      inclusivity = '()';
    }

    var minDate = parseDate(String(min), format);
    var maxDate = parseDate(String(max), format);
    var dateVal = parseDate(String(value), format);

    if (!minDate || !maxDate || !dateVal) {
      return false
    }

    if (inclusivity === '()') {
      return isAfter(dateVal, minDate) && isBefore(dateVal, maxDate)
    }

    if (inclusivity === '(]') {
      return isAfter(dateVal, minDate) && (isEqual(dateVal, maxDate) || isBefore(dateVal, maxDate))
    }

    if (inclusivity === '[)') {
      return isBefore(dateVal, maxDate) && (isEqual(dateVal, minDate) || isAfter(dateVal, minDate))
    }

    return isEqual(dateVal, maxDate) || isEqual(dateVal, minDate) ||
      (isBefore(dateVal, maxDate) && isAfter(dateVal, minDate))
  };

  var options$3 = {
    isDate: true,
  };

  var paramNames$8 = ['min', 'max', 'inclusivity', 'format'];

  var date_between = {
    validate: validate$8,
    options: options$3,
    paramNames: paramNames$8,
  };

  var validate$9 = function (value, ref) {
    var format = ref.format;

    return !!parseDate(value, format)
  };

  var options$4 = {
    isDate: true,
  };

  var paramNames$9 = ['format'];

  var date_format = {
    validate: validate$9,
    options: options$4,
    paramNames: paramNames$9,
  };

  var validate$a = function (value, ref) {
    if ( ref === void 0 ) ref = {};
    var decimals = ref.decimals; if ( decimals === void 0 ) decimals = '*';
    var separator = ref.separator; if ( separator === void 0 ) separator = '.';

    if (Array.isArray(value)) {
      return value.every(function (val) { return validate$a(val, { decimals: decimals, separator: separator }); })
    }

    if (value === null || value === undefined || value === '') {
      return false
    }

    // if is 0.
    if (Number(decimals) === 0) {
      return /^-?\d*$/.test(value)
    }

    var regexPart = decimals === '*' ? '+' : ("{1," + decimals + "}");
    var regex = new RegExp(("^[-+]?\\d*(\\" + separator + "\\d" + regexPart + ")?$"));

    if (!regex.test(value)) {
      return false
    }

    var parsedValue = parseFloat(value);

    // eslint-disable-next-line
    return parsedValue === parsedValue
  };

  var paramNames$a = ['decimals', 'separator'];

  var decimal = {
    validate: validate$a,
    paramNames: paramNames$a,
  };

  var validate$b = function (value, ref) {
    var length = ref[0];

    if (Array.isArray(value)) {
      return value.every(function (val) { return validate$b(val, [length]); })
    }
    var strVal = String(value);

    return /^[0-9]*$/.test(strVal) && strVal.length === Number(length)
  };

  var digits = {
    validate: validate$b,
  };

  var validateImage = function (file, width, height) {
    var URL = window.URL || window.webkitURL;
    return new Promise(function (resolve) {
      var image = new Image();
      image.onerror = function () { return resolve({ valid: false }); };
      image.onload = function () { return resolve({
        valid: image.width === Number(width) && image.height === Number(height),
      }); };

      image.src = URL.createObjectURL(file);
    })
  };

  var validate$c = function (files, ref) {
    var width = ref[0];
    var height = ref[1];

    var list = [];
    for (var i = 0; i < files.length; i++) {
      // if file is not an image, reject.
      if (!/\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
        return false
      }

      list.push(files[i]);
    }

    return Promise.all(list.map(function (file) { return validateImage(file, width, height); }))
  };

  var dimensions = {
    validate: validate$c,
  };

  var merge_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = merge;

  function merge() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaults = arguments.length > 1 ? arguments[1] : undefined;

    for (var key in defaults) {
      if (typeof obj[key] === 'undefined') {
        obj[key] = defaults[key];
      }
    }

    return obj;
  }

  module.exports = exports.default;
  module.exports.default = exports.default;
  });

  unwrapExports(merge_1);

  var isByteLength_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isByteLength;

  var _assertString = _interopRequireDefault(assertString_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  /* eslint-disable prefer-rest-params */
  function isByteLength(str, options) {
    (0, _assertString.default)(str);
    var min;
    var max;

    if (_typeof(options) === 'object') {
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

  module.exports = exports.default;
  module.exports.default = exports.default;
  });

  unwrapExports(isByteLength_1);

  var isFQDN_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isFQDN;

  var _assertString = _interopRequireDefault(assertString_1);

  var _merge = _interopRequireDefault(merge_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var default_fqdn_options = {
    require_tld: true,
    allow_underscores: false,
    allow_trailing_dot: false
  };

  function isFQDN(str, options) {
    (0, _assertString.default)(str);
    options = (0, _merge.default)(options, default_fqdn_options);
    /* Remove the optional trailing dot before checking validity */

    if (options.allow_trailing_dot && str[str.length - 1] === '.') {
      str = str.substring(0, str.length - 1);
    }

    var parts = str.split('.');

    for (var i = 0; i < parts.length; i++) {
      if (parts[i].length > 63) {
        return false;
      }
    }

    if (options.require_tld) {
      var tld = parts.pop();

      if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
        return false;
      } // disallow spaces


      if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20]/.test(tld)) {
        return false;
      }
    }

    for (var part, _i = 0; _i < parts.length; _i++) {
      part = parts[_i];

      if (options.allow_underscores) {
        part = part.replace(/_/g, '');
      }

      if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
        return false;
      } // disallow full-width chars


      if (/[\uff01-\uff5e]/.test(part)) {
        return false;
      }

      if (part[0] === '-' || part[part.length - 1] === '-') {
        return false;
      }
    }

    return true;
  }

  module.exports = exports.default;
  module.exports.default = exports.default;
  });

  unwrapExports(isFQDN_1);

  var isIP_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isIP;

  var _assertString = _interopRequireDefault(assertString_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  var ipv6Block = /^[0-9A-F]{1,4}$/i;

  function isIP(str) {
    var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    (0, _assertString.default)(str);
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
      } // initial or final ::


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
        } else if (foundIPv4TransitionBlock && i === blocks.length - 1) ; else if (!ipv6Block.test(blocks[i])) {
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

  module.exports = exports.default;
  module.exports.default = exports.default;
  });

  var isIP = unwrapExports(isIP_1);

  var isEmail_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isEmail;

  var _assertString = _interopRequireDefault(assertString_1);

  var _merge = _interopRequireDefault(merge_1);

  var _isByteLength = _interopRequireDefault(isByteLength_1);

  var _isFQDN = _interopRequireDefault(isFQDN_1);

  var _isIP = _interopRequireDefault(isIP_1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var default_email_options = {
    allow_display_name: false,
    require_display_name: false,
    allow_utf8_local_part: true,
    require_tld: true
  };
  /* eslint-disable max-len */

  /* eslint-disable no-control-regex */

  var displayName = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\,\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
  var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
  var gmailUserPart = /^[a-z\d]+$/;
  var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
  var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
  var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
  /* eslint-enable max-len */

  /* eslint-enable no-control-regex */

  function isEmail(str, options) {
    (0, _assertString.default)(str);
    options = (0, _merge.default)(options, default_email_options);

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

    if (options.domain_specific_validation && (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com')) {
      /*
        Previously we removed dots for gmail addresses before validating.
        This was removed because it allows `multiple..dots@gmail.com`
        to be reported as valid, but it is not.
        Gmail only normalizes single dots, removing them from here is pointless,
        should be done in normalizeEmail
      */
      user = user.toLowerCase(); // Removing sub-address from username before gmail validation

      var username = user.split('+')[0]; // Dots are not included in gmail length restriction

      if (!(0, _isByteLength.default)(username.replace('.', ''), {
        min: 6,
        max: 30
      })) {
        return false;
      }

      var _user_parts = username.split('.');

      for (var i = 0; i < _user_parts.length; i++) {
        if (!gmailUserPart.test(_user_parts[i])) {
          return false;
        }
      }
    }

    if (!(0, _isByteLength.default)(user, {
      max: 64
    }) || !(0, _isByteLength.default)(domain, {
      max: 254
    })) {
      return false;
    }

    if (!(0, _isFQDN.default)(domain, {
      require_tld: options.require_tld
    })) {
      if (!options.allow_ip_domain) {
        return false;
      }

      if (!(0, _isIP.default)(domain)) {
        if (!domain.startsWith('[') || !domain.endsWith(']')) {
          return false;
        }

        var noBracketdomain = domain.substr(1, domain.length - 2);

        if (noBracketdomain.length === 0 || !(0, _isIP.default)(noBracketdomain)) {
          return false;
        }
      }
    }

    if (user[0] === '"') {
      user = user.slice(1, user.length - 1);
      return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
    }

    var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
    var user_parts = user.split('.');

    for (var _i = 0; _i < user_parts.length; _i++) {
      if (!pattern.test(user_parts[_i])) {
        return false;
      }
    }

    return true;
  }

  module.exports = exports.default;
  module.exports.default = exports.default;
  });

  var isEmail = unwrapExports(isEmail_1);

  var validate$d = function (value, options) {
    if ( options === void 0 ) options = {};

    if (options.multiple) {
      value = value.split(',').map(function (emailStr) { return emailStr.trim(); });
    }

    if (Array.isArray(value)) {
      return value.every(function (val) { return isEmail(String(val), options); })
    }

    return isEmail(String(value), options)
  };

  var email = {
    validate: validate$d,
  };

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
  var assign$1 = function (target) {
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
          assign$1(target, ( obj = {}, obj[key] = {}, obj ));
        }

        merge(target[key], source[key]);
        return
      }

      assign$1(target, ( obj$1 = {}, obj$1[key] = source[key], obj$1 ));
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

  var validate$e = function (value, options) {
    if (Array.isArray(value)) {
      return value.every(function (val) { return validate$e(val, options); })
    }

    return toArray(options).some(function (item) {
      // eslint-disable-next-line
      return item == value
    })
  };

  var included = {
    validate: validate$e,
  };

  var validate$f = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return !validate$e.apply(void 0, args)
  };

  var excluded = {
    validate: validate$f,
  };

  var validate$g = function (files, extensions) {
    var regex = new RegExp((".(" + (extensions.join('|')) + ")$"), 'i');

    return files.every(function (file) { return regex.test(file.name); })
  };

  var ext = {
    validate: validate$g,
  };

  var validate$h = function (files) { return files.every(function (file) { return /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name); }); };

  var image = {
    validate: validate$h,
  };

  var validate$i = function (value) {
    if (Array.isArray(value)) {
      return value.every(function (val) { return /^-?[0-9]+$/.test(String(val)); })
    }

    return /^-?[0-9]+$/.test(String(value))
  };

  var integer = {
    validate: validate$i,
  };

  var validate$j = function (value, ref) {
    if ( ref === void 0 ) ref = {};
    var version = ref.version; if ( version === void 0 ) version = 4;

    if (isNullOrUndefined(value)) {
      value = '';
    }

    if (Array.isArray(value)) {
      return value.every(function (val) { return isIP(val, version); })
    }

    return isIP(value, version)
  };

  var paramNames$b = ['version'];

  var ip = {
    validate: validate$j,
    paramNames: paramNames$b,
  };

  var validate$k = function (value, ref) {
    if ( ref === void 0 ) ref = [];
    var other = ref[0];

    return value === other
  };

  var is = {
    validate: validate$k,
  };

  var validate$l = function (value, ref) {
    if ( ref === void 0 ) ref = [];
    var other = ref[0];

    return value !== other
  };

  var is_not = {
    validate: validate$l,
  };

  /**
   * @param {Array|String} value
   * @param {Number} length
   * @param {Number} max
   */
  var compare = function (value, length, max) {
    if (max === undefined) {
      return value.length === length
    }

    // cast to number.
    max = Number(max);

    return value.length >= length && value.length <= max
  };

  var validate$m = function (value, ref) {
    var length = ref[0];
    var max = ref[1]; if ( max === void 0 ) max = undefined;

    length = Number(length);
    if (value === undefined || value === null) {
      return false
    }

    if (typeof value === 'number') {
      value = String(value);
    }

    if (!value.length) {
      value = toArray(value);
    }

    return compare(value, length, max)
  };

  var length = {
    validate: validate$m,
  };

  var validate$n = function (value, ref) {
    var length = ref[0];

    if (value === undefined || value === null) {
      return length >= 0
    }

    if (Array.isArray(value)) {
      return value.every(function (val) { return validate$n(val, [length]); })
    }

    return String(value).length <= length
  };

  var max = {
    validate: validate$n,
  };

  var validate$o = function (value, ref) {
    var max = ref[0];

    if (value === null || value === undefined || value === '') {
      return false
    }

    if (Array.isArray(value)) {
      return value.length > 0 && value.every(function (val) { return validate$o(val, [max]); })
    }

    return Number(value) <= max
  };

  var max_value = {
    validate: validate$o,
  };

  var validate$p = function (files, mimes) {
    var regex = new RegExp(((mimes.join('|').replace('*', '.+')) + "$"), 'i');

    return files.every(function (file) { return regex.test(file.type); })
  };

  var mimes = {
    validate: validate$p,
  };

  var validate$q = function (value, ref) {
    var length = ref[0];

    if (value === undefined || value === null) {
      return false
    }

    if (Array.isArray(value)) {
      return value.every(function (val) { return validate$q(val, [length]); })
    }

    return String(value).length >= length
  };

  var min = {
    validate: validate$q,
  };

  var validate$r = function (value, ref) {
    var min = ref[0];

    if (value === null || value === undefined || value === '') {
      return false
    }

    if (Array.isArray(value)) {
      return value.length > 0 && value.every(function (val) { return validate$r(val, [min]); })
    }

    return Number(value) >= min
  };

  var min_value = {
    validate: validate$r,
  };

  var validate$s = function (value) {
    if (Array.isArray(value)) {
      return value.every(function (val) { return /^[0-9]+$/.test(String(val)); })
    }

    return /^[0-9]+$/.test(String(value))
  };

  var numeric = {
    validate: validate$s,
  };

  var validate$t = function (value, ref) {
    var expression = ref.expression;

    if (typeof expression === 'string') {
      expression = new RegExp(expression);
    }

    if (Array.isArray(value)) {
      return value.every(function (val) { return validate$t(val, { expression: expression }); })
    }

    return expression.test(String(value))
  };

  var paramNames$c = ['expression'];

  var regex = {
    validate: validate$t,
    paramNames: paramNames$c,
  };

  var validate$u = function (value, ref) {
    if ( ref === void 0 ) ref = [];
    var invalidateFalse = ref[0]; if ( invalidateFalse === void 0 ) invalidateFalse = false;

    if (isEmptyArray(value)) {
      return false
    }

    // incase a field considers `false` as an empty value like checkboxes.
    if (value === false && invalidateFalse) {
      return false
    }

    if (value === undefined || value === null) {
      return false
    }

    return !!String(value).trim().length
  };

  var required = {
    validate: validate$u,
  };

  var validate$v = function (value, ref) {
    if ( ref === void 0 ) ref = [];
    var otherFieldVal = ref[0];
    var possibleVals = ref.slice(1);

    var required = possibleVals.includes(String(otherFieldVal).trim());

    if (!required) {
      return {
        valid: true,
        data: {
          required: required,
        },
      }
    }

    var invalid = (isEmptyArray(value) || [false, null, undefined].includes(value));

    invalid = invalid || !String(value).trim().length;

    return {
      valid: !invalid,
      data: {
        required: required,
      },
    }
  };

  var options$5 = {
    hasTarget: true,
    computesRequired: true,
  };

  var required_if = {
    validate: validate$v,
    options: options$5,
  };

  var validate$w = function (files, ref) {
    var size = ref[0];

    if (isNaN(size)) {
      return false
    }

    var nSize = Number(size) * 1024;
    for (var i = 0; i < files.length; i++) {
      if (files[i].size > nSize) {
        return false
      }
    }

    return true
  };

  var size = {
    validate: validate$w,
  };

  var isURL_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = isURL;

  var _assertString = _interopRequireDefault(assertString_1);

  var _isFQDN = _interopRequireDefault(isFQDN_1);

  var _isIP = _interopRequireDefault(isIP_1);

  var _merge = _interopRequireDefault(merge_1);

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
    (0, _assertString.default)(url);

    if (!url || url.length >= 2083 || /[\s<>]/.test(url)) {
      return false;
    }

    if (url.indexOf('mailto:') === 0) {
      return false;
    }

    options = (0, _merge.default)(options, default_url_options);
    var protocol, auth, host, hostname, port, port_str, split, ipv6;
    split = url.split('#');
    url = split.shift();
    split = url.split('?');
    url = split.shift();
    split = url.split('://');

    if (split.length > 1) {
      protocol = split.shift().toLowerCase();

      if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
        return false;
      }
    } else if (options.require_protocol) {
      return false;
    } else if (url.substr(0, 2) === '//') {
      if (!options.allow_protocol_relative_urls) {
        return false;
      }

      split[0] = url.substr(2);
    }

    url = split.join('://');

    if (url === '') {
      return false;
    }

    split = url.split('/');
    url = split.shift();

    if (url === '' && !options.require_host) {
      return true;
    }

    split = url.split('@');

    if (split.length > 1) {
      if (options.disallow_auth) {
        return false;
      }

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

    if (!(0, _isIP.default)(host) && !(0, _isFQDN.default)(host, options) && (!ipv6 || !(0, _isIP.default)(ipv6, 6))) {
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

  module.exports = exports.default;
  module.exports.default = exports.default;
  });

  var isURL = unwrapExports(isURL_1);

  var validate$x = function (value, options) {
    if ( options === void 0 ) options = {};

    if (isNullOrUndefined(value)) {
      value = '';
    }

    if (Array.isArray(value)) {
      return value.every(function (val) { return isURL(val, options); })
    }

    return isURL(value, options)
  };

  var url = {
    validate: validate$x,
  };

  /* eslint-disable camelcase */

  var Rules = /*#__PURE__*/Object.freeze({
    after: after,
    alpha_dash: alpha_dash,
    alpha_num: alpha_num,
    alpha_spaces: alpha_spaces,
    alpha: alpha$1,
    before: before,
    between: between,
    confirmed: confirmed,
    credit_card: credit_card,
    date_between: date_between,
    date_format: date_format,
    decimal: decimal,
    digits: digits,
    dimensions: dimensions,
    email: email,
    ext: ext,
    image: image,
    included: included,
    integer: integer,
    length: length,
    ip: ip,
    is_not: is_not,
    is: is,
    max: max,
    max_value: max_value,
    mimes: mimes,
    min: min,
    min_value: min_value,
    excluded: excluded,
    numeric: numeric,
    regex: regex,
    required: required,
    required_if: required_if,
    size: size,
    url: url
  });

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
    this.classNames = assign$1({}, DEFAULT_OPTIONS.classNames);
    options = assign$1({}, DEFAULT_OPTIONS, options);
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

    if (!this.name && !this.targetOf) {
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
      options: assign$1({}, { hasTarget: false, immediate: true }, options || {}),
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
      dictionary = assign$1({}, dictionary);
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
      var options = assign$1({}, { name: field, rules: validations[field] });
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

  var currentConfig = assign$1({}, DEFAULT_CONFIG);

  var getConfig = function () { return currentConfig; };

  var setConfig = function (newConf) {
    currentConfig = assign$1({}, currentConfig, newConf);
  };

  // 

  var ReeValidate$1 = function ReeValidate (config) {
    this.configure(config);
    this._validator = new Validator(null, { fastExit: config && config.fastExit });
    this._initI18n(this.config);
  };

  var prototypeAccessors$5 = { i18nDriver: { configurable: true },config: { configurable: true } };
  var staticAccessors$2 = { i18nDriver: { configurable: true },config: { configurable: true } };

  ReeValidate$1.setI18nDriver = function setI18nDriver (driver, instance) {
    DictionaryResolver.setDriver(driver, instance);
  };

  ReeValidate$1.configure = function configure (config) {
    setConfig(config);
  };

  ReeValidate$1.use = function use (plugin, options) {
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

  ReeValidate$1.prototype._initI18n = function _initI18n (config) {
    var dictionary = config.dictionary;
      var i18n = config.i18n;
      var i18nRootKey = config.i18nRootKey;
      var locale = config.locale;

    // i18 is being used for localization.
    if (i18n) {
      ReeValidate$1.setI18nDriver('i18n', new I18nDictionary(i18n, i18nRootKey));
    }

    if (dictionary) {
      this.i18nDriver.merge(dictionary);
    }

    if (locale && !i18n) {
      this._validator.localize(locale);
    }
  };

  ReeValidate$1.prototype.configure = function configure (cfg) {
    ReeValidate$1.configure(cfg);
  };

  Object.defineProperties( ReeValidate$1.prototype, prototypeAccessors$5 );
  Object.defineProperties( ReeValidate$1, staticAccessors$2 );

  ReeValidate$1.Validator = Validator;
  ReeValidate$1.ErrorBag = ErrorBag;

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
        flags = assign$1({}, scope[field]);
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

  /**
   * Formates file size.
   *
   * @param {Number|String} size
   */
  var formatFileSize = function (size) {
    var units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var threshold = 1024;
    size = Number(size) * threshold;
    var i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold));
    return (((size / Math.pow(threshold, i)).toFixed(2) * 1) + " " + (units[i]))
  };

  /**
   * Checks if ree-validate is defined globally.
   */
  var isDefinedGlobally = function () {
    return typeof ReeValidate !== 'undefined'
  };

  var obj;

  var messages = {
    _default: function (field) { return ("The " + field + " value is not valid."); },
    after: function (field, ref) {
      var target = ref[0];
      var inclusion = ref[1];

      return ("The " + field + " must be after " + (inclusion ? 'or equal to ' : '') + target + ".");
  },
    alpha: function (field) { return ("The " + field + " field may only contain alphabetic characters."); },
    alpha_dash: function (field) { return ("The " + field + " field may contain alpha-numeric characters as well as dashes and underscores."); },
    alpha_num: function (field) { return ("The " + field + " field may only contain alpha-numeric characters."); },
    alpha_spaces: function (field) { return ("The " + field + " field may only contain alphabetic characters as well as spaces."); },
    before: function (field, ref) {
      var target = ref[0];
      var inclusion = ref[1];

      return ("The " + field + " must be before " + (inclusion ? 'or equal to ' : '') + target + ".");
  },
    between: function (field, ref) {
      var min = ref[0];
      var max = ref[1];

      return ("The " + field + " field must be between " + min + " and " + max + ".");
  },
    confirmed: function (field) { return ("The " + field + " confirmation does not match."); },
    credit_card: function (field) { return ("The " + field + " field is invalid."); },
    date_between: function (field, ref) {
      var min = ref[0];
      var max = ref[1];

      return ("The " + field + " must be between " + min + " and " + max + ".");
  },
    date_format: function (field, ref) {
      var format = ref[0];

      return ("The " + field + " must be in the format " + format + ".");
  },
    decimal: function (field, ref) {
      if ( ref === void 0 ) ref = [];
      var decimals = ref[0]; if ( decimals === void 0 ) decimals = '*';

      return ("The " + field + " field must be numeric and may contain " + (!decimals || decimals === '*' ? '' : decimals) + " decimal points.");
  },
    digits: function (field, ref) {
      var length = ref[0];

      return ("The " + field + " field must be numeric and exactly contain " + length + " digits.");
  },
    dimensions: function (field, ref) {
      var width = ref[0];
      var height = ref[1];

      return ("The " + field + " field must be " + width + " pixels by " + height + " pixels.");
  },
    email: function (field) { return ("The " + field + " field must be a valid email."); },
    excluded: function (field) { return ("The " + field + " field must be a valid value."); },
    ext: function (field) { return ("The " + field + " field must be a valid file."); },
    image: function (field) { return ("The " + field + " field must be an image."); },
    included: function (field) { return ("The " + field + " field must be a valid value."); },
    integer: function (field) { return ("The " + field + " field must be an integer."); },
    ip: function (field) { return ("The " + field + " field must be a valid ip address."); },
    length: function (field, ref) {
      var length = ref[0];
      var max = ref[1];

      if (max) {
        return ("The " + field + " length must be between " + length + " and " + max + ".")
      }

      return ("The " + field + " length must be " + length + ".")
    },
    max: function (field, ref) {
      var length = ref[0];

      return ("The " + field + " field may not be greater than " + length + " characters.");
  },
    max_value: function (field, ref) {
      var max = ref[0];

      return ("The " + field + " field must be " + max + " or less.");
  },
    mimes: function (field) { return ("The " + field + " field must have a valid file type."); },
    min: function (field, ref) {
      var length = ref[0];

      return ("The " + field + " field must be at least " + length + " characters.");
  },
    min_value: function (field, ref) {
      var min = ref[0];

      return ("The " + field + " field must be " + min + " or more.");
  },
    numeric: function (field) { return ("The " + field + " field may only contain numeric characters."); },
    regex: function (field) { return ("The " + field + " field format is invalid."); },
    required: function (field) { return ("The " + field + " field is required."); },
    required_if: function (field, ref) {
      var target = ref[0];

      return ("The " + field + " field is required when the " + target + " field has this value.");
  },
    size: function (field, ref) {
      var size = ref[0];

      return ("The " + field + " size must be less than " + (formatFileSize(size)) + ".");
  },
    url: function (field) { return ("The " + field + " field is not a valid URL."); },
  };

  var locale$1 = {
    name: 'en',
    messages: messages,
    attributes: {},
  };

  if (isDefinedGlobally()) {
    // eslint-disable-next-line
    ReeValidate.Validator.localize(( obj = {}, obj[locale$1.name] = locale$1, obj ));
  }

  Object.keys(Rules).forEach(function (rule) {
    ReeValidate$1.Validator.extend(rule, Rules[rule].validate, assign$1({}, Rules[rule].options, { paramNames: Rules[rule].paramNames }));
  });

  ReeValidate$1.Validator.localize({
    en: locale$1,
  });

  ReeValidate$1.version = '3.3.0';
  ReeValidate$1.Rules = Rules;
  ReeValidate$1.mapFields = mapFields;

  return ReeValidate$1;

}));
