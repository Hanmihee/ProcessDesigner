/*
 * 콘솔 함수 관련 처리
 */
(function (window) {
    // IE 8 미만의 브라우저에서 console 관련 오류 방지
    var method,
        noop = function () { },
        methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ],
        length = methods.length,
        console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // 등록되어 있지 않는 메서드는 아무런 역할도 하지 않는 함수를 실행하도록 설정
        if (!console[method]) {
            console[method] = noop;
        }
    }
})(window || {});

/*
 * 자바스크립트 기본 형식 중 String에 대한 확장 함수를 등록
 */
(function (window) {

    // String 형식에 format 함수 추가
    if (typeof window.String.format === 'undefined') {

        /**
         * 포맷문자열에 실제 값을 대입하여 완성된 문자열을 가져옵니다.
         * @param {string} format 포맷문자열
         * @param {...string} args 포맷문자열에 적용할 실제 값 문자열 입니다.
         * @returns {string} 완성된 문자열
         */
        /* jshint -W004 */
        window.String.format = function (format, args) {
            var args = Array.prototype.slice.call(arguments, 1); // 첫 번째 포맷문자열을 제외한 파라미터들을 배열에 담는다.

            return format.replace(/{(\d+)}/g, function (match, number) {
                return !(typeof args[number] === 'undefined' || args[number] === null) ? args[number] : match;
            });
        };
        /* jshint +W004 */
    }

    // String 객체의 prototype에 format 함수 추가
    if (typeof window.String.prototype.format === 'undefined') {
        /**
         * 현재 문자열 포맷에 값을 대입하여 완성된 문자열을 가져옵니다.
         * @param {...string} args 포맷문자열
         * @returns {string} 완성된 문자열
         */
        /* jshint -W004 */
        window.String.prototype.format = function (args) {
            var args = Array.prototype.slice.call(arguments, 0);

            args.unshift(this); // 현재 문자열 객체를 배열의 제일 앞에 추가

            return String.format.apply(null, args);
        };
        /* jshint +W004 */
    }

    // String 객체의 prototype에 startsWith 함수 추가
    if (typeof window.String.prototype.startsWith === 'undefined') {
        /**
         * 문자열이 지정한 문자열로 시작하는지 확인합니다.
         * @param {string} str 시작하는지 여부를 검사할 문자열
         * @returns {boolean} 지정한 문자열로 시작되는지 여부
         */
        window.String.prototype.startsWith = function (str) {
            return !(typeof str === 'undefined' || str === null) ? this.indexOf(str) === 0 : false;
        };
    }

    if (typeof window.String.prototype.endsWith === 'undefined') {
        /**
         * 문자열이 지정한 문자열로 끝나는지를 확인합니다.
         * @param {string} str 문자열의 끝과 비교할 문자열
         * @returns {boolean} 지정한 문자열로 끝나는지 여부
         */
        window.String.prototype.endsWith = function (str) {
            return !(typeof str === 'undefined' || str === null) ? this.indexOf(str, this.length - str.length) !== -1 : false;
        };
    }
})(window || {});

/*
 * 자바스크립트 기본 형식 중 Number에 대한 확장 함수를 등록
 */
/* jshint bitwise:false */
(function (window) {

    if (typeof window.Number.prototype.format === 'undefined') {

        /**
         * 숫자를 지정한 포맷형식에 따라 문자열로 변환합니다.
         * @param {number} [a=0] 소수부의 길이
         * @param {number} [b=3] 정수부에서 구분자를 표시할 길이
         * @param {string} [c=,] 정수부의 구분문자
         * @param {string} [d=.] 소수부 구분문자
         * @param {string} [e=r] 올림/반올림/버림처리(c: 올림, r: 반올림, f: 버림)
         */
        window.Number.prototype.format = function (a, b, c, d, e) {
            var regex,
                num,
                integerSplitLength = 3, // 정수부에서 구분자를 표시할 길이
                decimalPartLength = 0, // 소수부의 길이
                integerSplitter = ',', // 정수부의 구분문자
                decimalSplitter = '.', // 소수부 구분문자
                est = 'r', // 올림/반올림/버림처리
                fixed,
                result;

            decimalPartLength = (typeof a === 'number') ? a : decimalPartLength;
            integerSplitLength = (typeof b === 'number') ? b : integerSplitLength;
            integerSplitter = (typeof c === 'string' && c) ? c : integerSplitter;
            decimalSplitter = (typeof d === 'string' && d) ? d : decimalSplitter;
            est = (typeof e === 'string' && e) ? e : est;

            regex = '\\d(?=(\\d{' + integerSplitLength + '})+' + (decimalPartLength > 0 ? '\\D' : '$') + ')';
            num = this;

            if (decimalPartLength >= 0) {
                fixed = Math.pow(10, decimalPartLength);

                switch (est) {
                    case 'f': // 버림
                        num = ~~(num * fixed) / fixed; // = Math.floor(num * fixed) / fixed; // NOT 비트연산자를 두번 사용하면 버림 효과 - 속도는 Math.floor보다 빠르다.
                        break;
                    case 'c': // 올림
                        num = Math.ceil(num * fixed) / fixed;
                        break;
                }
            }

            num = num.toFixed(Math.max(0, ~~decimalPartLength));

            result = (decimalSplitter ? num.replace('.', decimalSplitter) : num).replace(new RegExp(regex, 'g'), '$&' + integerSplitter);

            return result;
        };
    }

})(window || {});

/*
 *  자바스크립트 기본 형식 중 Array 객체에 대한 확장 함수를 등록
 */
(function (window) {

    if (typeof window.Array.prototype.insert === 'undefined') {

        /**
         * 배열의 지정된 인덱스에 요소를 삽입합니다.
         * @param {number} index 요소를 삽입할 인덱스
         * @param {...*} args 삽입할 요소들
         */
        /* jshint -W098 */
        /* jshint -W004 */
        window.Array.prototype.insert = function (index, args) {
            var args = Array.prototype.slice.call(arguments, 1), // 첫번째 인수인 인덱스를 제외하고 args에 담는다.
                argArray = [index, 0];

            if (args) {
                // Array객체의 splice 메서드는 배열에서 요소를 제거하고, 필요하면 그 자리에 새 요소를 삽입한 다음
                // 삭제된 요스를 반환하는 역할을 하므로 insert 기능을 수행할 수 있음
                // signature: arrayObj.splice(start, deleteCount, [item1 ~ itemN]);

                argArray = argArray.concat(args);
                Array.prototype.splice.apply(this, argArray);
            }

            return this;
        };
        /* jshint +W098 */
        /* jshint +W004 */
    }

})(window || {});

/*
 * dews 전역 객체 정의
 */
(function (window) {

    /** @global */
    var dews = {
        /**
         * dews 환경 설정 값
         * @static
         */
        _environments: { }
    };

    window.dews = dews;

})(window || {});

/*
 * dews 공용 함수
 */
