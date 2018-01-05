(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var Circle = /** @class */function () {
    function Circle(options) {
        this.options = options;
        this.common = new common_1.Common();
        this.injectCss();
        this.init();
    }
    Circle.prototype.injectCss = function () {
        var className = '_all-gauge-js-circle-style';
        if (document.querySelector('.' + className)) return;
        var style = "@keyframes allGaugeRotatingCircle {\n            from {\n                transform: rotate(0deg);\n            }\n            to {\n                transform: rotate(360deg);\n            }\n        }";
        var sheet = document.createElement('style');
        sheet.innerHTML = style;
        sheet.className = className;
        document.body.appendChild(sheet);
    };
    Circle.prototype.update = function (options) {
        this.options = this.common.extend(this.options, options);
        this.updateOptions();
    };
    Circle.prototype.updateOptions = function () {
        this.setSvg(this.options);
        this.setElements(this.options);
    };
    Circle.prototype.setSvg = function (options) {
        var startAngle = (options.fromDegree - 50) * 3.6,
            endAngle = (options.toDegree - 50) * 3.6;
        var d = this.describeArc(options.radius, options.radius, options.radius - options.strokeWidth / 2, startAngle, endAngle);
        var svg = this.element.querySelector('svg');
        var dim = options.radius * 2;
        svg.style.transitionDuration = options.animationDuration;
        svg.style.width = dim + 'px';
        svg.style.height = dim + 'px';
        svg.style.animation = "allGaugeRotatingCircle " + options.rotationSpeed + "ms linear infinite";
        svg.setAttributeNS(null, 'width', dim + 'px');
        svg.setAttributeNS(null, 'height', dim + 'px');
        var path = svg.querySelector('[data-arc]');
        path.setAttributeNS(null, 'stroke', options.colors.active);
        path.setAttributeNS(null, 'stroke-width', options.strokeWidth);
        path.setAttributeNS(null, 'd', d);
        path.style.strokeWidth = options.strokeWidth + 'px';
        path.style.transitionDuration = options.animationDuration;
        var concealer = svg.querySelector('[data-concealer]');
        if (options.hideBottom) {
            startAngle = 33.334 * 3.6, endAngle = 66.667 * 3.6;
            d = this.describeArc(options.radius, options.radius, options.radius - options.strokeWidth / 2, startAngle, endAngle);
            concealer.setAttributeNS(null, 'stroke-width', options.strokeWidth + 2);
            concealer.setAttributeNS(null, 'd', d);
            concealer.style.strokeWidth = options.strokeWidth + 2 + 'px';
            concealer.style.display = '';
            var bgColor = options.backgroundColor;
            if (!bgColor) bgColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
            if (!bgColor) bgColor = '#ffffff';
            concealer.setAttributeNS(null, 'stroke', bgColor);
        } else concealer.style.display = 'none';
    };
    Circle.prototype.setElements = function (options) {
        // let circle = this.element.querySelector('div[data-circle]');
        var circle = this.element.children[0];
        var dim = this.options.radius * 2 + 'px';
        circle.style.width = dim;
        circle.style.height = dim;
        circle.style.transitionDuration = options.animationDuration;
        var c1 = circle.querySelector('[data-c1]');
        c1.style.width = dim;
        c1.style.height = dim;
        c1.style.backgroundColor = this.options.colors.inactive;
        c1.style.transitionDuration = options.animationDuration;
        var c3 = circle.querySelector('[data-c3]');
        dim = options.radius * 2 - options.strokeWidth * 2 + 'px';
        c3.style.width = dim;
        c3.style.height = dim;
        c3.style.top = options.strokeWidth + 'px';
        c3.style.left = options.strokeWidth + 'px';
        c3.style.backgroundColor = options.backgroundColor;
        c3.style.transitionDuration = options.animationDuration;
    };
    Circle.prototype.init = function () {
        this.element = this.common.jsonToHtml({
            type: 'div',
            attrs: {
                'style': "position: relative; margin: auto; display: block;",
                'data-circle': 'true'
            },
            children: [{
                type: 'div',
                children: [{
                    type: 'span',
                    attrs: {
                        'data-c1': '',
                        'style': "position: absolute;top: 0; left: 0; z-index: 1; border-radius: 50%;"
                    }
                }, {
                    type: 'svg',
                    attrs: {
                        'style': "position: absolute; top: 0;left: 0; z-index: 2; border-radius: unset;"
                    },
                    children: [{
                        type: 'path',
                        attrs: {
                            'fill': 'none',
                            'data-arc': ''
                        }
                    }, {
                        type: 'path',
                        attrs: {
                            'fill': 'none',
                            'data-concealer': ''
                        }
                    }]
                }, {
                    type: 'span',
                    attrs: {
                        'data-c3': '',
                        'style': "position: absolute; z-index: 3; border-radius: 50%;"
                    }
                }]
            }]
        });
        this.updateOptions();
    };
    Circle.prototype.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    };
    Circle.prototype.describeArc = function (x, y, radius, startAngle, endAngle) {
        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);
        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        var d = ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
        return d;
    };
    Circle.prototype.getElement = function () {
        return this.element;
    };
    return Circle;
}();
exports.Circle = Circle;

},{"./common":2}],2:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var Common = /** @class */function () {
    function Common() {}
    Common.prototype.extend = function (src, dest, copy) {
        for (var i in src) {
            if (_typeof(src[i]) === 'object') {
                if (dest && dest[i]) src[i] = this.extend(src[i], dest[i]);
            } else if ((typeof dest === "undefined" ? "undefined" : _typeof(dest)) === 'object' && typeof dest[i] !== 'undefined') {
                src[i] = dest[i];
            }
        }
        if (copy) return JSON.parse(JSON.stringify(src));
        return src;
    };
    Common.prototype.jsonToHtml = function (obj) {
        var elm = null,
            isNsElem = Common.NameSpaceElements.filter(function (x) {
            return x == obj.type;
        }).length > 0;
        if (isNsElem) elm = document.createElementNS(Common.xmlns, obj.type);else elm = document.createElement(obj.type);
        for (var i in obj.attrs) {
            if (isNsElem) elm.setAttributeNS(null, i, obj.attrs[i]);else elm.setAttribute(i, obj.attrs[i]);
        }
        for (var i_1 in obj.children) {
            var newElem = null;
            if (obj.children[i_1].type == '#text') newElem = document.createTextNode(obj.children[i_1].text);else newElem = this.jsonToHtml(obj.children[i_1]);
            if (newElem && newElem.tagName && newElem.tagName.toLowerCase() !== 'undefined' || newElem.nodeType == 3) elm.appendChild(newElem);
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
        if (rgba.Alpha) ans += ',' + rgba.Alpha;
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
        if (!innerText) innerText = {
            text: ''
        };
        if (!innerText.text) innerText.text = '';
        if (!innerText.fontSize) innerText.fontSize = 18;
        if (!innerText.lineHeight) innerText.lineHeight = innerText.fontSize;
        if (!innerText.fontFamily) innerText.fontFamily = 'Arial,Utkal,sans-serif';
        if (!innerText.fontWeight) innerText.fontWeight = 'normal';
        if (!innerText.letterSpacing) innerText.letterSpacing = '0';
        return innerText;
    };
    Common.prototype.getComputedStyleByParentRec = function (elem, cssProp) {
        if (!elem) return null;
        var css = getComputedStyle(elem);
        var val = css[cssProp];
        if (val && val != 'rgba(0, 0, 0, 0)') return val;
        return this.getComputedStyleByParentRec(elem.parentElement, cssProp);
    };
    // odd strokeWidth is not supported
    Common.prototype.fixStrokeWidth = function (sw) {
        if (sw % 2 == 1) console.warn('all-gauge: stroke-width "' + sw + '" is not supported (odd), changed to "' + ++sw) + '"';
        return sw;
    };
    // odd radius is not supported
    Common.prototype.fixRadius = function (r) {
        if (r % 2 == 1) console.warn('all-gauge: radius "' + r + '" is not supported (odd), changed to "' + ++r) + '"';
        return r;
    };
    Common.prototype.getDefaultColors = function () {
        return {
            active: '#4CCEAD',
            default: '#505050',
            inactive: '#ededed'
        };
    };
    Common.prototype.getNeedleInnerStyle = function (radius) {
        return {
            'height': radius + 20 + 'px',
            'width': radius / Common.needleWidthHeightRatio + 'px'
        };
    };
    Common.prototype.getNeedleStyle = function (radius, arcNeedlePercentage, scale) {
        if (typeof scale !== 'number') scale = 1.125;
        var deg = (arcNeedlePercentage - 50) * 3.6;
        return {
            'left': 'calc(50% - ' + radius / Common.needleWidthHeightRatio / 2 + 'px',
            'transform': 'rotate(' + deg + 'deg) scale(' + scale + ')'
        };
    };
    Common.prototype.isInRange = function (minMaxVal, sides) {
        switch (sides) {
            case interfaces_1.SideState.Both:
                {
                    return minMaxVal.min < minMaxVal.value && minMaxVal.max > minMaxVal.value;
                }
            case interfaces_1.SideState.None:
                {
                    return minMaxVal.min <= minMaxVal.value && minMaxVal.max >= minMaxVal.value;
                }
            case interfaces_1.SideState.Left:
                {
                    return minMaxVal.min < minMaxVal.value && minMaxVal.max >= minMaxVal.value;
                }
            case interfaces_1.SideState.Right:
                {
                    return minMaxVal.min <= minMaxVal.value && minMaxVal.max > minMaxVal.value;
                }
        }
    };
    Common.prototype.normalizeByPercentage = function (value, percentage, mid, max) {
        if (typeof mid === 'undefined') mid = 50;
        if (typeof max === 'undefined') max = mid * 2;
        var rel = null;
        if (value > mid) {
            percentage /= 2;
            rel = Math.abs(mid - value);
            rel = rel / mid;
            percentage *= rel;
            return value * (1 - percentage);
        } else {
            if (value == 0.0) value = 0.001;
            rel = Math.abs(value - mid);
            rel = rel / mid;
            percentage *= rel;
            return value + mid * percentage;
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
        if (current >= range.from && current <= range.to) return true;
        return false;
    };
    Common.prototype.getMinutesFromHour = function (hour) {
        var arr = hour.split(':');
        return parseInt(arr[0].trim()) * 60 + parseInt(arr[1].trim());
    };
    Common.prototype.getMinutesFromStart = function (hour, start) {
        if (start === void 0) {
            start = 0;
        }
        var arr = hour.split(':');
        return Math.max(parseInt(arr[0].trim()) * 60 + parseInt(arr[1].trim()) - start, 0);
    };
    Common.prototype.getHoursAndMinutesLT = function (date) {
        var hours = date.getHours();
        hours = (hours + 24 - 2) % 24;
        var mid = 'am';
        if (hours == 0) {
            hours = 12;
        } else if (hours > 12) {
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
        } else if (timer.minutes > 0) {
            timer.seconds = 59;
            if (--timer.minutes < 0) {
                timer.minutes = 59;
                if (--timer.hours < 0) {
                    this.setTimeToZero(timer);
                    return true;
                }
            }
        } else if (timer.hours > 0) {
            timer.minutes = 59;
            if (--timer.hours < 0) {
                this.setTimeToZero(timer);
                return true;
            }
        } else if (this.isTimeZero(timer)) {
            this.setTimeToZero(timer);
            return true;
        }
        return false;
    };
    Common.prototype.isTimeZero = function (timer) {
        if (timer.hours <= 0 && timer.minutes <= 0 && timer.seconds <= 0) return true;
        return false;
    };
    Common.prototype.padWithZiro = function (text) {
        if (String(text).length < 2) text = '0' + text;
        return text;
    };
    Common.prototype.getSideStateByString = function (state) {
        if (!state) return interfaces_1.SideState.None;
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
}();
exports.Common = Common;

},{"./interfaces":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SideState;
(function (SideState) {
    SideState[SideState["None"] = 0] = "None";
    SideState[SideState["Left"] = 1] = "Left";
    SideState[SideState["Right"] = 2] = "Right";
    SideState[SideState["Both"] = 3] = "Both";
})(SideState = exports.SideState || (exports.SideState = {}));

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var circle_1 = require("./circle");
var Spinner = /** @class */function () {
    function Spinner(element, options) {
        this.element = element;
        this.common = new common_1.Common();
        // set default options
        var defaultOptions = this.getDefaultOptions();
        // override defaults with user options
        this.options = this.common.extend(defaultOptions, options);
        if (this.options.activeDegree == 100) this.options.activeDegree = 99.9999;
        this.options.strokeWidth = this.common.fixStrokeWidth(this.options.strokeWidth);
        this.options.radius = this.common.fixRadius(this.options.radius);
        this.init();
    }
    Spinner.prototype.getDefaultOptions = function () {
        return {
            colors: this.common.getDefaultColors(),
            activeDegree: 10,
            radius: 88,
            strokeWidth: 6,
            rotationSpeed: 5000,
            animationDuration: 500,
            title: {
                text: '',
                fontWeight: 'bold'
            },
            highlight: false
        };
    };
    Spinner.prototype.update = function (options) {
        this.options = this.common.extend(this.options, options);
        if (this.options.activeDegree == 100) this.options.activeDegree = 99.9999;
        this.options.title = this.common.setInnerTextDefaults(this.options.title);
        this.updateOptions();
    };
    Spinner.prototype.updateOptions = function () {
        this.setTitle(this.options);
        this.setDiv(this.options);
        this.setCircle();
    };
    Spinner.prototype.setTitle = function (options) {
        var h4 = this.element.querySelector('h4');
        h4.style.color = options.highlight ? options.colors.active : options.colors.default;
        // h4.style.top = ((options.radius) - (options.title.fontSize / 2)) + 'px';
        h4.style.transitionDuration = options.animationDuration + 'ms';
        h4.style.fontSize = options.title.fontSize + 'ms';
        h4.style.fontFamily = options.title.fontFamily;
        h4.style.fontWeight = options.title.fontWeight;
        h4.style.letterSpacing = options.title.letterSpacing;
        h4.style.lineHeight = options.title.lineHeight + 'px';
        h4.textContent = options.title.text;
        // setTimeout(() => {
        //     let h = parseInt(getComputedStyle(h4).height.replace('px', ''));
        //     if (!isNaN(h))
        //         h4.style.top = ((options.radius) - (h / 2)) + 'px';
        // }, 10);
    };
    Spinner.prototype.setDiv = function (options) {
        var div = this.element.querySelector('div[data-spinner]');
        var dim = options.radius * 2 + 'px';
        div.style.width = dim;
        div.style.height = dim;
        div.style.transitionDuration = options.animationDuration;
    };
    Spinner.prototype.init = function () {
        this.options.title = this.common.setInnerTextDefaults(this.options.title);
        var h4 = {
            type: 'h4',
            attrs: {
                'style': "position: absolute; z-index: 10; text-align: center; width: 100%; transition-property: color; margin: 0;top: 50%;left: 0;transform: translateY(-50%);"
            }
        };
        var h4Elem = this.common.jsonToHtml(h4);
        var obj = {
            type: 'div',
            attrs: {
                'style': "position: relative;",
                'data-spinner': ''
            }
        };
        var innerElem = this.common.jsonToHtml(obj);
        this.setCircle();
        innerElem.appendChild(h4Elem);
        innerElem.appendChild(this.circle.getElement());
        this.element.appendChild(innerElem);
        this.updateOptions();
    };
    Spinner.prototype.setCircle = function () {
        this.circleOptions = this.common.extend(this.options, this.circleOptions);
        this.circleOptions.fromDegree = -this.options.activeDegree / 2;
        this.circleOptions.toDegree = this.options.activeDegree / 2;
        this.circleOptions.backgroundColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
        if (!this.circleOptions.backgroundColor) this.circleOptions.backgroundColor = '#fff';
        if (this.circle) {
            this.circle.update(this.circleOptions);
        } else this.circle = new circle_1.Circle(this.circleOptions);
    };
    return Spinner;
}();
exports.Spinner = Spinner;

},{"./circle":1,"./common":2}]},{},[4])

//# sourceMappingURL=spinner.js.map
