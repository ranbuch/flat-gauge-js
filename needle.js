"use strict";
exports.__esModule = true;
var common_1 = require("./common");
var Needle = /** @class */ (function () {
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
            children: [
                {
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
                    children: [
                        {
                            type: 'g',
                            children: [
                                {
                                    type: 'path',
                                    attrs: {
                                        'd': 'M10.4,95.6c-0.4-0.9-1-1.6-1.7-2.1L5.7,1.3L2.8,93.5c-1.9,1.3-2.6,3.8-1.7,6c1.1,2.5,4,3.8,6.6,2.7C10.2,101.1,11.4,98.2,10.4,95.6z'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
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
        var divStyle = this.common.getNeedleStyle(options.radius, options.minMaxVal.value, options.scale);
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
}());
exports.Needle = Needle;