(function (window, $, dews) {

    // dews 객체를 확장
    $.extend(true, dews, {
        /**
         * 문자열관련 처리를 담당합니다.
         */
        string: {
            /**
             * 포맷문자열에 실제 값을 대입하여 완성된 문자열을 만듭니다.
             * @param {string} format 포맷문자열
             * @param {...string} args 포맷문자열에 적용할 실제 값
             * @returns {string} 완성된 문자열
             */
            format: function (format, args) {
                if (typeof format === 'string') {
                    return String.format.apply(null, arguments);
                } else {
                    return ''; // 포맷문자열(format) 파라미터에 문자열이 아닌 것이 들어오면 빈 문자열을 반환
                }
            },
            /**
             * 문자열에 마스크를 적용합니다.
             * @param {string} str 마스크를 적용할 대상 문자열
             * @param {string} mask 마스크 문자열
             * @returns {string} 마스크가 적용된 문자열
             */
            mask: function (str, mask) {
                var result = '',
                    idx = 0,
                    maskChar,
                    rules = {
                        "0": /\d/,
                        "9": /\d|\s/,
                        "#": /\d|\s|\+|\-/,
                        "L": /[a-zA-Z]/,
                        "?": /[a-zA-Z]|\s/,
                        "&": /\S/,
                        "C": /./,
                        "A": /[a-zA-Z0-9]/,
                        "a": /[a-zA-Z0-9]|\s/,
                        "*": /[a-zA-Z0-9*]|\s/
                    };

                if ((typeof str === 'string' || typeof str === 'number') && typeof mask === 'string') {
                    if (typeof str === 'number') {
                        str = str.toString();
                    }

                    for (var i = 0; i < mask.length; i++) {
                        // 마스크 문자열의 길이 만큼 루프
                        maskChar = mask[i];

                        if (rules.hasOwnProperty(maskChar)) {
                            if (rules[maskChar].test(str[idx])) {
                                // 마스크에 부함하면 결과에 추가
                                if (maskChar === '*') {
                                    result += maskChar;
                                } else {
                                    result += str[idx];
                                }
                                idx++;
                            } else {
                                // 마스크에 부합하지 않으면 루프를 빠져나감
                                result = '';
                                break;
                            }
                        } else {
                            result += maskChar;
                        }
                    }

                    // 문자열 길이와 처리된 문자의 갯수가 같는지 확인
                    if (idx !== str.length) {
                        result = '';
                    }
                }

                return result;
            }
        },
        /**
         * 숫자관련 처리를 담당합니다.
         */
        number: {
            /**
             * 숫자 데이터와 변환할 포맷 형식(#,##0.00 형식)이나 포맷 알리아스를 입력받아서 문자열로 변환합니다.
             * @param number 문자열로 변환할 숫자 데이터입니다.
             * @param format 숫자를 변환할 포맷 문자열입니다.
             * @returns {string} 숫자를 변환한 문자열입니다.
             */
            format: function (number, format) {
                var standardFormatRegExp =  /^(c|p|e)(\d*)$/i,
                    groupSize = 3,
                    groupSeparator = ',',
                    decimal = '.',
                    precision = 2,
                    pattern = '-n',
                    literals = [],
                    symbol,
                    isCurrency,
                    isPercent,
                    customPrecision,
                    formatAndPrecision,
                    negative = number < 0,
                    integer,
                    fraction,
                    integerLength,
                    fractionLength,
                    replacement = '',
                    value = '',
                    idx,
                    length,
                    ch,
                    hasGroup,
                    hasNegativeFormat,
                    decimalIndex,
                    sharpIndex,
                    zeroIndex,
                    hasZero,
                    hasSharp,
                    percentIndex,
                    currencyIndex,
                    startZeroIndex,
                    start = -1,
                    end;

                var round = function(value, precision) {
                    precision = precision || 0;

                    value = value.toString().split('e');
                    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + precision) : precision)));

                    value = value.toString().split('e');
                    value = +(value[0] + 'e' + (value[1] ? (+value[1] - precision) : -precision));

                    return value.toFixed(precision);
                };

                if (typeof number === 'undefined') {
                    return '';
                }

                if (!isFinite(number)) {
                    return number;
                }

                // 포맷이 지정되지 않았을 경우에는 기본으로 #,##0
                if (!format) {
                    format = '#,##0';
                }

                formatAndPrecision = standardFormatRegExp.exec(format);

                // 기본 포맷 관련 처리 (c, p, e)
                if (formatAndPrecision) {
                    format = formatAndPrecision[1].toLowerCase();

                    isCurrency = format === 'c';
                    isPercent = format === 'p';

                    if (isCurrency) {
                        groupSize = 3;
                        groupSeparator = ',';
                        decimal = '.';
                        precision = 0;
                        symbol = '';
                        pattern = (negative) ? '-$n' : '$n';
                    } else if (isPercent) {
                        groupSize = 3;
                        groupSeparator = ',';
                        decimal = '.';
                        precision = 2;
                        symbol = '%';
                        pattern = (negative) ? '-n %' : 'n %';
                    }

                    customPrecision = formatAndPrecision[2];

                    if (customPrecision) {
                        precision = +customPrecision;
                    }

                    // 지수 포맷 반환
                    if (format === 'e') {
                        return customPrecision ? number.toExponential(precision) : number.toExponential();
                    }

                    // 퍼센트라면 100을 곱한다.
                    if (isPercent) {
                        number *= 100;
                    }


                    number = round(number, precision);
                    negative = number < 0;
                    number = number.split('.');

                    integer = number[0];
                    fraction = number[1];

                    // 음수라면 마이너스를 제외
                    if (negative) {
                        integer = integer.substring(1);
                    }

                    value = integer;
                    integerLength = integer.length;

                    if (fraction) {
                        value += decimal + fraction;
                    }

                    if (format === 'n' && !negative) {
                        return value;
                    }

                    number = '';

                    for (idx = 0, length = pattern.length; idx < length; idx++) {
                        ch = pattern.charAt(idx);

                        if (ch === 'n') {
                            number += value;
                        } else if (ch === '$' || ch === '%') {
                            number += symbol;
                        } else {
                            number += ch;
                        }
                    }

                    return number;
                }

                formatAndPrecision = /^N(0)?(\d+)?$/ig.exec(format);

                // n 또는 N 포맷 관련 처리
                if (formatAndPrecision) {
                    if (formatAndPrecision[0].startsWith('n')) {
                        format = '#,###';
                    } else {
                        format = '#,##0';
                    }

                    if (formatAndPrecision[1] === '0' && formatAndPrecision[2]) {
                        format += decimal;
                        for (idx = 0, length = parseInt(formatAndPrecision[2] || '0', 10); idx < length; idx++) {
                            format += '0';
                        }
                    } else if (formatAndPrecision[2]) {
                        format += decimal;
                        for (idx = 0, length = parseInt(formatAndPrecision[2] || '0', 10); idx < length; idx++) {
                            format += '#';
                        }
                    }
                }

                if (negative) {
                    number = -number;
                }

                // 사용자 정의 포맷 관련 처리 (#,##0.##)
                if (format.indexOf('\'') > -1 || format.indexOf('"') > -1 || format.indexOf('\\') > -1) {
                    format = format.replace(/(\\.)|(['][^']*[']?)|(["][^"]*["]?)/g, function (match) {
                        var quoteChar = match.charAt(0).replace('\\', ''),
                            literal = match.slice(1).replace(quoteChar, '');

                        literals.push(literal);

                        return '??';
                    });
                }

                format = format.split(';');
                if (negative && format[1]) {
                    // 음수 포맷을 가져온다.
                    format = format[1];
                    hasNegativeFormat = true;
                } else if (number === 0) {
                    // 0을 위한 포맷을 가져온다.
                    format = format[2] || format[0];
                    if (format.indexOf('#') === -1 && format.indexOf('0') === -1) {
                        // 포맷이 일반 문자열 상수라면 포맷을 그대로 반환
                        return format;
                    }
                } else {
                    format = format[0];
                }

                percentIndex = format.indexOf('%');
                currencyIndex = format.indexOf('$');

                isPercent = percentIndex != -1;
                isCurrency = currencyIndex != -1;

                if (isPercent) {
                    number *= 100;
                }

                if (isCurrency && format[currencyIndex - 1] === '\\') {
                    format = format.split('\\').join('');
                    isCurrency = false;
                }

                if (isCurrency) {
                    groupSize = 3;
                    groupSeparator = ',';
                    decimal = '.';
                    precision = 0;
                    symbol = '';
                } else if (isPercent) {
                    groupSize = 3;
                    groupSeparator = ',';
                    decimal = '.';
                    precision = 2;
                    symbol = '%';
                }

                hasGroup = format.indexOf(',') > -1;
                if (hasGroup) {
                    format = format.replace(/\,/g, '');
                }

                decimalIndex = format.indexOf('.');
                length = format.length;

                if (decimalIndex != -1) {
                    fraction = number.toString().split('e');
                    if (fraction[1]) {
                        fraction = round(number, Math.abs(fraction[1]));
                    } else {
                        fraction = fraction[0];
                    }
                    fraction = fraction.split('.')[1] || '';
                    zeroIndex = format.lastIndexOf('0') - decimalIndex;
                    sharpIndex = format.lastIndexOf('#') - decimalIndex;
                    hasZero = zeroIndex > -1;
                    hasSharp = sharpIndex > -1;
                    idx = fraction.length;

                    if (!hasZero && !hasSharp) {
                        format = format.substring(0, decimalIndex) + format.substring(decimalIndex + 1);
                        length = format.length;
                        decimalIndex = -1;
                        idx = 0;
                    } else if (hasZero && zeroIndex > sharpIndex) {
                        idx = zeroIndex;
                    } else if (sharpIndex > zeroIndex) {
                        if (hasSharp && idx > sharpIndex) {
                            idx = sharpIndex;
                        } else if (hasZero && idx < zeroIndex) {
                            idx = zeroIndex;
                        }
                    }

                    if (idx > -1) {
                        number = round(number, idx);
                    }
                } else {
                    number = round(number);
                }

                sharpIndex = format.indexOf('#');
                startZeroIndex = zeroIndex = format.indexOf('0');

                // 첫번째 숫자 치환자의 인덱스를 선언
                if (sharpIndex == -1 && zeroIndex != -1) {
                    start = zeroIndex;
                } else if (sharpIndex != -1 && zeroIndex == -1) {
                    start = sharpIndex;
                } else {
                    start = sharpIndex > zeroIndex ? zeroIndex : sharpIndex;
                }

                sharpIndex = format.lastIndexOf('#');
                zeroIndex = format.lastIndexOf('0');

                // 마지막 숫자 치환자의 인덱스를 선언
                if (sharpIndex === -1 && zeroIndex !== -1) {
                    end = zeroIndex;
                } else if (sharpIndex !== -1 && zeroIndex === -1) {
                    end = sharpIndex;
                } else {
                    end = sharpIndex > zeroIndex ? sharpIndex : zeroIndex;
                }

                if (start === length) {
                    end = start;
                }

                if (start != -1) {
                    value = number.toString().split('.');
                    integer = value[0];
                    fraction = value[1] || '';

                    integerLength = integer.length;
                    fractionLength = fraction.length;

                    if (negative && (number * -1) >= 0) {
                        negative = false;
                    }

                    // 값에 필요한 만큼 그룹 분할자를 추가한다.
                    if (hasGroup) {
                        if (integerLength === groupSize && integerLength < decimalIndex - startZeroIndex) {
                            integer = groupSeparator + integer;
                        } else if (integerLength > groupSize) {
                            value = '';
                            for (idx = 0; idx < integerLength; idx++) {
                                if (idx > 0 && (integerLength - idx) % groupSize === 0) {
                                    value += groupSeparator;
                                }
                                value += integer.charAt(idx);
                            }
                            integer = value;
                        }
                    }

                    number = format.substring(0, start);

                    if (negative && !hasNegativeFormat) {
                        number += '-';
                    }

                    for (idx = start; idx < length; idx++) {
                        ch = format.charAt(idx);

                        if (decimalIndex === -1) {
                            if (end - idx < integerLength) {
                                number += integer;
                                break;
                            }
                        } else {
                            if (zeroIndex !== -1 && zeroIndex < idx) {
                                replacement = '';
                            }

                            if ((decimalIndex - idx) <= integerLength && decimalIndex - idx > -1) {
                                number += integer;
                                idx = decimalIndex;
                            }

                            if (decimalIndex === idx) {
                                number += (fraction ? decimal : '') + fraction;
                                idx += end - decimalIndex + 1;
                                continue;
                            }
                        }

                        if (ch === '0') {
                            number += ch;
                            replacement = ch;
                        } else if (ch === '#') {
                            number += replacement;
                        }
                    }

                    if (end >= start) {
                        number += format.substring(end + 1);
                    }

                    // 심볼부분을 교체
                    if (isCurrency || isPercent) {
                        value = '';
                        for (idx = 0, length = number.length; idx < length; idx++) {
                            ch = number.charAt(idx);
                            value += (ch === '$' || ch === '%') ? symbol : ch;
                        }
                        number = value;
                    }

                    length = literals.length;

                    if (length) {
                        for (idx = 0; idx < length; idx++) {
                            number = number.replace('??', literals[idx]);
                        }
                    }
                }

                return number;
            }
        }
    });
})(window || {}, jQuery, dews);

