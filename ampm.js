"use strict";
exports.__esModule = true;
var common_1 = require("./common");
var circle_1 = require("./circle");
var needle_1 = require("./needle");
var edges_1 = require("./edges");
var AmPm = /** @class */ (function () {
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
        var fromMinutes = 0, toMinutes = 0, from = null, to = null;
        if (parseInt(arrFrom[0]) <= 12 || parseInt(arrTo[0]) <= 12) {
            fromMinutes = this.common.getMinutesFromHour(this.options.fromTo.from);
        }
        if (parseInt(arrFrom[0]) >= 12 || parseInt(arrTo[0]) >= 12) {
            toMinutes = this.common.getMinutesFromHour(this.options.fromTo.to);
        }
        console.log('fromMinutes: ' + fromMinutes);
        console.log('toMinutes: ' + toMinutes);
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
            }
            else {
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
        if (this.edgesOptionsAm && this.edgesOptionsPm)
            this.needleOptions.color = this.common.isInRange(this.options.needleOptions.minMaxVal, (isAm ? this.edgesOptionsAm.hollowEdges : this.edgesOptionsPm.hollowEdges)) ? this.options.colors.active : this.options.colors["default"];
        if (this.options.needleOptions.minMaxVal.value > 100 || this.options.needleOptions.minMaxVal.value < 0)
            this.needleOptions.color = this.options.colors.inactive;
        for (var i = 0; i < relevantHours.length; i++) {
            if (relevantHours[i].isActive) {
                var current = (i * (100 / 12)) + relevantHours[i].remainder;
                if (this.needleOptions.minMaxVal.min === null)
                    this.needleOptions.minMaxVal.min = current;
                this.needleOptions.minMaxVal.max = current;
            }
        }
        if (this.needle)
            this.needle.update(this.needleOptions);
        else
            this.needle = new needle_1.Needle(this.needleOptions);
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
            children: [
                {
                    type: 'div',
                    attrs: {
                        'data-am-wrap': '',
                        'style': 'position: absolute'
                    }
                },
                {
                    type: 'div',
                    attrs: {
                        'data-pm-wrap': '',
                        'style': 'position: absolute'
                    }
                },
                {
                    type: 'div',
                    attrs: {
                        'data-needle-wrap': '',
                        'style': 'position: absolute'
                    }
                }
            ]
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
                children: [
                    {
                        type: 'span',
                        attrs: {
                            'style': "transform: rotate(-" + i * 30 + "deg);display: block;"
                        },
                        children: [
                            {
                                type: '#text',
                                text: this.lower[i].number
                            }
                        ]
                    }
                ]
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
                children: [
                    {
                        type: 'span',
                        attrs: {
                            'style': "transform: rotate(-" + i * 30 + "deg);display: block;"
                        },
                        children: [
                            {
                                type: '#text',
                                text: this.higher[i].number
                            }
                        ]
                    }
                ]
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
        if (!pmNumbers)
            return;
        pmNumbers.style.left = (((this.options.radius * 2) / 1.67) - 30) + 'px';
        pmNumbers.style.top = '-20px';
    };
    AmPm.prototype.setCircles = function () {
        var _this = this;
        var setCircle = function (prefix) {
            _this['circleOptions' + prefix] = _this.common.extend(_this.options, _this['circleOptions' + prefix], true);
            _this['circleOptions' + prefix].indent = 0;
            _this['circleOptions' + prefix].fromDegree = _this['minMaxVal' + prefix].from;
            _this['circleOptions' + prefix].toDegree = _this['minMaxVal' + prefix].to;
            // this['circleOptions' + prefix].fromDegree = this.options.needleOptions.minMaxVal.min;
            // this['circleOptions' + prefix].toDegree = this.options.needleOptions.minMaxVal.max;
            _this['circleOptions' + prefix].backgroundColor = _this.common.getComputedStyleByParentRec(_this.element, 'backgroundColor');
            if (!_this['circleOptions' + prefix].backgroundColor)
                _this['circleOptions' + prefix].backgroundColor = '#fff';
            if (prefix == 'Am')
                _this['circleOptions' + prefix].radius = _this.options.radius - (_this.options.strokeWidth);
            if (_this['circle' + prefix]) {
                _this['circle' + prefix].update(_this['circleOptions' + prefix]);
            }
            else
                _this['circle' + prefix] = new circle_1.Circle(_this['circleOptions' + prefix]);
        };
        setCircle('Am');
        setCircle('Pm');
    };
    AmPm.prototype.setEdges = function () {
        var _this = this;
        var setEdge = function (prefix) {
            _this['edgesOptions' + prefix] = _this.common.extend(_this.options.needleOptions, _this['edgesOptions' + prefix], true);
            _this['edgesOptions' + prefix].strokeWidth = _this.options.strokeWidth;
            _this['edgesOptions' + prefix].color = _this.options.colors.active;
            _this['edgesOptions' + prefix].hollowEdges = _this.options['hollowEdges' + +prefix];
            _this['edgesOptions' + prefix].minMaxVal = {
                min: _this['minMaxVal' + prefix].from,
                max: _this['minMaxVal' + prefix].to
            };
            _this['edgesOptions' + prefix].indent = 0;
            if (_this['edges' + prefix])
                _this['edges' + prefix].update(_this['edgesOptions' + prefix]);
            else
                _this['edges' + prefix] = new edges_1.Edges(_this['edgesOptions' + prefix]);
            var allEdges = _this.element.querySelectorAll('[data-' + prefix + '-wrap] [data-left-edge],[data-' + prefix + '-wrap] [data-right-edge]');
            if (allEdges.length) {
                var disp = 'inline-block';
                if (!_this.options['showEdges' + prefix])
                    disp = 'none';
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
        if (setWrap)
            this.setWrap(this.options);
        this.setCircles();
        this.setNeedle();
        this.setNumbers();
        this.setEdges();
        this.setNeedle();
    };
    AmPm.prototype.setWrap = function (options) {
        var wrap = this.element;
        var dim = (options.radius * 2) + 'px';
        wrap.style.width = dim;
        wrap.style.height = dim;
        wrap.style.position = 'relative';
        var topLeftDim = (options.radius / 3.5) + 'px';
        var amWrap = wrap.querySelector('[data-am-wrap]');
        amWrap.style.top = ((options.radius / 3.5) + (options.strokeWidth * 2)) + 'px';
        amWrap.style.left = ((options.radius / 3.5) + (options.strokeWidth * 2)) + 'px';
        amWrap.style.zIndex = '20';
        // let amCircle = amWrap.querySelector('[data-circle]')
        var amNumbers = amWrap.querySelector('[data-am-numbers');
        amNumbers.style.top = (options.strokeWidth * 3) + 'px';
        amNumbers.style.left = (options.radius - options.strokeWidth * 3) + 'px';
        var pmWrap = wrap.querySelector('[data-pm-wrap]');
        // let pmCircle = pmWrap.querySelector('[data-circle]')
        pmWrap.style.top = topLeftDim;
        pmWrap.style.left = topLeftDim;
        var nWrap = wrap.querySelector('[data-needle-wrap]');
        nWrap.style.top = topLeftDim;
        nWrap.style.left = ((options.radius / 3.5) + options.radius) + 'px';
    };
    AmPm.prototype.getDefaultOptions = function () {
        var animationDuration = 500, radius = 88;
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
}());
exports.AmPm = AmPm;
