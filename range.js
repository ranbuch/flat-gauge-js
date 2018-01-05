"use strict";
exports.__esModule = true;
var interfaces_1 = require("./interfaces");
var common_1 = require("./common");
var circle_1 = require("./circle");
var edges_1 = require("./edges");
var Range = /** @class */ (function () {
    function Range(element, options) {
        this.element = element;
        this.common = new common_1.Common();
        // set default options
        var defaultOptions = this.getDefaultOptions();
        // override defaults with user options
        this.options = this.common.extend(defaultOptions, options);
        this.fixOptions();
        this.init();
    }
    Range.prototype.fixOptions = function () {
        this.options.title = this.common.setInnerTextDefaults(this.options.title);
        this.options.strokeWidth = this.common.fixStrokeWidth(this.options.strokeWidth);
        this.options.radius = this.common.fixRadius(this.options.radius);
        if (this.options.hideBottom) {
            var portionToHide = 0.3334;
            this.options.minMaxVal.max = this.common.normalizeByPercentage(this.options.minMaxVal.max, portionToHide);
            this.options.minMaxVal.min = this.common.normalizeByPercentage(this.options.minMaxVal.min, portionToHide);
            this.options.minMaxVal.value = this.common.normalizeByPercentage(this.options.minMaxVal.value, portionToHide);
        }
    };
    Range.prototype.init = function () {
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
                'data-range': ''
            }
        };
        var innerElem = this.common.jsonToHtml(obj);
        innerElem.appendChild(h4Elem);
        this.updateOptions(false);
        innerElem.appendChild(this.circle.getElement());
        innerElem.appendChild(this.edges.getLeftElement());
        innerElem.appendChild(this.edges.getRightElement());
        this.element.appendChild(innerElem);
        this.updateOptions(true);
    };
    Range.prototype.update = function (options) {
        this.options = this.common.extend(this.options, options);
        this.fixOptions();
        this.updateOptions(true);
    };
    Range.prototype.updateOptions = function (setWrap) {
        if (setWrap)
            this.setWrap(this.options);
        this.setTitle(this.options);
        this.setCircle();
        this.setEdges();
    };
    Range.prototype.setTitle = function (options) {
        var h4 = this.element.querySelector('h4');
        if (!h4)
            return;
        h4.style.color = options.highlight ? options.colors.active : options.colors["default"];
        h4.style.transitionDuration = options.animationDuration + 'ms';
        h4.style.fontSize = options.title.fontSize + 'ms';
        h4.style.fontFamily = options.title.fontFamily;
        h4.style.fontWeight = options.title.fontWeight;
        h4.style.letterSpacing = options.title.letterSpacing;
        h4.style.lineHeight = options.title.lineHeight + 'px';
        h4.textContent = options.title.text;
        h4.style.top = 'calc(50% - ' + (options.title.lineHeight / 2) + 'px)';
    };
    Range.prototype.setWrap = function (options) {
        var wrap = this.element;
        var dim = (options.radius * 2) + 'px';
        wrap.style.width = dim;
        wrap.style.height = dim;
        wrap.style.position = 'relative';
    };
    Range.prototype.getDefaultOptions = function () {
        return {
            minMaxVal: {
                min: 30,
                max: 70,
                value: 55
            },
            title: {
                text: '',
                fontWeight: 'bold'
            },
            colors: this.common.getDefaultColors(),
            strokeWidth: 6,
            animationDuration: 500,
            radius: 88,
            showEdges: true,
            showIcon: true,
            hollowEdges: interfaces_1.SideState.None,
            hideBottom: true,
            highlight: false
        };
    };
    Range.prototype.setCircle = function () {
        this.circleOptions = this.common.extend(this.options, this.circleOptions);
        this.circleOptions.fromDegree = this.options.minMaxVal.min;
        this.circleOptions.toDegree = this.options.minMaxVal.max;
        this.circleOptions.backgroundColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
        if (!this.circleOptions.backgroundColor)
            this.circleOptions.backgroundColor = '#fff';
        if (this.circle)
            this.circle.update(this.circleOptions);
        else
            this.circle = new circle_1.Circle(this.circleOptions);
    };
    Range.prototype.setEdges = function () {
        this.edgesOptions = this.common.extend(this.options, this.edgesOptions);
        this.edgesOptions.strokeWidth = this.options.strokeWidth;
        this.edgesOptions.color = this.options.colors.active;
        this.edgesOptions.hollowEdges = this.options.hollowEdges;
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
    return Range;
}());
exports.Range = Range;