/*
 * 날짜, 숫자 포맷 문자열 관련 설정
 */
(function (window, $, dews) {
    var _formats,
        _formatUtils;

    // 날짜관련 포맷 문자열 기본값
    _formats = {
        dateFormat: "yyyy-MM-dd",                   // 기본 날짜 포맷
        dateValueFormat: "yyyyMMdd",                // 기본 날짜 값의 포맷
        dateTimeFormat: "yyyy-MM-dd HH:mm:ss",      // 기본 날짜 시간 포맷
        dateTimeValueFormat: "yyyyMMddHHmmss",      // 기본 날짜 시간 값의 포맷
        timeFormat: "HH:mm",                        // 기본 시간 포맷
        timeValueFormat: "HHmm",                    // 기본 시간 값의 포맷
        monthFormat: "yyyy-MM",                     // 기본 월 포맷
        monthValueFormat: "yyyyMM",                 // 기본 월 값의 포맷
        weekFormat: "yyyy-WW",                      // 기본 주 포맷
        weekValueFormat: "yyyyWW",                  // 기본 주 값의 포맷
        yearFormat: "yyyy",                         // 기본 연도 포맷
        yearValueFormat: "yyyy"                     // 기본 연도 값의 포맷
    };
    /*
     * 포맷 에일리어스(alias)
     *
     * # 날짜형 #
     * D : 날짜 (예: yyyy-MM-dd)
     * DT : 날짜&시간 (예: yyyy-MM-dd HH:mm:ss)
     * M : 월 (예: yyyy-MM)
     * Y : 년 (예: yyyy)
     * T : 시간 (예:HH:mm)
     *
     * # 숫자형 #
     * N : #,##0
     * n : #,###
     * N2 : #,##0.##
     * n2 : #,###.##
     * N02: #,##0.00
     * n02 : #,###.00
     */

    // 포맷 관련 함수
    _formatUtils = {
        /**
         * 포맷 에일리어스(alias)로 숫자포맷 가져오기
         */
        getNumberFormat: function (alias) {
            var formatBase = "#,##0",
                format,
                regex = /^N(0)?(\d+)?$/ig,
                matches,
                decimalPartLength,
                decimalPartChar,
                decimalPartFormat = "",
                idx;

            if (alias.startsWith("n")) {
                formatBase = "#,###";
            }

            matches = regex.exec(alias);

            if ($.isArray(matches)) {
                if (matches[1] === "0") {
                    decimalPartChar = "0";
                } else {
                    decimalPartChar = "#";
                }

                if (matches[2]) {
                    decimalPartLength = parseInt(matches[2], 10);

                    if (decimalPartLength > 0) {
                        decimalPartFormat = ".";

                        for (idx = 0; idx < decimalPartLength; idx++) {
                            decimalPartFormat += decimalPartChar;
                        }
                    }
                }
            }

            format = formatBase + decimalPartFormat;

            return format;
        },
        /**
         * 포맷 에일리어스(alias)로 날짜시간 포맷 가져오기
         * @param {string} alias 포맷 문자열의 에일리어스(alias)
         * @param {boolean} [forValue = false] 값 포맷 인지 여부
         */
        getDateFormat: function (alias, forValue) {
            var format = alias;

            forValue = forValue || false;

            if (alias) {
                switch (alias) {
                    case "Y":   // 년
                        if (forValue) {
                            format = dews._environments.formats.yearValueFormat;
                        } else {
                            format = dews._environments.formats.yearFormat;
                        }
                        break;
                    case "M":   // 년월
                        if (forValue) {
                            format = dews._environments.formats.monthValueFormat;
                        } else {
                            format = dews._environments.formats.monthFormat;
                        }
                        break;
                    case "DT":  // 년월일시분초
                        if (forValue) {
                            format = dews._environments.formats.dateTimeValueFormat;
                        } else {
                            format = dews._environments.formats.dateTimeFormat;
                        }
                        break;
                    case "D":   // 년원일
                        if (forValue) {
                            format = dews._environments.formats.dateValueFormat;
                        } else {
                            format = dews._environments.formats.dateFormat;
                        }
                        break;
                    case "T":   // 시분
                        if (forValue) {
                            format = dews._environments.formats.timeValueFormat;
                        } else {
                            format = dews._environments.formats.timeFormat;
                        }
                        break;
                }
            }

            return format;
        }
    };

    // dews 확장
    $.extend(true, dews, {
        /**
         * @namespace
         */
        _environments: {
            /**
             * 날짜 형식 포맷 문자열 목록
             */
            formats: _formats,
            /**
             * dews.log 사용 여부
             */
            useLog: false
        },
        /**
         * 포맷 에일리어스(alias) 문자열을 실제 포맷 문자열로 변경합니다.
         * @param {string} alias 포맷 에일리어스(alias)
         * @param {boolean} [forValue = false] 포맷 문자열이 값 형식인지 여부
         * @returns {string} 실제 포맷 문자열
         */
        getFormatFromAlias: function (alias, forValue) {
            var format = alias;

            if (alias && /^N/i.test(alias)) {
                // 숫자형 일 경우
                format = _formatUtils.getNumberFormat(alias);
            } else {
                format = _formatUtils.getDateFormat(alias, forValue);
            }

            return format;
        },
        /**
         * 현재 디버그 모드에 있는지 확인합니다.
         * @private
         */
        _isDebugMode: function () {
            // URL에 debug=true(대소문자 구분 안함)이 있으면 디버그 모드
            return dews._environments.useLog;
        },
        /**
         * 디버그 모드 여부에 따라서 콘솔에 로그를 남깁니다.
         * @param {string|object} msg 로그 내용
         */
        log: function (msg) {
            if (typeof msg === 'undefined') {
                return;
            }

            if (dews._isDebugMode()) {
                // msg가 문자열 일 때
                if ($.type(msg) === 'string') {
                    console.log(msg);
                } else {
                    try {
                        console.log(JSON.stringify(msg));
                    } catch (e) { console.log(e); }
                }
            }
        },
        /**
         * dews.log 함수의 사용 여부를 설정합니다.
         * @param {boolean} use
         */
        useLog: function (use) {
            dews._environments.useLog = use;
        }
    });
})(window || {}, jQuery, dews);
/*
 *  URL 관련 함수 설정
 */
