"use strict";
exports.__esModule = true;
var interfaces_1 = require("./interfaces");
var common_1 = require("./common");
var Edges = /** @class */ (function () {
    function Edges(options) {
        this.options = options;
        this.common = new common_1.Common();
        var defaultOptions = this.getDefaultOptions();
        this.options = this.common.extend(defaultOptions, options);
        this.init();
    }
    Edges.prototype.getDefaultOptions = function () {
        var colors = this.common.getDefaultColors();
        var defRadius = 88, animationDuration = 500;
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
            backgroundColor: '#ffffff'
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
        var height = (options.strokeWidth + Edges.AddToEdge + Edges.AddToEdgeHeight) + 'px';
        var top = 'calc(50% - ' + ((options.strokeWidth / 2) + (Edges.AddToEdge / 2) + (Edges.AddToEdgeHeight / 2)) + 'px)';
        var leftStyle = 'calc(50% - ' + (Edges.AddToEdge / 2) + 'px)';
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
        var scalar = options.radius - (options.strokeWidth / 2), xVectorLeft, yVectorLeft, xVectorRight, yVectorRight;
        var degLeft = (options.minMaxVal.min - 50) * 3.6;
        var degRight = (options.minMaxVal.max - 50) * 3.6;
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
}());
exports.Edges = Edges;
