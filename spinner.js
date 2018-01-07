"use strict";
exports.__esModule = true;
var common_1 = require("./common");
var circle_1 = require("./circle");
var Spinner = /** @class */ (function () {
    function Spinner(element, options) {
        this.element = element;
        this.common = new common_1.Common();
        // set default options
        var defaultOptions = this.getDefaultOptions();
        // override defaults with user options
        this.options = this.common.extend(defaultOptions, options);
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
        h4.style.color = options.highlight ? options.colors.active : options.colors["default"];
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
        if (!this.circleOptions.backgroundColor)
            this.circleOptions.backgroundColor = '#fff';
        if (this.circle) {
            this.circle.update(this.circleOptions);
        }
        else
            this.circle = new circle_1.Circle(this.circleOptions);
    };
    return Spinner;
}());
exports.Spinner = Spinner;