(function (window, $, dews) {
    $.extend(true, dews, {
        /**
         * 어플리케이션의 루트경로를 설정합니다.
         * @param {string} url 루트경로 URL
         */
        setRootPath: function (url) {
            dews._environments.rootPath = url;
        },
        /**
         * 자바스크립트파일이 있는 기본 경로를 설정합니다.
         * @param {string} url 자바스크립트 파일들이 있는 베이스 URL
         */
        setScriptBaseDir: function (url) {
            dews._environments.scriptBase = dews.url.getAbsoluteUrl(url);
        },
        url: {
            /**
             * 어플리케이션에서의 절대 경로를 가져옵니다.
             * @param {string} url 어플리케이션 루트로 부터의 상대경로 (~/url)
             */
            getAbsoluteUrl: function (url) {
                var rootPath = '/',
                    regexp = /^~\//;

                if (!dews.hasOwnProperty('_environments')) {
                    dews._environments = {};
                }

                if (!dews._environments.hasOwnProperty('rootPath')) {
                    dews._environments.rootPath = rootPath;
                }

                rootPath = dews._environments.rootPath;

                if (!rootPath.endsWith('/')) {
                    rootPath += '/';
                }

                if (url && $.type(url) === 'string') {
                    if (regexp.test(url)) {
                        url = url.replace(regexp, rootPath);
                    }
                }

                return url;
            },
            /**
             * 어플리케이션 루트경로로 부터의 경로를 가져옵니다.
             * @param {string} url URL 경로
             */
            getNormalizedUrl: function (url) {
                var absolute,
                    rootPath = dews._environments.rootPath || '/';

                if (url) {
                    absolute = this.getAbsoluteUrl(url);

                    if (absolute.startsWith(rootPath)) {
                        url = absolute.substring(rootPath.length, absolute.length);

                        if (!url.startsWith('/')) {
                            url = '/' + url;
                        }
                    }
                }

                return url;
            },
            /**
             * 두 개 이상의 경로를 합칩니다.
             * @param {string} 기본 경로
             * @param {...string} 추가 경로
             * @returns {string} 경로를 합친 결과
             */
            /* jshint -W004 */
            join: function (baseUrl, args) {
                var startPattern = /^((?:https?:)?\/\/)/i,
                    protocol = '',
                    oriUrl = [],
                    parts = [],
                    part,
                    newParts = [];

                oriUrl = Array.prototype.splice.call(arguments, 0);

                for (var i = 0; i < oriUrl.length; i++) {
                    if (i === 0) {
                        // baseUrl이 프로토콜 문자열로 시작될 때의 처리 (http://, https://, //)
                        protocol = startPattern.exec(oriUrl[i]);
                        if (protocol) {
                            protocol = protocol[0];
                            oriUrl[i] = oriUrl[i].substring(protocol.length);
                        }
                    }

                    parts = parts.concat(oriUrl[i].split('/'));
                }

                for (var i = 0; i < parts.length; i++) {
                    part = parts[i];

                    if (!part || part === '.') continue;

                    if (part === '..') {
                        newParts.pop();
                    } else {
                        newParts.push(part);
                    }
                }

                if (parts[0] === '') {
                    newParts.unshift("");
                }

                return ((protocol || "") + newParts.join("/")) || (newParts.length ? '/' : '.');
            },
            /* jshint +W004 */

            /**
             * QueryString 문자열을 추가합니다
             * @param {string} baseUrl 기준이 되는 URL경로입니다.
             * @param {object} data 추가할 QueryString 객체입니다.
             */
            appendParameters: function (baseUrl, data) {
                if (baseUrl) {
                    if (baseUrl.indexOf('?', 0) > 0) {
                        baseUrl = baseUrl + "&" + $.param(data);
                    } else {
                        baseUrl = baseUrl + "?" + $.param(data);
                    }
                }

                return baseUrl;
            }
        }
    });

    // 하위 호환성을 위해서 추가
    dews.urlHelper = dews.url;
})(window || {}, jQuery, dews);

/**
 * 서버 환경 변수 관련 기능 추가
 */
(function (window, $, dews) {
    $.extend(true, dews, {
        /**
         * 서버 환경 변수관련 네임스페이스
         * @namespace
         */
        server: {
            /**
             * 서버 환경 변수 서비스 기본 URL
             */
            _defaultServerVariableServiceURL: '~/Data/serverVariable/getEnvironment',
            /**
             * 서버 환경 변수를 사용하는지 여부를 설정합니다.
             * @param {boolean} value 서버 환경 변수의 사용 여부
             */
            useServerVariables: function (value) {
                if (value === false) {
                    if (dews._environments.hasOwnProperty('serverVariables')) {
                        delete dews._environments.serverVariables;
                    }
                }
                dews._environments.useServerVariables = value;
            },
            /**
             * 서버 환경 변수를 제공하는 서비스의 URL을 설정합니다.
             * @param {string} url 서버 환경 변수 제공 서비스 URL
             */
            setServerVariableServiceURL: function (url) {
                dews._environments.serverVariableServiceURL = url;
            },
            /**
             * 서버 환경 변수를 설정합니다.
             * @param {object} data 설정할 서버 환경 변수 객체 (unll이나 undefined 등을 설정하면 서버 환경 변수를 제거합니다.)
             */
            setServerVariables: function (data) {
                var previousData;

                if (dews._environments.useServerVariables) {
                    if (data) {
                        if (dews._environments.hasOwnProperty('serverVariables')) {
                            previousData = dews._environments.serverVariables;
                        }

                        data = $.extend(true, {}, previousData, data);
                        dews._environments.serverVariables = data;
                    } else {
                        delete dews._environments.serverVariables;
                    }
                }
            },
            /**
             * 지정한 키의 서버 환경 변수를 가져옵니다.
             * @param {string} key 서버 환경 변수의 이름
             */
            getVariable: function (key) {
                var result;

                if (dews._environments.useServerVariables) {
                    if (dews._environments.hasOwnProperty('serverVariables')) {
                        if (dews._environments.serverVariables.hasOwnProperty(key)) {
                            result = dews._environments.serverVariables[key];
                        }
                    }
                }

                return result;
            }
        }
    });
})(window || {}, jQuery, dews);

/**
 * jQuery 확장
 */
