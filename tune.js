"use strict";
exports.__esModule = true;
var interfaces_1 = require("./interfaces");
var common_1 = require("./common");
var circle_1 = require("./circle");
var needle_1 = require("./needle");
var edges_1 = require("./edges");
var icon_1 = require("./icon");
var Tune = /** @class */ (function () {
    function Tune(element, options) {
        this.element = element;
        this.common = new common_1.Common();
        // set default options
        var defaultOptions = this.getDefaultOptions();
        // override defaults with user options
        this.options = this.common.extend(defaultOptions, options);
        this.fixOptions();
        this.init();
    }
    Tune.prototype.fixOptions = function () {
        // this.options.title = this.common.setInnerTextDefaults(this.options.title);
        this.options.strokeWidth = this.common.fixStrokeWidth(this.options.strokeWidth);
        this.options.radius = this.common.fixRadius(this.options.radius);
        // if we're hiding bottom we should take thoes values in to considuration
        if (this.options.hideBottom) {
            var portionToHide = 0.3334;
            this.options.needleOptions.minMaxVal.max = this.common.normalizeByPercentage(this.options.needleOptions.minMaxVal.max, portionToHide);
            this.options.needleOptions.minMaxVal.min = this.common.normalizeByPercentage(this.options.needleOptions.minMaxVal.min, portionToHide);
            this.options.needleOptions.minMaxVal.value = this.common.normalizeByPercentage(this.options.needleOptions.minMaxVal.value, portionToHide);
            if (this.options.iconOptions && typeof this.options.iconOptions.degree === 'number')
                this.options.iconOptions.degree = this.common.normalizeByPercentage(this.options.iconOptions.degree, portionToHide);
        }
    };
    Tune.prototype.init = function () {
        var obj = {
            type: 'div',
            attrs: {
                'data-tune': ''
            }
        };
        var innerElem = this.common.jsonToHtml(obj);
        this.updateOptions(false);
        innerElem.appendChild(this.circle.getElement());
        innerElem.appendChild(this.needle.getElement());
        innerElem.appendChild(this.edges.getLeftElement());
        innerElem.appendChild(this.edges.getRightElement());
        innerElem.appendChild(this.icon.getElement());
        this.element.appendChild(innerElem);
        this.updateOptions(true);
    };
    Tune.prototype.update = function (options) {
        this.options = this.common.extend(this.options, options);
        this.fixOptions();
        this.updateOptions(true);
    };
    Tune.prototype.updateOptions = function (setWrap) {
        if (setWrap)
            this.setWrap(this.options);
        this.setCircle();
        this.setNeedle();
        this.setEdges();
        this.setIcon();
    };
    Tune.prototype.setWrap = function (options) {
        var wrap = this.element;
        var dim = (options.radius * 2) + 'px';
        wrap.style.width = dim;
        wrap.style.height = dim;
        wrap.style.position = 'relative';
    };
    Tune.prototype.getDefaultOptions = function () {
        var colors = this.common.getDefaultColors();
        var defRadius = 88, animationDuration = 500;
        return {
            needleOptions: {
                minMaxVal: {
                    min: 30,
                    max: 70,
                    value: 55
                },
                color: colors.active,
                scale: 1.125,
                radius: defRadius,
                animationDuration: animationDuration,
                disabled: false
            },
            iconOptions: {
                animationDuration: animationDuration,
                degree: 50,
                radius: defRadius,
                radiusOffset: 0,
                src: '',
                dimensions: {
                    width: 25,
                    height: 25
                },
                top: 0,
                left: 0,
                opacity: 1
            },
            colors: colors,
            strokeWidth: 6,
            animationDuration: animationDuration,
            radius: defRadius,
            showEdges: true,
            showIcon: true,
            hollowEdges: interfaces_1.SideState.None,
            // title: this.common.setInnerTextDefaults(),
            hideBottom: true,
            backgroundColor: '#ffffff',
            hollowEdgesBgColor: '#ffffff'
        };
    };
    Tune.prototype.setCircle = function () {
        this.circleOptions = this.common.extend(this.options, this.circleOptions);
        this.circleOptions.fromDegree = this.options.needleOptions.minMaxVal.min;
        this.circleOptions.toDegree = this.options.needleOptions.minMaxVal.max;
        this.circleOptions.backgroundColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
        if (!this.circleOptions.backgroundColor)
            this.circleOptions.backgroundColor = '#fff';
        if (this.circle)
            this.circle.update(this.circleOptions);
        else
            this.circle = new circle_1.Circle(this.circleOptions);
    };
    Tune.prototype.setNeedle = function () {
        this.needleOptions = this.common.extend(this.options.needleOptions, this.needleOptions);
        if (!this.options.needleOptions.color)
            this.needleOptions.color = this.common.isInRange(this.options.needleOptions.minMaxVal, this.options.hollowEdges) ? this.options.colors.active : this.options.colors["default"];
        if (this.options.needleOptions.minMaxVal.value > 100 || this.options.needleOptions.minMaxVal.value < 0)
            this.needleOptions.color = this.options.colors.inactive;
        else if (this.options.hideBottom) {
            if (this.options.needleOptions.minMaxVal.value >= 83.34 || this.options.needleOptions.minMaxVal.value <= 16.67)
                this.needleOptions.color = this.options.colors.inactive;
        }
        if (this.needle) {
            this.needle.update(this.needleOptions);
        }
        else
            this.needle = new needle_1.Needle(this.needleOptions);
    };
    Tune.prototype.setEdges = function () {
        this.edgesOptions = this.common.extend(this.options.needleOptions, this.edgesOptions);
        this.edgesOptions.strokeWidth = this.options.strokeWidth;
        this.edgesOptions.color = this.options.colors.active;
        this.edgesOptions.hollowEdges = this.options.hollowEdges;
        this.edgesOptions.backgroundColor = this.options.hollowEdgesBgColor;
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
    Tune.prototype.setIcon = function () {
        this.iconOptions = this.common.extend(this.options.iconOptions, this.iconOptions);
        if (this.icon)
            this.icon.update(this.iconOptions);
        else
            this.icon = new icon_1.Icon(this.iconOptions);
        var image = this.element.querySelector('[data-icon]');
        if (image) {
            if (!this.options.showIcon || !this.iconOptions.src)
                image.style.display = 'none';
            else
                image.style.display = 'inline-block';
        }
    };
    return Tune;
}());
exports.Tune = Tune;
