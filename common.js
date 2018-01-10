"use strict";
exports.__esModule = true;
var interfaces_1 = require("./interfaces");
var Common = /** @class */ (function () {
    function Common() {
    }
    Common.prototype.extend = function (src, dest, copy) {
        for (var i in src) {
            if (typeof src[i] === 'object') {
                if (dest && dest[i])
                    src[i] = this.extend(src[i], dest[i]);
            }
            else if (typeof dest === 'object' && typeof dest[i] !== 'undefined') {
                src[i] = dest[i];
            }
        }
        if (copy)
            return JSON.parse(JSON.stringify(src));
        return src;
    };
    Common.prototype.jsonToHtml = function (obj) {
        var elm = null, isNsElem = Common.NameSpaceElements.filter(function (x) { return x == obj.type; }).length > 0;
        if (isNsElem)
            elm = document.createElementNS(Common.xmlns, obj.type);
        else
            elm = document.createElement(obj.type);
        for (var i in obj.attrs) {
            if (isNsElem)
                elm.setAttributeNS(null, i, obj.attrs[i]);
            else
                elm.setAttribute(i, obj.attrs[i]);
        }
        for (var i_1 in obj.children) {
            var newElem = null;
            if (obj.children[i_1].type == '#text')
                newElem = document.createTextNode(obj.children[i_1].text);
            else
                newElem = this.jsonToHtml(obj.children[i_1]);
            if ((newElem && newElem.tagName && newElem.tagName.toLowerCase() !== 'undefined') || newElem.nodeType == 3)
                elm.appendChild(newElem);
        }
        return elm;
    };
    Common.prototype.isHex = function (str) {
        return str.indexOf('#') > -1;
    };
    Common.prototype.isRgba = function (str) {
        return str.split(',').length > 3;
    };
    Common.prototype.toRgbObj = function (rgba) {
        var arr = rgba.split(',').map(function (item) {
            return parseInt(item, 10);
        });
        return {
            Red: arr[0],
            Green: arr[1],
            Blue: arr[2],
            Alpha: arr[3]
        };
    };
    Common.prototype.RgbObjToString = function (rgba) {
        var ans = '(' + rgba.Red + ',' + rgba.Green + ',' + rgba.Blue;
        if (rgba.Alpha)
            ans += ',' + rgba.Alpha;
        ans += ')';
        return ans;
    };
    Common.prototype.hexToRgb = function (hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            Red: parseInt(result[1], 16),
            Green: parseInt(result[2], 16),
            Blue: parseInt(result[3], 16)
        } : null;
    };
    Common.prototype.setInnerTextDefaults = function (innerText) {
        if (!innerText)
            innerText = {
                text: ''
            };
        if (!innerText.text)
            innerText.text = '';
        if (!innerText.fontSize)
            innerText.fontSize = 18;
        if (!innerText.lineHeight)
            innerText.lineHeight = innerText.fontSize;
        if (!innerText.fontFamily)
            innerText.fontFamily = 'Arial,Utkal,sans-serif';
        if (!innerText.fontWeight)
            innerText.fontWeight = 'normal';
        if (!innerText.letterSpacing)
            innerText.letterSpacing = '0';
        return innerText;
    };
    Common.prototype.getComputedStyleByParentRec = function (elem, cssProp) {
        if (!elem)
            return null;
        var css = getComputedStyle(elem);
        var val = css[cssProp];
        if (val && val != 'rgba(0, 0, 0, 0)')
            return val;
        return this.getComputedStyleByParentRec(elem.parentElement, cssProp);
    };
    // odd strokeWidth is not supported
    Common.prototype.fixStrokeWidth = function (sw) {
        if (sw % 2 == 1)
            console.warn('all-gauge: stroke-width "' + sw + '" is not supported (odd), changed to "' + (++sw)) + '"';
        return sw;
    };
    // odd radius is not supported
    Common.prototype.fixRadius = function (r) {
        if (r % 2 == 1)
            console.warn('all-gauge: radius "' + r + '" is not supported (odd), changed to "' + (++r)) + '"';
        return r;
    };
    Common.prototype.getDefaultColors = function () {
        return {
            active: '#4CCEAD',
            "default": '#505050',
            inactive: '#ededed'
        };
    };
    Common.prototype.getNeedleInnerStyle = function (radius) {
        return {
            'height': (radius + 20) + 'px',
            'width': (radius / Common.needleWidthHeightRatio) + 'px'
        };
    };
    Common.prototype.getNeedleStyle = function (radius, arcNeedlePercentage, scale, indent) {
        if (indent === void 0) { indent = 50; }
        if (typeof scale !== 'number')
            scale = 1.125;
        var deg = (arcNeedlePercentage - indent) * 3.6;
        return {
            'left': 'calc(50% - ' + ((radius / Common.needleWidthHeightRatio)) / 2 + 'px',
            'transform': 'rotate(' + deg + 'deg) scale(' + scale + ')'
        };
    };
    Common.prototype.isInRange = function (minMaxVal, sides) {
        switch (sides) {
            case interfaces_1.SideState.Both: {
                return (minMaxVal.min < minMaxVal.value && minMaxVal.max > minMaxVal.value);
            }
            case interfaces_1.SideState.None: {
                return (minMaxVal.min <= minMaxVal.value && minMaxVal.max >= minMaxVal.value);
            }
            case interfaces_1.SideState.Left: {
                return (minMaxVal.min < minMaxVal.value && minMaxVal.max >= minMaxVal.value);
            }
            case interfaces_1.SideState.Right: {
                return (minMaxVal.min <= minMaxVal.value && minMaxVal.max > minMaxVal.value);
            }
        }
    };
    Common.prototype.normalizeByPercentage = function (value, percentage, mid, max) {
        if (typeof mid === 'undefined')
            mid = 50;
        if (typeof max === 'undefined')
            max = mid * 2;
        var rel = null;
        if (value > mid) {
            percentage /= 2;
            rel = Math.abs(mid - value);
            rel = rel / mid;
            percentage *= rel;
            return value * (1 - percentage);
        }
        else {
            if (value == 0.0)
                value = 0.001;
            rel = Math.abs(value - mid);
            rel = rel / mid;
            percentage *= rel;
            return value + (mid * (percentage));
        }
    };
    Common.prototype.getRemainder = function (range, hour) {
        var current = 100 / 12 * hour;
        if (current >= range.from && current <= range.to) {
            return current - range.from;
        }
        return 0;
    };
    Common.prototype.isHourInRange = function (range, hour) {
        var current = 100 / 12 * hour;
        if (current >= range.from && current <= range.to)
            return true;
        return false;
    };
    Common.prototype.getPercentageByTime = function (dateTime) {
        var secondsInADay = 86400; //24 * 60 * 60;
        var hours = dateTime.getHours() * 3600; //60 * 60;
        var minutes = dateTime.getMinutes() * 60;
        var seconds = dateTime.getSeconds();
        var totalSeconds = hours + minutes + seconds;
        var percentSeconds = 100 * totalSeconds / secondsInADay;
        return percentSeconds;
        // let max = 86400000; // 1000 * 60 * 60 * 24 is the number of milliseconds on a 24 hours day.
        // let hours = dateTime.getHours();
        // let minutes = dateTime.getMinutes();
        // let seconds = dateTime.getSeconds();
        // let total = (hours * 1000 * 60 * 60) + (minutes * 1000 * 60) + (seconds * 1000);
        // let percentage = total / max;
        // return percentage * 100;
    };
    Common.prototype.getMinutesFromHour = function (hour) {
        var arr = hour.split(':');
        return parseInt(arr[0].trim()) * 60 + parseInt(arr[1].trim());
    };
    Common.prototype.getMinutesFromStart = function (hour, start) {
        if (start === void 0) { start = 0; }
        var arr = hour.split(':');
        return Math.max((parseInt(arr[0].trim()) * 60 + (parseInt(arr[1].trim()))) - start, 0);
    };
    Common.prototype.getHoursAndMinutesLT = function (date) {
        var hours = date.getHours();
        hours = (hours + 24 - 2) % 24;
        var mid = 'am';
        if (hours == 0) {
            hours = 12;
        }
        else if (hours > 12) {
            hours = hours % 12;
            mid = 'pm';
        }
        return hours + ':' + date.getMinutes() + ' ' + mid;
    };
    Common.prototype.getSecondsFromTime = function (timer) {
        var hours = 0;
        hours += timer.hours * 3600;
        hours += timer.minutes * 60;
        hours += timer.seconds;
        return hours;
    };
    Common.prototype.setTimeToZero = function (timer) {
        timer.hours = 0;
        timer.minutes = 0;
        timer.seconds = 0;
    };
    Common.prototype.decreaseTime = function (timer) {
        if (timer.seconds > 0) {
            if (--timer.seconds < 0) {
                timer.seconds = 59;
                if (--timer.minutes < 0) {
                    timer.minutes = 59;
                    if (--timer.hours < 0) {
                        this.setTimeToZero(timer);
                        return true;
                    }
                }
            }
        }
        else if (timer.minutes > 0) {
            timer.seconds = 59;
            if (--timer.minutes < 0) {
                timer.minutes = 59;
                if (--timer.hours < 0) {
                    this.setTimeToZero(timer);
                    return true;
                }
            }
        }
        else if (timer.hours > 0) {
            timer.minutes = 59;
            if (--timer.hours < 0) {
                this.setTimeToZero(timer);
                return true;
            }
        }
        else if (this.isTimeZero(timer)) {
            this.setTimeToZero(timer);
            return true;
        }
        return false;
    };
    Common.prototype.isTimeZero = function (timer) {
        if (timer.hours <= 0 && timer.minutes <= 0 && timer.seconds <= 0)
            return true;
        return false;
    };
    Common.prototype.padWithZiro = function (text) {
        if (String(text).length < 2)
            text = '0' + text;
        return text;
    };
    Common.prototype.getSideStateByString = function (state) {
        if (!state)
            return interfaces_1.SideState.None;
        switch (state.toLowerCase()) {
            case 'left':
                return interfaces_1.SideState.Left;
            case 'right':
                return interfaces_1.SideState.Right;
            case 'both':
                return interfaces_1.SideState.Both;
            case 'none':
                return interfaces_1.SideState.None;
            default:
                return interfaces_1.SideState.None;
        }
    };
    Common.NameSpaceElements = ['svg', 'path', 'g'];
    Common.xmlns = "http://www.w3.org/2000/svg";
    // static needleWidthHeightRatio: number = 9.107127839547825;
    Common.needleWidthHeightRatio = 8.69322239126;
    return Common;
}());
exports.Common = Common;