(function ($) {

    $.extend(true, $, {
        /**
         * QueryString을 객체로 전환합니다.
         * @param {string} params QueryString 문자열
         * @param coerce
         */
        deparam: function (params, coerce) {
            var obj = {},
                coerce_types = { 'true': !0, 'false': !1, 'null': null };

            // Iterate over all name=value pairs.
            $.each(params.replace(/\+/g, ' ').split('&'), function (j, v) {
                var param = v.split('='),
                    key = decodeURIComponent(param[0]),
                    val,
                    cur = obj,
                    i = 0,

                // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
                // into its component parts.
                    keys = key.split(']['),
                    keys_last = keys.length - 1;

                // If the first keys part contains [ and the last ends with ], then []
                // are correctly balanced.
                if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
                    // Remove the trailing ] from the last keys part.
                    keys[keys_last] = keys[keys_last].replace(/\]$/, '');

                    // Split first keys part into two parts on the [ and add them back onto
                    // the beginning of the keys array.
                    keys = keys.shift().split('[').concat(keys);

                    keys_last = keys.length - 1;
                } else {
                    // Basic 'foo' style key.
                    keys_last = 0;
                }

                // Are we dealing with a name=value pair, or just a name?
                if (param.length === 2) {
                    val = decodeURIComponent(param[1]);

                    // Coerce values.
                    if (coerce) {
                        val = val && !isNaN(val) ? +val              // number
                            : val === 'undefined' ? undefined         // undefined
                            : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
                            : val;                                                // string
                    }

                    if (keys_last) {
                        // Complex key, build deep object structure based on a few rules:
                        // * The 'cur' pointer starts at the object top-level.
                        // * [] = array push (n is set to array length), [n] = array if n is
                        //   numeric, otherwise object.
                        // * If at the last keys part, set the value.
                        // * For each keys part, if the current level is undefined create an
                        //   object or array based on the type of the next keys part.
                        // * Move the 'cur' pointer to the next level.
                        // * Rinse & repeat.
                        for (; i <= keys_last; i++) {
                            key = keys[i] === '' ? cur.length : keys[i];
                            cur = cur[key] = i < keys_last ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val;
                        }

                    } else {
                        // Simple key, even simpler rules, since only scalars and shallow
                        // arrays are allowed.

                        if ($.isArray(obj[key])) {
                            // val is already an array, so push on the next value.
                            obj[key].push(val);

                        } else if (obj[key] !== undefined) {
                            // val isn't an array, but since a second value has been specified,
                            // convert val into an array.
                            obj[key] = [obj[key], val];

                        } else {
                            // val is a scalar.
                            obj[key] = val;
                        }
                    }

                } else if (key) {
                    // No value was defined, so set something meaningful.
                    obj[key] = coerce ? undefined : '';
                }
            });

            return obj;
        }
    });

    $.extend(true, $.fn, {
        /**
         * 지정한 폼을 객체로 시리얼라이즈 합니다.
         */
        serializeObject: function () {
            var o = {},
                a = this.serializeArray();

            $.each(a, function () {

                if (typeof o[this.name] === "undefined") {
                    o[this.name] = this.value || "";
                } else {
                    if (!$.isArray(o[this.name])) {
                        o[this.name] = [ o[this.name] ];
                    }

                    o[this.name].push(this.value || "");
                }
            });

            return o;
        },
        /**
         * 현재 요소가 지정한 셀렉터와 동일한지 또는 지정한 셀렉터에 포함되는지를 확인합니다.
         * @param {string} selector 셀렉터
         */
        isOf: function (selector) {
            if ($(this).is(selector) || $(this).parents(selector).size() > 0) {
                return true;
            }
            return false;
        }
    });
})(jQuery);


/*
 * AJAX 통신
 */
