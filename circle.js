"use strict";
exports.__esModule = true;
var common_1 = require("./common");
var Circle = /** @class */ (function () {
    function Circle(options) {
        this.options = options;
        this.common = new common_1.Common();
        this.injectCss();
        this.init();
    }
    Circle.prototype.injectCss = function () {
        var className = '_all-gauge-js-circle-style';
        if (document.querySelector('.' + className))
            return;
        var style = "@keyframes allGaugeRotatingCircle {\n            from {\n                transform: rotate(0deg);\n            }\n            to {\n                transform: rotate(360deg);\n            }\n        }";
        var sheet = document.createElement('style');
        sheet.innerHTML = style;
        sheet.className = className;
        document.body.appendChild(sheet);
    };
    Circle.prototype.update = function (options) {
        this.options = this.common.extend(this.options, options);
        if (typeof this.options.indent === 'undefined')
            this.options.indent = 50;
        this.updateOptions();
    };
    Circle.prototype.updateOptions = function () {
        this.setSvg(this.options);
        this.setElements(this.options);
    };
    Circle.prototype.setSvg = function (options) {
        if (options.toDegree - options.fromDegree == 100)
            options.toDegree -= 0.0001;
        var startAngle = (options.fromDegree - this.options.indent) * 3.6, endAngle = (options.toDegree - this.options.indent) * 3.6;
        var d = this.describeArc(options.radius, options.radius, options.radius - (options.strokeWidth / 2), startAngle, endAngle);
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
        if (d.indexOf('NaN') == -1)
            path.setAttributeNS(null, 'd', d);
        path.style.strokeWidth = options.strokeWidth + 'px';
        path.style.transitionDuration = options.animationDuration;
        var concealer = svg.querySelector('[data-concealer]');
        if (options.hideBottom) {
            startAngle = (33.334) * 3.6, endAngle = (66.667) * 3.6;
            d = this.describeArc(options.radius, options.radius, options.radius - (options.strokeWidth / 2), startAngle, endAngle);
            concealer.setAttributeNS(null, 'stroke-width', options.strokeWidth + 2);
            concealer.setAttributeNS(null, 'd', d);
            concealer.style.strokeWidth = (options.strokeWidth + 2) + 'px';
            concealer.style.display = '';
            var bgColor = options.backgroundColor;
            if (!bgColor)
                bgColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
            if (!bgColor)
                bgColor = '#ffffff';
            concealer.setAttributeNS(null, 'stroke', bgColor);
        }
        else
            concealer.style.display = 'none';
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
        dim = ((options.radius * 2) - (options.strokeWidth * 2)) + 'px';
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
            children: [
                {
                    type: 'div',
                    children: [
                        {
                            type: 'span',
                            attrs: {
                                'data-c1': '',
                                'style': "position: absolute;top: 0; left: 0; z-index: 1; border-radius: 50%;"
                            }
                        },
                        {
                            type: 'svg',
                            attrs: {
                                'style': "position: absolute; top: 0;left: 0; z-index: 2; border-radius: unset;"
                            },
                            children: [
                                {
                                    type: 'path',
                                    attrs: {
                                        'fill': 'none',
                                        'data-arc': ''
                                    }
                                },
                                {
                                    type: 'path',
                                    attrs: {
                                        'fill': 'none',
                                        'data-concealer': ''
                                    }
                                }
                            ]
                        },
                        {
                            type: 'span',
                            attrs: {
                                'data-c3': '',
                                'style': "position: absolute; z-index: 3; border-radius: 50%;"
                            }
                        }
                    ]
                }
            ]
        });
        this.updateOptions();
    };
    Circle.prototype.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };
    Circle.prototype.describeArc = function (x, y, radius, startAngle, endAngle) {
        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);
        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
        return d;
    };
    Circle.prototype.getElement = function () {
        return this.element;
    };
    return Circle;
}());
exports.Circle = Circle;
