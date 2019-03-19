"use strict";
exports.__esModule = true;
var common_1 = require("./common");
var circle_1 = require("./circle");
var edges_1 = require("./edges");
var Timer = /** @class */ (function () {
    function Timer(element, options) {
        this.isRunning = true;
        this.element = element;
        this.common = new common_1.Common();
        // set default options
        var defaultOptions = this.getDefaultOptions();
        // override defaults with user options
        this.options = this.common.extend(defaultOptions, options);
        this.options.title = this.common.setInnerTextDefaults(this.options.title);
        this.fixOptions();
        this.init();
    }
    Timer.prototype.fixOptions = function () {
        this.options.strokeWidth = this.common.fixStrokeWidth(this.options.strokeWidth);
        this.options.radius = this.common.fixRadius(this.options.radius);
        if (typeof this.options.percentage === 'number') {
            if (this.options.percentage > 100)
                this.options.percentage = 100;
            else if (this.options.percentage < 0)
                this.options.percentage = 0;
        }
    };
    Timer.prototype.init = function () {
        var _this = this;
        var currentSeconds = this.common.getSecondsFromTime(this.options.time);
        this.fullSeconds = currentSeconds * 100 / this.options.percentage;
        var h4 = {
            type: 'h4',
            attrs: {
                'style': 'position: absolute;z-index: 10;text-align: center;width: 100%;top: 50%;transform: translateY(-50%);transition-property: color;left: 0; margin: 0;'
            },
            children: [
                {
                    type: 'div',
                    attrs: {
                        'data-clock': ''
                    },
                    children: [
                        {
                            type: 'span',
                            attrs: {
                                'data-number': ''
                            }
                        },
                        {
                            type: 'span',
                            children: [
                                {
                                    type: '#text',
                                    text: ':'
                                }
                            ]
                        },
                        {
                            type: 'span',
                            attrs: {
                                'data-number': ''
                            }
                        },
                        {
                            type: 'span',
                            children: [
                                {
                                    type: '#text',
                                    text: ':'
                                }
                            ]
                        },
                        {
                            type: 'span',
                            attrs: {
                                'data-number': ''
                            }
                        }
                    ]
                },
                {
                    type: 'div',
                    attrs: {
                        'data-text': ''
                    }
                }
            ]
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
        this.updateOptions(false);
        innerElem.appendChild(h4Elem);
        innerElem.appendChild(this.circle.getElement());
        innerElem.appendChild(this.edges.getLeftElement());
        innerElem.appendChild(this.edges.getRightElement());
        this.element.appendChild(innerElem);
        this.updateOptions(true);
        setTimeout(function () {
            _this.updateTimer();
        }, 1000);
    };
    Timer.prototype.update = function (options) {
        this.options = this.common.extend(this.options, options);
        this.fixOptions();
        this.updatePercentage();
        this.updateOptions(true);
    };
    Timer.prototype.updatePercentage = function () {
        this.options.percentage = this.common.getSecondsFromTime(this.options.time) / this.fullSeconds * 100;
        if (isNaN(this.options.percentage) || this.options.percentage < 0)
            this.options.percentage = 0;
    };
    Timer.prototype.updateTimer = function () {
        var _this = this;
        if (!this.isRunning)
            return;
        this.updatePercentage();
        if (this.common.decreaseTime(this.options.time)) {
            // TODO time is up!
            // this.status = 'Time is up!';
            // return this.mode = '';
        }
        else if (this.element.parentElement) {
            setTimeout(function () {
                _this.updateTimer();
            }, 1000);
        }
        this.updateOptions(true);
    };
    Timer.prototype.updateOptions = function (setWrap) {
        if (setWrap) {
            this.setWrap(this.options);
            this.setTitle(this.options);
        }
        this.setCircle();
        this.setEdges();
    };
    Timer.prototype.setEdges = function () {
        this.edgesOptions = this.common.extend(this.options, this.edgesOptions);
        this.edgesOptions.minMaxVal = {
            min: this.circleOptions.fromDegree,
            max: this.circleOptions.toDegree,
            value: this.options.percentage
        };
        this.edgesOptions.strokeWidth = this.options.strokeWidth;
        this.edgesOptions.color = this.options.colors.active;
        if (this.edges)
            this.edges.update(this.edgesOptions);
        else
            this.edges = new edges_1.Edges(this.edgesOptions);
        var left = this.element.querySelector('[data-left-edge]');
        var right = this.element.querySelector('[data-right-edge]');
        if (left && right) {
            if (!this.options.showEdges) {
                left.style.display = 'none';
                right.style.display = 'none';
            }
            else {
                left.style.display = 'inline-block';
                right.style.display = 'inline-block';
            }
        }
    };
    Timer.prototype.setWrap = function (options) {
        var wrap = this.element;
        var dim = (options.radius * 2) + 'px';
        wrap.style.width = dim;
        wrap.style.height = dim;
        wrap.style.position = 'relative';
    };
    Timer.prototype.setTitle = function (options) {
        var h4 = this.element.querySelector('h4');
        h4.style.color = options.percentage == 0 ? options.colors.active : options.colors["default"];
        // h4.style.top = ((options.radius) - (options.title.fontSize / 2)) + 'px';
        h4.style.top = '50%';
        h4.style.transitionDuration = options.animationDuration + 'ms';
        h4.style.fontSize = options.title.fontSize + 'ms';
        h4.style.fontFamily = options.title.fontFamily;
        h4.style.fontWeight = options.title.fontWeight;
        h4.style.letterSpacing = options.title.letterSpacing;
        h4.style.lineHeight = options.title.lineHeight + 'px';
        var spans = h4.querySelectorAll('[data-clock] span[data-number]');
        spans.forEach(function (element) {
            element.style.color = options.colors["default"];
        });
        if (options.percentage > 0) {
            h4.querySelector('[data-clock]').style.display = 'block';
            spans[0].textContent = this.common.padWithZiro(options.time.hours.toString());
            spans[1].textContent = this.common.padWithZiro(options.time.minutes.toString());
            spans[2].textContent = this.common.padWithZiro(options.time.seconds.toString());
            h4.querySelector('[data-text]').textContent = '';
        }
        else {
            h4.querySelector('[data-clock]').style.display = 'none';
            h4.querySelector('[data-text]').textContent = options.title.text;
        }
        // setTimeout(() => {
        //     let h = parseInt(getComputedStyle(h4).height.replace('px', ''));
        //     if (!isNaN(h))
        //         h4.style.top = ((options.radius) - (h / 2)) + 'px';
        // }, 10);
    };
    Timer.prototype.getDefaultOptions = function () {
        return {
            colors: this.common.getDefaultColors(),
            radius: 88,
            strokeWidth: 6,
            animationDuration: 500,
            title: {
                text: 'time is up!',
                fontSize: 18,
                fontWeight: 'bold',
                letterSpacing: '1px'
            },
            time: {
                hours: 3,
                minutes: 24,
                seconds: 42
            },
            percentage: 100,
            showEdges: true
        };
    };
    Timer.prototype.setCircle = function () {
        this.circleOptions = this.common.extend(this.options, this.circleOptions);
        this.circleOptions.fromDegree = 50;
        this.circleOptions.toDegree = this.options.percentage + 50;
        this.circleOptions.backgroundColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
        if (!this.circleOptions.backgroundColor)
            this.circleOptions.backgroundColor = '#fff';
        if (this.circle)
            this.circle.update(this.circleOptions);
        else
            this.circle = new circle_1.Circle(this.circleOptions);
    };
    Timer.prototype.pause = function () {
        this.isRunning = false;
    };
    Timer.prototype.play = function () {
        this.isRunning = true;
    };
    return Timer;
}());
exports.Timer = Timer;