(function ($, dews) {

    var defaultSettings = {},
        ajaxUtil = {};

    defaultSettings = {};

    var loadedCommonScripts = []; // 스크립트 중복 로드 방지를 위한 배열

    $.ajaxSetup({
        /**
         * AJAX 요청을 보내기 전에 설정을 추가
         */
        beforeSend: function (jqXHR, settings) {
            var result = true,
                csrfToken = null,
                authToken = ajaxUtil.getAuthToken(),
                page = dews.ui.page;

            if (dews._environments.useCSRFtoken === true) {
                // CSRF 관련 토큰을 추가
                csrfToken = ajaxUtil.getCSRFToken();

                if (token) {
                    jqXHR.setRequestHeader(dews._environments.CSRFTokenHeaderName, csrfToken);
                }
            }

            if (authToken.hasOwnProperty('access_token')) {
                if (authToken.access_token) {
                    jqXHR.setRequestHeader('X-Authenticate-Token', authToken.access_token || '');
                }
            }

            if (page) {
                // 페이지 아이디를 헤더에 전송
                if (page.hasOwnProperty('menu') && page.menu && page.menu.id) {
                    jqXHR.setRequestHeader('X-Requested-PageID', page.menu.id);
                }
                // 페이지 권한을 헤더에 전송
                if (!!page.authority && page.authority.grant) {
                    jqXHR.setRequestHeader('X-Grant-Authority', page.authority.grant);
                }
            }

            if ($.isFunction(settings._userBeforeSend)) {
                result = settings._userBeforeSend(jqXHR, settings);

                delete settings._userBeforeSend;
            }

            return result;
        }
    });


    ajaxUtil = {
        /**
         * 서버에서 Hidden 필드로 전송된 CSRF 토큰을 헤더에 추가할 수 있는 객체로 반환합니다.
         */
        getCSRFToken: function () {
            return $("input[name=" + dews._environments.CSRFTokenFieldName + "]").val();
        },
        getAuthToken: function () {
            return JSON.parse(sessionStorage.getItem("gerp:auth:token") || '{}');
        },
        /**
         * 모든 AJAX 요청을 실행하는 퍼사드 메서드입니다.
         * @param {string} type 요청 형식(post, get, data)
         * @param {string} url 요청 URL
         * @param {object} settings 요청 옵션
         */
        sendAjax: function (type, url, settings) {
            type = type || 'get';
            settings = settings || {};

            if (url) {
                settings.url = url;
            } else {
                if (typeof settings.url === 'undefined' || !settings.url) {
                    throw '요청할 주소가 설정되지 않았습니다.';
                }
            }

            settings.url = dews.url.getAbsoluteUrl(settings.url);

            switch (type.toLowerCase()) {
                case 'post':
                    settings.method = 'POST';
                    break;
                case 'get':
                    settings.method = 'GET';
                    break;
                case 'put':
                    settings.method = 'PUT';
                    break;
                case 'del':
                    settings.method = 'DELETE';
                    break;
                case 'data':
                    settings.method = settings.method || "POST";
                    if (/GET/i.test(settings.method)) {
                        settings.cache = false;
                    }
                    settings.dataType = settings.dataType || 'json';
                    break;
                case 'api':
                    if (/GET/i.test(settings.method)) {
                        settings.cache = false;
                    }
                    settings.dataType = settings.dataType || 'json';
                    break;
            }


            if (typeof settings.beforeSend !== 'undefined') {
                settings._userBeforeSend = settings.beforeSend;
                delete settings.beforeSend;
            }

            settings = $.extend({}, defaultSettings, settings);

            return $.Deferred(function (defer) {
                $.ajax(settings).done(function (data, textStatus, jqXHR) {
                    if ($.isPlainObject(data)) {
                        if (type.toLowerCase() === 'data' || type.toLowerCase() === 'api') {
                            // 서버에서 JSON을 가져왔을 때의 처리
                            // jqXHR.responseJSON으로도 결과가 JSON 인지 체크 가능함
                            if (data.hasOwnProperty("state")) {
                                if (data.state === 'error') {
                                    defer.rejectWith(this, [jqXHR, 'error', data.message || 'Internal Error', data]);
                                    return;
                                } else if (data.hasOwnProperty('data')) {
                                    defer.resolveWith(this, [data.data, textStatus, jqXHR]);
                                    return;
                                }
                            }
                        }
                    }
                    // 위 예외 처리 부분에 해당하지 않으면 기본 $.ajax의 done 매개변수를 그대로 반환
                    defer.resolveWith(this, Array.prototype.splice.call(arguments, 0));
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    dews.log('## dews.ajax - Fail: ' + JSON.stringify(jqXHR));
                    if (/json/i.test(settings.dataType)) {
                        var evt = new $.Event(jqXHR.statusText.toLowerCase());
                        evt.code = jqXHR.status;
                        evt.response = jqXHR.responseJSON || jqXHR.responseText;
                        evt.jqXHR = jqXHR;
                        $(dews.ajax).trigger(evt);
                    }
                    defer.rejectWith(this, Array.prototype.splice.call(arguments, 0));
                });
            }).promise();
        }
    };

    // Ajax 통신을 위한 dews 객체의 _environments 네임 스페이스 확장
    $.extend(true, dews, {
        /**
         * 환경설정
         * @namespace
         */
        _environments: {
            /**
             * 데이터를 요청하는 URL 경로의 포맷
             */
            dataUrlFormat: "~/Data/{0}/{1}",
            /**
             * 코드(도움창) 데이터 요청을 위한 URL 경로의 포맷
             */
            codeDataUrlFormat: "~/api/CM/codehelp/CodeHelpDataService/{0}",
            /**
             * 코드도움(도움창) 뷰 화면의 경로 포맷
             */
            codeViewUrlFormat: "~/CODEHELP.html",
            /**
             * 사이트 간 요청 위조(Cross Site Request Forgery) 공격을 방지하기 위한 토큰을 모든 AJAX 요청에 추가할 지 여부
             */
            useCSRFtoken: false,
            /**
             * CSRF 공격 방지용 토큰이 저장되어 있는 히든 필드의 이름
             */
            CSRFTokenFieldName: "__RequestVerificationToken",
            /**
             * CSRF 공격 방지용 토큰이 전송되는 HTTP 헤더의 이름
             */
            CSRFTokenHeaderName: "RequestVerificationToken"
        }
    });

    // Ajax 통신을 위한 dews 객체의 url 네임스페이스 확장
    $.extend(true, dews, {
        /** @namespace */
        url: {
            /**
             * AJAX 데이터 요청을 위한 URL 경로를 가져옵니다.
             * @param {string} serviceName 데이터를 제공하는 서비스의 이름
             * @param {string} actionName 데이터를 제공하는 액션의 이름
             * @returns 데이터 요청을 위한 URL 경로
             */
            getDataUrl: function (serviceName, actionName) {
                var url;

                if (!serviceName || !actionName || $.type(serviceName) !== 'string' || $.type(actionName) !== 'string') {
                    throw '잘못된 값이 입력되었습니다.';
                }

                url = dews.string.format(dews._environments.dataUrlFormat, serviceName, actionName);
                url = dews.url.getAbsoluteUrl(url);

                return url;
            },
            /**
             * AJAX로 코드도움(도움창) 데이터를 요청하기 위한 URL 경로를 가져옵니다.
             * @param {string} code 코드도움(도움창) 코드
             * @returns 코드도움(도움창) 데이터 요청을 위한 URL 경로
             */
            getCodeDataUrl: function (code) {
                var url;

                if (code) {
                    url = dews.string.format(dews._environments.codeDataUrlFormat, code);
                    url = dews.url.getAbsoluteUrl(url);
                } else {
                    throw '코드도움(도움창) 코드가 입력되지 않았습니다.';
                }

                return url;
            },
            /**
             * 코드도움 화면의 URL을 가져옵니다.
             * @param {string} code 코드도움(도움창) 코드
             * @returns {string} 코드도움(도움창) 화면 URL
             */
            getCodeViewUrl: function (code) {
                var url;

                if (code) {
                    url = dews.string.format(dews._environments.codeViewUrlFormat, code);
                    url = dews.url.getAbsoluteUrl(url);
                } else {
                    throw '코드도움(도움창) 코드가 입력되지 않았습니다.';
                }

                return url;
            },
            getApiUrl: function (module, service, path) {
                var url;

                if (!module || !service) {
                    throw '잘못된 값이 입력되었습니다.';
                }

                path = path || '';

                url = dews.string.format('/api/{0}/{1}', module, service);

                if (path) {
                    if ($.isFunction(path)) {
                        var result = path.call(null);
                        url += result.startsWith('/') ? result : '/' + result;
                    } else {
                        url += path.startsWith('/') ? path : '/' + path;
                    }
                }

                return url;
            }
        }
    });

    // Ajax 통신을 위한 ajax 네임스페이스 추가
    $.extend(true, dews, {
        /**
         * AJAX 관련 기능 제공
         * @namespace
         */
        ajax: {
            /**
             * POST 방식의 AJAX 요청을 수행합니다.
             * @param {string} url AJAX로 요청할 URL입니다.
             * @param {object} [settings] AJAX 요청의 설정 값입니다.
             * @returns {Promise} AJAX 요청에 대한 Promise 객체입니다.
             */
            post: function (url, settings) {
                return ajaxUtil.sendAjax('post', url, settings);
            },
            /**
             * GET 방식의 AJAX 요청을 수행합니다.
             * @param {string} url AJAX로 요청할 URL입니다.
             * @param {object} [settings] AJAX 요청의 설정 값입니다.
             * @returns {Promise} AJAX 요청에 대한 Promise 객체입니다.
             */
            get: function (url, settings) {
                return ajaxUtil.sendAjax('get', url, settings);
            },
            /**
             * PUT 방식의 AJAX 요청을 수행합니다.
             * @param {string} url AJAX로 요청할 URL입니다.
             * @param {object} [settings] AJAX 요청의 설정 값입니다.
             * @returns {Promise} AJAX 요청에 대한 Promise 객체입니다.
             */
            put: function (url, settings) {
                return ajaxUtil.sendAjax('put', url, settings);
            },
            /**
             * DELETE 방식의 AJAX 요청을 수행합니다.
             * @param {string} url AJAX로 요청할 URL입니다.
             * @param {object} [settings] AJAX 요청의 설정 값입니다.
             * @return {Promise} AJAX 요청에 대한 Promise 객체입니다.
             */
            delete: function (url, settings) {
                return ajaxUtil.sendAjax('del', url, settings);
            },
            /**
             * JSON 데이터를 가져오기 위한 AJAX 요청을 수행합니다.
             * @param {string} url AJAX로 요청할 URL입니다.
             * @param {object} [settings] AJAX 요청의 설정 값입니다.
             * @returns {Promise} AJAX 요청에 대한 Promise 객체입니다.
             */
            data: function (url, settings) {
                return ajaxUtil.sendAjax('data', url, settings);
            },
            /**
             * 지정한 URL 의 HTML 컨텐츠를 target 요소에 로드합니다.
             * @param {string|jQuery} target 컨텐츠를 로드할 컨테이너 요소입니다.
             * @param {string} url 컨텐츠 URL입니다.
             * @param {object|string} [data] AJAX 요청에 함께 전송할 데이터입니다.
             * @param {function} [complete] 로드가 완료되면 실행할 콜백함수입니다.
             */
            load: function (target, url, data, complete) {
                var $target, callback;

                if (target instanceof jQuery) {
                    $target = target;
                } else {
                    $target = $(target);
                }

                url = dews.url.getAbsoluteUrl(url);

                callback = function (response, status, xhr) {
                    if (status !== 'error') {
                        // 컨테이너 내부에서 신규로 로드된 컨트롤의 초기화하기 위해서 이벤트를 발생시킨다.
                        $(document).trigger('inituicontrols', [ $target ]);
                    } else {
                        dews.log('## dews.ajax.load 오류 ## - ' + xhr.status + ' ' + xhr.statusText + ' ' + response);
                    }

                    if ($.type(complete) === 'function') {
                        complete(response, status, xhr);
                    }
                };

                $target.load(url, data, callback);
            },
            /**
             * 지정한 URL의 자바스크립트 파일을 로드합니다.
             * @param {string} url 스크립트 파일의 URL 입니다.
             * @param {object} [settings] AJAX 요청의 설정 값입니다.
             * @returns {Promise} AJAX 요청에 대한 Promise 객체입니다.
             */
            script: function (url, settings) {
                var isLoadOnce = true;
                url = dews.url.getAbsoluteUrl(url);

                // 스크립트를 한번만 로드하도록 합니다.
                if ($.type(settings) !== 'undefined' && settings.hasOwnProperty('once')) {
                    isLoadOnce = !!settings.once;
                    delete settings.once;
                }
                if (isLoadOnce) {
                    if (loadedCommonScripts.indexOf(url) >= 0) {
                        var $dfr = $.Deferred();
                        $dfr.resolve();
                        return $dfr;
                    } else {
                        loadedCommonScripts.push(url);
                    }
                }

                settings = $.extend(settings || {}, {
                    dataType: 'script',
                    cache: true,
                    url: url
                });

                return $.ajax(settings);
            },
            on: function (evtName, callback) {
                $(dews.ajax).on.call($(dews.ajax), evtName, callback);
            },
            off: function (evtName) {
                $(dews.ajax).off.call($(dews.ajax), evtName);
            }
        },
        /**
         * API 요청 관련 기능 제공
         * @namespace
         */
        api: {
            get: function(url, settings) {
                settings = settings || {};
                $.extend(true, settings, { method: 'GET' });
                return ajaxUtil.sendAjax('api', url, settings);
            },
            post: function(url, settings) {
                settings = settings || {};
                $.extend(true, settings, { method: 'POST' });
                return ajaxUtil.sendAjax('api', url, settings);
            },
            put: function(url, settings) {
                settings = settings || {};
                $.extend(true, settings, { method: 'PUT' });
                return ajaxUtil.sendAjax('api', url, settings);
            },
            delete: function(url, settings) {
                settings = settings || {};
                $.extend(true, settings, { method: 'DELETE' });
                return ajaxUtil.sendAjax('api', url, settings);
            },
            batchSave: function(url) {
                var dataSources = Array.prototype.slice.call(arguments, 1);
                var dfr = $.Deferred();

                if ($.isArray(dataSources)) {
                    var batchData = {},
                    options, opt;

                    if ($.isPlainObject(dataSources[dataSources.length - 1])) {
                        options = dataSources.pop();
                    } else {
                        options = {};
                    }

                    dataSources.forEach(function (ds) {
                        if (ds.hasOwnProperty('options') && ds.options.hasOwnProperty('id')) {
                            batchData[ds.options.id] = ds.getDirtyData();
                        } else {
                            throw '데이터소스의 아이디가 존재하지 않습니다.';
                        }
                    });

                    opt = $.extend(true, {}, {
                        type: "POST",
                        data: { rows: JSON.stringify(batchData) }
                    }, options);

                    dews.api.post(url, opt).done(function (result) {
                        dataSources.forEach(function (ds) {
                            ds.options._destroy = [];
                            ds._destroyed = [];
                            if (ds.dataProvider) {
                                ds.dataProvider.clearRowStates();
                                if (ds.options.lineDataSources) {
                                    $.each(ds.options.lineDataSources, function (idx, item) {
                                        item.options._destroy = [];
                                        if (item.dataProvider) {
                                            item.dataProvider.clearRowStates();
                                        }
                                    });
                                }
                            }
                        });
                        dfr.resolve(result);
                    }).fail(function (jqXHR, status, msg, data) {
                        dfr.reject(msg);
                    });
                }

                return dfr;
            },
            saveAll: function() {

            }
        }
    });

})(jQuery, window.dews);


