(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var circle_1 = require("./circle");
var needle_1 = require("./needle");
var edges_1 = require("./edges");
var AmPm = /** @class */function () {
    function AmPm(element, options) {
        this.element = element;
        this.common = new common_1.Common();
        // set default options
        var defaultOptions = this.getDefaultOptions();
        // override defaults with user options
        this.options = this.common.extend(defaultOptions, options);
        this.setMinutes();
        this.init();
    }
    AmPm.prototype.setMinutes = function () {
        var _this = this;
        var arrFrom = this.options.fromTo.from.split(':');
        var arrTo = this.options.fromTo.to.split(':');
        var fromMinutes = 0,
            toMinutes = 0,
            from = null,
            to = null;
        if (parseInt(arrFrom[0]) <= 12 || parseInt(arrTo[0]) <= 12) {
            fromMinutes = this.common.getMinutesFromHour(this.options.fromTo.from);
        }
        if (parseInt(arrFrom[0]) >= 12 || parseInt(arrTo[0]) >= 12) {
            toMinutes = this.common.getMinutesFromHour(this.options.fromTo.to);
        }
        var max = 60 * 12;
        from = this.common.getMinutesFromStart(this.options.fromTo.from, 0);
        to = this.common.getMinutesFromStart(this.options.fromTo.to, 0);
        this.minMaxValAm = {
            from: from / max * 100,
            to: Math.min(to / max * 100, 100)
        };
        from = this.common.getMinutesFromStart(this.options.fromTo.from, 60 * 12);
        to = this.common.getMinutesFromStart(this.options.fromTo.to, 60 * 12);
        this.minMaxValPm = {
            from: from / max * 100,
            to: Math.min(to / max * 100, 100)
        };
        this.lower = [];
        this.higher = [];
        this.lower.push({
            number: '00',
            isActive: this.common.isHourInRange(this.minMaxValAm, 0),
            remainder: this.common.getRemainder(this.minMaxValAm, 0)
        });
        for (var i = 1; i < 24; i++) {
            if (i < 12) {
                this.lower.push({
                    number: i.toString(),
                    isActive: this.common.isHourInRange(this.minMaxValAm, i),
                    remainder: this.common.getRemainder(this.minMaxValAm, i)
                });
            } else {
                this.higher.push({
                    number: i.toString(),
                    isActive: this.common.isHourInRange(this.minMaxValPm, i - 12),
                    remainder: this.common.getRemainder(this.minMaxValAm, i - 12)
                });
            }
        }
        this.setNeedle();
        setTimeout(function () {
            _this.setMinutes();
        }, 60000);
    };
    AmPm.prototype.setNeedle = function () {
        var now = this.common.getHoursAndMinutesLT(new Date());
        var isAm = now.indexOf('AM') > -1;
        var relevantHours = isAm ? this.lower : this.higher;
        // let diameterForNeedle = isAm ? (this.options.radius * 2) - 20 : this.options.radius * 2;
        this.needleOptions = this.common.extend(this.options.needleOptions, this.needleOptions);
        if (this.edgesOptionsAm && this.edgesOptionsPm) this.needleOptions.color = this.common.isInRange(this.options.needleOptions.minMaxVal, isAm ? this.edgesOptionsAm.hollowEdges : this.edgesOptionsPm.hollowEdges) ? this.options.colors.active : this.options.colors.default;
        if (this.options.needleOptions.minMaxVal.value > 100 || this.options.needleOptions.minMaxVal.value < 0) this.needleOptions.color = this.options.colors.inactive;
        var dateTime = new Date();
        this.needleOptions.minMaxVal.value = this.common.getPercentageByTime(dateTime);
        if (this.needleOptions.minMaxVal.value > 50) {} else {
            this.needleOptions.scale = 0.85;
        }
        this.needleOptions.minMaxVal.value /= 2;
        var index = dateTime.getHours();
        if (index > 11) index -= 12;
        if (relevantHours[index].isActive) this.needleOptions.color = this.options.colors.active;else this.needleOptions.color = this.options.colors.default;
        // for (let i = 0; i < relevantHours.length; i++) {
        //     if (relevantHours[i].isActive) {
        //         let current = (i * (100 / 12)) + relevantHours[i].remainder;
        //         if (this.needleOptions.minMaxVal.min === null)
        //             this.needleOptions.minMaxVal.min = current;
        //         this.needleOptions.minMaxVal.max = current;
        //     }
        // }
        if (this.needle) this.needle.update(this.needleOptions);else this.needle = new needle_1.Needle(this.needleOptions);
        // this.needle = {
        //     minMaxVal: {
        //         min: null,
        //         max: null,
        //         value: this.piService.getCurrentTimePercentage()
        //     },
        //     color: null
        // };
        // this.needleStyleInner = this.common.getNeedleInnerStyle(this.diameter);
        // this.needleStyle = this.piService.getStyleByPercentage(this.diameter, this.niddle.minMaxVal.value, isAm);
        // this.needle.color = this.piService.getColor(this.niddle);
    };
    // initNumbers(numbers: Array<NumberData>) {
    //     numbers.push({
    //         number: '00',
    //         isActive: this.common.isHourInRange(this.minMaxValAm, 0),
    //         remainder: this.common.getRemainder(this.minMaxValAm, 0)
    //     });
    //     numbers.push({
    //     });
    //     // this.amNumbers.
    // }
    AmPm.prototype.init = function () {
        // this.amNumbers = [];
        // this.initNumbers(this.amNumbers);
        var innerElem = this.common.jsonToHtml({
            type: 'div',
            attrs: {
                'style': 'position: relative;',
                'data-ampm': ''
            },
            children: [{
                type: 'div',
                attrs: {
                    'data-am-wrap': '',
                    'style': 'position: absolute'
                }
            }, {
                type: 'div',
                attrs: {
                    'data-pm-wrap': '',
                    'style': 'position: absolute'
                }
            }, {
                type: 'div',
                attrs: {
                    'data-needle-wrap': '',
                    'style': 'position: absolute'
                }
            }]
        });
        var amWrap = {
            type: 'div',
            attrs: {
                style: 'position: absolute;height: 60px;top: 65px;left: 105px;color: #CBCBCB;font-size: 16px;z-index: 30',
                'data-am-numbers': ''
            },
            children: []
        };
        for (var i = 0; i < this.lower.length; i++) {
            amWrap.children.push({
                type: 'span',
                attrs: {
                    'style': "height: 100%;position: absolute;width: 20px;left: 0;top: 0;transform-origin: bottom center;text-align: center;transform: rotate(" + i * 30 + "deg);",
                    'data-num': i
                },
                children: [{
                    type: 'span',
                    attrs: {
                        'style': "transform: rotate(-" + i * 30 + "deg);display: block;"
                    },
                    children: [{
                        type: '#text',
                        text: this.lower[i].number
                    }]
                }]
            });
        }
        var pmWrap = {
            type: 'div',
            attrs: {
                style: 'position: absolute;height: 110px;color: #CBCBCB;font-size: 16px;',
                'data-pm-numbers': ''
            },
            children: []
        };
        for (var i = 0; i < this.higher.length; i++) {
            pmWrap.children.push({
                type: 'span',
                attrs: {
                    'style': "height: 100%;position: absolute;width: 20px;left: 0;top: 0;transform-origin: bottom center;text-align: center;transform: rotate(" + i * 30 + "deg);",
                    'data-num': i
                },
                children: [{
                    type: 'span',
                    attrs: {
                        'style': "transform: rotate(-" + i * 30 + "deg);display: block;"
                    },
                    children: [{
                        type: '#text',
                        text: this.higher[i].number
                    }]
                }]
            });
        }
        this.updateOptions(false);
        innerElem.querySelector('[data-am-wrap]').appendChild(this.common.jsonToHtml(amWrap));
        innerElem.querySelector('[data-am-wrap]').appendChild(this.circleAm.getElement());
        innerElem.querySelector('[data-am-wrap]').appendChild(this.edgesAm.getLeftElement());
        innerElem.querySelector('[data-am-wrap]').appendChild(this.edgesAm.getRightElement());
        innerElem.querySelector('[data-pm-wrap]').appendChild(this.common.jsonToHtml(pmWrap));
        innerElem.querySelector('[data-pm-wrap]').appendChild(this.circlePm.getElement());
        innerElem.querySelector('[data-pm-wrap]').appendChild(this.edgesPm.getLeftElement());
        innerElem.querySelector('[data-pm-wrap]').appendChild(this.edgesPm.getRightElement());
        innerElem.querySelector('[data-needle-wrap]').appendChild(this.needle.getElement());
        this.element.appendChild(innerElem);
        this.updateOptions(true);
    };
    AmPm.prototype.setNumbers = function () {
        var pmNumbers = this.element.querySelector('[data-pm-numbers]');
        if (!pmNumbers) return;
        pmNumbers.style.left = this.options.radius * 2 / 1.67 - 30 + 'px';
        pmNumbers.style.top = '-20px';
    };
    AmPm.prototype.setCircles = function () {
        var _this = this;
        var setCircle = function setCircle(prefix) {
            _this['circleOptions' + prefix] = _this.common.extend(_this.options, _this['circleOptions' + prefix], true);
            _this['circleOptions' + prefix].indent = 0;
            _this['circleOptions' + prefix].fromDegree = _this['minMaxVal' + prefix].from;
            _this['circleOptions' + prefix].toDegree = _this['minMaxVal' + prefix].to;
            // this['circleOptions' + prefix].fromDegree = this.options.needleOptions.minMaxVal.min;
            // this['circleOptions' + prefix].toDegree = this.options.needleOptions.minMaxVal.max;
            _this['circleOptions' + prefix].backgroundColor = _this.common.getComputedStyleByParentRec(_this.element, 'backgroundColor');
            if (!_this['circleOptions' + prefix].backgroundColor) _this['circleOptions' + prefix].backgroundColor = '#fff';
            if (prefix == 'Am') _this['circleOptions' + prefix].radius = _this.options.radius - _this.options.strokeWidth;
            if (_this['circle' + prefix]) {
                _this['circle' + prefix].update(_this['circleOptions' + prefix]);
            } else _this['circle' + prefix] = new circle_1.Circle(_this['circleOptions' + prefix]);
        };
        setCircle('Am');
        setCircle('Pm');
    };
    AmPm.prototype.setEdges = function () {
        var _this = this;
        var setEdge = function setEdge(prefix) {
            _this['edgesOptions' + prefix] = _this.common.extend(_this.options.needleOptions, _this['edgesOptions' + prefix], true);
            _this['edgesOptions' + prefix].strokeWidth = _this.options.strokeWidth;
            _this['edgesOptions' + prefix].color = _this.options.colors.active;
            _this['edgesOptions' + prefix].hollowEdges = _this.options['hollowEdges' + +prefix];
            _this['edgesOptions' + prefix].minMaxVal = {
                min: _this['minMaxVal' + prefix].from,
                max: _this['minMaxVal' + prefix].to
            };
            _this['edgesOptions' + prefix].indent = 0;
            if (_this['edges' + prefix]) _this['edges' + prefix].update(_this['edgesOptions' + prefix]);else _this['edges' + prefix] = new edges_1.Edges(_this['edgesOptions' + prefix]);
            var allEdges = _this.element.querySelectorAll('[data-' + prefix + '-wrap] [data-left-edge],[data-' + prefix + '-wrap] [data-right-edge]');
            if (allEdges.length) {
                var disp = 'inline-block';
                if (!_this.options['showEdges' + prefix]) disp = 'none';
                for (var i = 0; i < allEdges.length; i++) {
                    allEdges[i].style.display = disp;
                }
            }
        };
        setEdge('Am');
        setEdge('Pm');
    };
    AmPm.prototype.update = function (options) {
        this.options = this.common.extend(this.options, options);
        this.updateOptions(true);
    };
    AmPm.prototype.updateOptions = function (setWrap) {
        if (setWrap) this.setWrap(this.options);
        this.setCircles();
        this.setNeedle();
        this.setNumbers();
        this.setEdges();
        this.setNeedle();
    };
    AmPm.prototype.setWrap = function (options) {
        var wrap = this.element;
        var dim = options.radius * 2 + 'px';
        wrap.style.width = dim;
        wrap.style.height = dim;
        wrap.style.position = 'relative';
        var topLeftDim = options.radius / 3.5 + 'px';
        var amWrap = wrap.querySelector('[data-am-wrap]');
        amWrap.style.top = options.radius / 3.5 + options.strokeWidth * 2 + 'px';
        amWrap.style.left = options.radius / 3.5 + options.strokeWidth * 2 + 'px';
        amWrap.style.zIndex = '20';
        // let amCircle = amWrap.querySelector('[data-circle]')
        var amNumbers = amWrap.querySelector('[data-am-numbers');
        amNumbers.style.top = options.strokeWidth * 3 + 'px';
        amNumbers.style.left = options.radius - options.strokeWidth * 3 + 'px';
        var pmWrap = wrap.querySelector('[data-pm-wrap]');
        // let pmCircle = pmWrap.querySelector('[data-circle]')
        pmWrap.style.top = topLeftDim;
        pmWrap.style.left = topLeftDim;
        var nWrap = wrap.querySelector('[data-needle-wrap]');
        nWrap.style.top = topLeftDim;
        nWrap.style.left = options.radius / 3.5 + options.radius + 'px';
    };
    AmPm.prototype.getDefaultOptions = function () {
        var animationDuration = 500,
            radius = 88;
        var colors = this.common.getDefaultColors();
        return {
            fromTo: {
                from: '0:0',
                to: '23:60'
            },
            radius: radius,
            colors: colors,
            strokeWidth: 6,
            animationDuration: animationDuration,
            needleOptions: {
                animationDuration: animationDuration,
                color: colors.active,
                radius: radius,
                scale: 1.125,
                minMaxVal: {
                    max: 3,
                    min: 14,
                    value: 14
                }
            }
        };
    };
    return AmPm;
}();
exports.AmPm = AmPm;

},{"./circle":2,"./common":3,"./edges":4,"./needle":6}],2:[function(require,module,exports){
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
        if (typeof this.options.indent === 'undefined') this.options.indent = 50;
        this.updateOptions();
    };
    Circle.prototype.updateOptions = function () {
        this.setSvg(this.options);
        this.setElements(this.options);
    };
    Circle.prototype.setSvg = function (options) {
        if (options.toDegree - options.fromDegree == 100) options.toDegree -= 0.0001;
        var startAngle = (options.fromDegree - this.options.indent) * 3.6,
            endAngle = (options.toDegree - this.options.indent) * 3.6;
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
        if (d.indexOf('NaN') == -1) path.setAttributeNS(null, 'd', d);
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

},{"./common":3}],3:[function(require,module,exports){
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
    Common.prototype.getNeedleStyle = function (radius, arcNeedlePercentage, scale, indent) {
        if (indent === void 0) {
            indent = 50;
        }
        if (typeof scale !== 'number') scale = 1.125;
        var deg = (arcNeedlePercentage - indent) * 3.6;
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

},{"./interfaces":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("./interfaces");
var common_1 = require("./common");
var Edges = /** @class */function () {
    function Edges(options) {
        this.options = options;
        this.common = new common_1.Common();
        var defaultOptions = this.getDefaultOptions();
        this.options = this.common.extend(defaultOptions, options);
        this.init();
    }
    Edges.prototype.getDefaultOptions = function () {
        var colors = this.common.getDefaultColors();
        var defRadius = 88,
            animationDuration = 500;
        return {
            color: colors.active,
            minMaxVal: {
                min: 30,
                max: 70,
                value: 55
            },
            radius: defRadius,
            strokeWidth: 6,
            animationDuration: animationDuration,
            hollowEdges: interfaces_1.SideState.None,
            backgroundColor: '#ffffff',
            indent: 50
        };
    };
    Edges.prototype.init = function () {
        this.leftElement = this.common.jsonToHtml({
            type: 'span',
            attrs: {
                'style': "display: inline-block;width: " + Edges.AddToEdge + "px;position: absolute;z-index: 5;box-sizing: initial;box-sizing: border-box;transition-property: background-color;",
                'data-left-edge': ''
            }
        });
        this.rightElement = this.common.jsonToHtml({
            type: 'span',
            attrs: {
                'style': "display: inline-block;width: " + Edges.AddToEdge + "px;position: absolute;z-index: 5;box-sizing: initial;box-sizing: border-box;transition-property: background-color;",
                'data-right-edge': ''
            }
        });
        this.updateOptions();
    };
    Edges.prototype.update = function (options) {
        this.options = this.common.extend(this.options, options);
        this.updateOptions();
    };
    Edges.prototype.updateOptions = function () {
        this.setSpans(this.options);
    };
    Edges.prototype.setSpans = function (options) {
        var height = options.strokeWidth + Edges.AddToEdge + Edges.AddToEdgeHeight + 'px';
        var top = 'calc(50% - ' + (options.strokeWidth / 2 + Edges.AddToEdge / 2 + Edges.AddToEdgeHeight / 2) + 'px)';
        var leftStyle = 'calc(50% - ' + Edges.AddToEdge / 2 + 'px)';
        // let bgColor = this.common.getComputedStyleByParentRec(this.leftElement, 'backgroundColor');
        // if (!bgColor)
        var bgColor = this.options.backgroundColor;
        var left = this.leftElement;
        left.style.height = height;
        left.style.top = top;
        left.style.left = leftStyle;
        left.style.backgroundColor = options.color;
        left.style.transitionDuration = options.animationDuration + 'ms';
        // left.style.transitionDuration = '0ms';
        if (options.hollowEdges == interfaces_1.SideState.Left || options.hollowEdges == interfaces_1.SideState.Both) {
            left.style.border = 'solid 1px ' + options.color;
            left.style.backgroundColor = bgColor;
            // left.style.height = (options.strokeWidth + (Edges.AddToEdge * 2 - 2)) + 'px';
            // left.style.top = 'calc(50% - ' + ((options.strokeWidth / 2) + Edges.AddToEdge + 1) + 'px)';
        }
        var right = this.rightElement;
        right.style.height = height;
        right.style.top = top;
        right.style.left = leftStyle;
        right.style.backgroundColor = options.color;
        right.style.transitionDuration = options.animationDuration + 'ms';
        // right.style.transitionDuration = '0ms';
        if (options.hollowEdges == interfaces_1.SideState.Right || options.hollowEdges == interfaces_1.SideState.Both) {
            right.style.border = 'solid 1px ' + options.color;
            right.style.backgroundColor = bgColor;
            // right.style.height = (options.strokeWidth + (Edges.AddToEdge * 2 - 2)) + 'px';
            // right.style.top = 'calc(50% - ' + ((options.strokeWidth / 2) + Edges.AddToEdge + 1) + 'px)';
        }
        var scalar = options.radius - options.strokeWidth / 2,
            xVectorLeft,
            yVectorLeft,
            xVectorRight,
            yVectorRight;
        var degLeft = (options.minMaxVal.min - this.options.indent) * 3.6;
        var degRight = (options.minMaxVal.max - this.options.indent) * 3.6;
        xVectorLeft = Math.sin(degLeft * (Math.PI / 180)) * scalar;
        yVectorLeft = -Math.cos(degLeft * (Math.PI / 180)) * scalar;
        left.style.transform = "translate3d(" + xVectorLeft + "px, " + yVectorLeft + "px, 0) rotate(" + degLeft + "deg)";
        xVectorRight = Math.sin(degRight * (Math.PI / 180)) * scalar;
        yVectorRight = -Math.cos(degRight * (Math.PI / 180)) * scalar;
        right.style.transform = "translate3d(" + xVectorRight + "px, " + yVectorRight + "px, 0) rotate(" + degRight + "deg)";
    };
    Edges.prototype.getLeftElement = function () {
        return this.leftElement;
    };
    Edges.prototype.getRightElement = function () {
        return this.rightElement;
    };
    Edges.AddToEdge = 4;
    Edges.AddToEdgeHeight = 4;
    return Edges;
}();
exports.Edges = Edges;

},{"./common":3,"./interfaces":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SideState;
(function (SideState) {
    SideState[SideState["None"] = 0] = "None";
    SideState[SideState["Left"] = 1] = "Left";
    SideState[SideState["Right"] = 2] = "Right";
    SideState[SideState["Both"] = 3] = "Both";
})(SideState = exports.SideState || (exports.SideState = {}));

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("./common");
var Needle = /** @class */function () {
    function Needle(options) {
        this.options = options;
        this.common = new common_1.Common();
        this.options = options;
        this.init();
    }
    Needle.prototype.init = function () {
        this.element = this.common.jsonToHtml({
            type: 'div',
            attrs: {
                'style': 'position: absolute;z-index: 40;transform-origin: 50% 85%;transform: scale(1.125);transition-duration: .5s; top: -4px;',
                'data-needle': ''
            },
            children: [{
                type: 'svg',
                attrs: {
                    'version': '1.1',
                    // 'xmlns': 'http://www.w3.org/2000/svg',
                    // 'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                    'x': '0px',
                    'y': '0px',
                    'viewBox': '0 0 11.5 103.8',
                    // 'xml:space': 'preserve',
                    'style': "enable-background:new 0 0 11.5 103.8;position: relative; margin: auto; display: block;"
                },
                children: [{
                    type: 'g',
                    children: [{
                        type: 'path',
                        attrs: {
                            'd': 'M10.4,95.6c-0.4-0.9-1-1.6-1.7-2.1L5.7,1.3L2.8,93.5c-1.9,1.3-2.6,3.8-1.7,6c1.1,2.5,4,3.8,6.6,2.7C10.2,101.1,11.4,98.2,10.4,95.6z'
                        }
                    }]
                }]
            }]
        });
        this.updateOptions();
    };
    Needle.prototype.update = function (options) {
        this.options = this.common.extend(this.options, options);
        this.updateOptions();
    };
    Needle.prototype.updateOptions = function () {
        this.setDiv(this.options);
        this.setSvg(this.options);
    };
    Needle.prototype.setDiv = function (options) {
        var div = this.element;
        var divStyle = this.common.getNeedleStyle(options.radius, options.minMaxVal.value, options.scale, options.indent);
        div.style.left = divStyle.left;
        div.style.transform = divStyle.transform;
        div.style.transitionDuration = options.animationDuration + 'ms';
    };
    Needle.prototype.getElement = function () {
        return this.element;
    };
    Needle.prototype.setSvg = function (options) {
        var svg = this.element.querySelector('svg');
        var svgStyle = this.common.getNeedleInnerStyle(options.radius);
        svg.style.width = svgStyle.width;
        svg.style.height = svgStyle.height;
        // try {
        //     svg.setAttributeNS('http://www.w3.org/2000/svg', 'xmlns', window.location.host);
        //     svg.setAttributeNS('http://www.w3.org/1999/xlink', 'xmlns:xlink', window.location.host);
        //     svg.setAttributeNS('http://www.w3.org/2000/svg', 'xml:space', 'preserve');
        // }
        // catch (e) {
        //     // console.log(e);
        // }
        var path = svg.querySelector('path');
        path.setAttributeNS(null, 'fill', options.color);
        path.style.transitionDuration = options.animationDuration + 'ms';
    };
    return Needle;
}();
exports.Needle = Needle;

},{"./common":3}]},{},[1])

//# sourceMappingURL=ampm.js.map