/*
 * 지역화
 */
(function ($, dews) {
    var defaultLanguage = 'ko',
        dictionary = {};

    /**
     * 다국어 사전에 새로운 지역화 리소스를 등록합니다.
     * @param {object} dic 사전에 등록할 사전
     * @param {string} [lang] 언어 (생략 시 현재 언어 사용)
     * @param {string} [page] 페이지 아이디 ('multiple' 모드를 사용할 경우 필수 값)
     */
    function setLocalizedResources(dic, lang, page) {
        var mode = dews._environments.localizationMode;
        var use = dews._environments.useLocalization;
        var extDic;

        lang = lang || dews._environments.lang;

        if (!use) return;
        if (!$.isPlainObject(dic)) return;

        if (mode === 'single') {
            // 모든 다국어 리소스를 하나의 사전으로 관리 'single'
            extDic = {};
            extDic[lang] = dic;
            dictionary = $.extend(true, dictionary, extDic);
        } else {
            // 다국어 리소스가 제공된 페이지 아이디에 의해 분리되어 관리 'multiple'
            page = page || 'global';
            extDic = {};
            extDic[page] = {};
            extDic[page][lang] = dic;
            dictionary = $.extend(true, dictionary, extDic);
        }
    }

    /**
     * multiple 모드에서 지정한 페이지의 다국어 사전을 제거합니다.
     * @param {string} page 페이지 아이디
     */
    function removeLocalizedResources(page) {
        var mode = dews._environments.localizationMode;
        var use = dews._environments.useLocalization;

        if (use && page && page !== 'global' && mode === 'multiple') {
            delete dictionary[page];
        }
    }

    /**
     * 다국어 사전에서 키(key)에 해당하는 메시지를 가져옵니다.
     * @param {string} defMsg 다국어 사전에 등록된 메시지가 없을 경우 대체될 기본 메시지입니다.
     * @param {string} key 다국어 사전에서의 키입니다.
     * @param {string} [lang] 언어 (생략 시에는 현재 언어를 사용합니다.)
     * @param {string} [page] multiple 모드에서 다국어 리소스를 사용하는 페이지 아이디 입니다. (생략 시에는 현재 페이지 아이디입니다.)
     * @returns {string} 지역화된 메시지 문자열
     */
    function getLocalizedResource(defMsg, key, lang, page) {
        var msg;
        var defLang = dews._environments.lang;
        var mode = dews._environments.localizationMode;
        var use = dews._environments.useLocalization;
        var pageDic, globalDic;

        if (!use) return defMsg || key;

        lang = lang || defLang;

        if (mode === 'single') {
            // 모든 다국어 리소스를 하나의 사전으로 관리 'single'
            msg = dictionary[lang] ? dictionary[lang][key] : null
                || dictionary[defLang] ? dictionary[defLang][key] : null
                || defMsg;
        } else {
            // 다국어 리소스가 제공된 페이지 아이디에 의해 분리되어 관리 'multiple'
            page = getCurrentPage(page);

            pageDic = dictionary[page];
            globalDic = dictionary['global'];

            key = key || defMsg; // 이전 버전 호환성

            if ($.type(pageDic) !== 'undefined') {
                if (pageDic.hasOwnProperty(lang) && pageDic[lang].hasOwnProperty(key)) {
                    msg = pageDic[lang][key];
                } else if (pageDic.hasOwnProperty(defLang) && pageDic[defLang].hasOwnProperty(key)) {
                    msg = pageDic[defLang][key];
                }
            }

            if (!msg && typeof(globalDic) !== 'undefined') {
                if (globalDic.hasOwnProperty(lang) && globalDic[lang].hasOwnProperty(key)) {
                    msg = globalDic[lang][key];
                } else if (globalDic.hasOwnProperty(defLang) && globalDic[defLang].hasOwnProperty(key)) {
                    msg = globalDic[defLang][key];
                }
            }

            if (!msg)
                console.log(
                    dews.string.format(
                        '## 지역화 경고 : 등록된 지역화 리소스 중 \'{0}\'를 찾을 수 없어 기본 문자열 \'{1}\'로 대체합니다.',
                        key,
                        defMsg
                    )
                );
            msg = msg || defMsg;
        }

        return msg;
    }

    /**
     * 지정한 페이지 아이디에 포함되는 다국어 리소스를 로드합니다.
     * @param {string} [lang] 대상 언어
     * @param {string} [page] 대상 페이지 아이디 (multiple 모드에서의 페이지 아이디)
     */
    function loadLocalizedResources(lang, page) {
        var defLang = dews._environments.lang;
        var use = dews._environments.useLocalization;
        var url = dews._environments.localizationServiceUrl;
        var adapter = dews._environments.localizationServiceAdapter;
        var dfr = new $.Deferred();

        if (!use) {
            dfr.resolve();
            return dfr;
        }

        lang = lang || defLang;

        if (dews._environments.localizationMode === 'multiple') {
            page = getCurrentPage(page);
            url = dews.string.format(url, page, lang);
        } else {
            url = dews.string.format(url, lang);
        }

        return dews.api.get(url).done(function (dic) {
            if (adapter && $.isFunction(adapter)) {
                // 데이터 아답터가 있을 경우 후처리 실시
                dic = adapter(dic);
            }
            setLocalizedResources(dic, lang, page);
        });
    }

    /**
     * multiple 모드에서 다국어 리소스를 관리하는 대상 페이지를 가져옵니다.
     * @param {string} page 입력된 페이지 아이디
     * @returns {string} 다국어 리소스가 관리되는 페이지 아이디
     */
    function getCurrentPage(page) {
        if (!page) {
            if (dews.hasOwnProperty('ui')
                && dews.ui.hasOwnProperty('dialogPage')
                && dews.ui.dialogPage && dews.ui.dialogPage.hasOwnProperty('id')) {
                page = dews.ui.dialogPage.id;
            } else if (dews.hasOwnProperty('ui')
                && dews.ui.hasOwnProperty('page')
                && dews.ui.page && dews.ui.page.hasOwnProperty('menu')) {
                page = dews.ui.page.menu.id;
            }
        }

        return page;
    }

    // 지역화를 위해서 dews._environments 네임스페이스에 지역화 관련 설정 값을 추가합니다.
    $.extend(true, dews, {
        /**
         * @namespace
         */
        _environments: {
            /**
             * 지역화를 사용하는지 여부
             */
            useLocalization: true,
            /**
             * 기본 언어
             */
            lang: defaultLanguage,
            /**
             * 지역화 리소스 제공 서비스의 URL
             */
            localizationServiceUrl: '',
            /**
             * 지역화 기능의 동작 형식
             */
            localizationMode: 'multiple',
            /**
             * 서비스 데이터 아답터
             */
            localizationServiceAdapter: undefined
        }
    });

    // dews 에 지역화 관련 localize 네임스페이스와 기능을 추가합니다.
    $.extend(true, dews, {
        /**
         * 지역화 네임스페이스
         * @namespace
         */
        localize: {
            /**
             * 지역화 기능을 사용합니다.
             */
            enable: function () {
                dews._environments.useLocalization = true;
            },
            /**
             * 지역화 기능을 사용하지 않습니다.
             */
            disable: function () {
                dews._environments.useLocalization = false;
            },
            /**
             * 지역화 리소스를 제공하는 서버 서비스의 URL 을 설정합니다.
             * @param {string} pattern 다국어 리소스 반환 API 의 URL 패턴
             */
            /**
             * 지역화 리소스를 제공하는 서버 서비스의 URL 을 가져옵니다.
             * @returns {string} 다국어 리소스 반환 API 의 URL 패턴
             */
            serviceUrl: function(pattern) {
                if ($.type(pattern) === 'undefined') {
                    return dews._environments.localizationServiceUrl;
                } else {
                    dews._environments.localizationServiceUrl = dews.url.getAbsoluteUrl(pattern);
                }
            },
            /**
             * 지역화 리소스를 제공하는 서버 서비스의 URL을 설정합니다.
             * @deprecated use serviceUrl(string)
             */
            setServiceUrl: function (pattern) {
                dews.localize.serviceUrl(pattern);
            },
            /**
             * 다국어 리소스를 반환하는 서버 API 서비스의 URL을 가져옵니다.
             * @returns {string} 다국어 리소스 반환 API 의 URL 패턴
             * @deprecated use serviceUrl()
             */
            getServiceUrl: function () {
                return dews.localize.serviceUrl();
            },
            /**
             * 서버에서 제공된 다국어 리소스의 후처리 함수를 설정합니다.
             * @param {Function} adapter 후처리 함수
             */
            /**
             * 서버에서 제공된 다국어 리소스의 후처리 함수를 가져옵니다.
             * @param {Function} adapter 후처리 함수
             */
            serviceAdapter: function (adapter) {
                if ($.type(adapter) === 'undefined') {
                    return dews._environments.localizationServiceAdapter;
                } else if ($.isFunction(adapter)) {
                    dews._environments.localizationServiceAdapter = adapter;
                }
            },
            /**
             * 지역화 기능의 동작 형식을 설정합니다.
             * @param {string} value 동작형식 (single | multiple)
             */
            /**
             * 지역화 기능의 동작 형식을 가져옵니다.
             * @returns {string} 동작형식 (single | multiple)
             */
            mode: function(value) {
                if ($.type(value) === 'undefined') {
                    return dews._environments.localizationMode;
                } else {
                    dews._environments.localizationMode = value;
                }
            },
            /**
             * 지역화 기능의 동작 형식를 설정합니다.
             * @param {string} mode 동작 형식 (single | multiple)
             * @deprecated use mode(string)
             */
            setMode: function (mode) {
                dews.localize.mode(mode);
            },
            /**
             * 지역화 기능의 동작 형식을 가져옵니다.
             * @returns {string} 동작 형식 (single | multiple)
             * @deprecated use mode()
             */
            getMode: function () {
                return dews.localize.mode();
            },
            /**
             * 지역화 언어를 설정합니다.
             * @param {string} lang 언어 코드 (ko|en|ja|zh)
             */
            /**
             * 지역화 언어를 가져옵니다.
             * @returns {string} 현재 설정되 언어 코드 (ko|en|ja|zh)
             */
            language: function (lang) {
                if ($.type(lang) === 'undefined') {
                    return dews._environments.lang;
                } else {
                    dews._environments.lang = lang;
                    // kendo UI의 다국어 지원파일을 읽어오기 위한 이벤트를 발생
                    // 현재로선 이벤트 발생시 컨트롤들에 적용된 언어의 변경은 지원하지 않음
                    $(window).trigger('langchange', [lang]);
                }
            },
            /**
             * 지역화 언어를 설정합니다.
             * @param {string} lang 언어 코드입니다. (ko|en|ja|zh)
             * @deprecated use language(string)
             */
            setLanguage: function (lang) {
                dews.localize.language(lang);
            },
            /**
             * 지역화 언어를 가져옵니다.
             * @returns {string} 지역화 언어 코드 (ko|en|ja|zh)
             * @deprecated use language()
             */
            getLanguage: function () {
                return dews.localize.language();
            },
            /**
             * 지정한 코드의 지역화된 문자열을 가져옵니다.
             * @param {string} defMsg 다국어 사전에 등록된 메시지가 없을 경우 대체될 기본 메시지입니다.
             * @param {string} key 다국어 사전에서의 키입니다.
             * @param {string} [lang] 언어 (생략 시에는 현재 언어를 사용합니다.)
             * @param {string} [page] multiple 모드에서 다국어 리소스를 사용하는 페이지 아이디 입니다. (생략 시에는 현재 페이지 아이디입니다.)
             * @returns {string} 지역화된 메시지 문자열
             */
            get: function (defMsg, key, lang, page) {
                return getLocalizedResource(defMsg, key, lang, page);
            },
            /**
             * 다국어 자동 변환기를 위한 get 함수의 alias
             */
            getManual: function (defMsg, key, lang, page) {
                // 다국어 자동 변환기를 이용하는 경우 변환기 실행 시 변환 대상에서 제외시키기 위해서 추가
                return getLocalizedResource(defMsg, key, lang, page);
            },
            /**
             * 다국어 사전에 지역화 처리에 필요한 메시지을 등록합니다.
             * @param {object} dictionary 다국어 처리용 사전
             * @param {string} [lang] 대상 언어
             * @param {string} [page] 대상 페이지 아이디
             */
            setResource: function (dictionary, lang, page) {
                setLocalizedResources(dictionary, lang, page);
            },
            /**
             * 지정한 페이지 아이디에 포함되는 다국어 리소스를 로드합니다.
             * @param {string} [lang] 대상 언어
             * @param {string} [page] 대상 페이지 아이디 (multiple 모드에서의 페이지 아이디)
             */
            load: function (lang, page) {
                return loadLocalizedResources(lang, page);
            },
            /**
             * 지정한 페이지의 다국어 리소스를 제거합니다.
             * @param {string} page 대상 페이지 아이디
             */
            unload: function (page) {
                removeLocalizedResources(page);
            },
            /**
             * 지정한 포맷의 날짜 달력의 일을 설정합니다.
             */
            getDays: function () {
                return kendo.getCulture().calendars.standard.days.namesShort;
            },
            /**
             * 지정한 포맷의 날짜 달력의 월을 설정합니다.
             */
            getMonth: function () {
                return kendo.getCulture().calendars.standard.months.names;
            }
        }
    });
})(jQuery, window.dews);