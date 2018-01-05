"use strict";
exports.__esModule = true;
var common_1 = require("./common");
var Icon = /** @class */ (function () {
    function Icon(options) {
        this.options = options;
        this.common = new common_1.Common();
        this.options = options;
        this.init();
    }
    Icon.prototype.init = function () {
        this.element = this.common.jsonToHtml({
            type: 'img',
            attrs: {
                'style': 'position: absolute;z-index: 15;display: inline-block;',
                'data-icon': ''
            }
        });
        this.updateOptions();
    };
    Icon.prototype.update = function (options) {
        this.options = this.common.extend(this.options, options);
        this.updateOptions();
    };
    Icon.prototype.updateOptions = function () {
        this.setImage(this.options);
    };
    Icon.prototype.setImage = function (options) {
        var image = this.element;
        image.style.width = options.dimensions.width + 'px';
        image.style.height = options.dimensions.height + 'px';
        if (typeof options.top === 'undefined')
            options.top = 0;
        if (typeof options.left === 'undefined')
            options.left = 0;
        var deg = (options.degree - 50) * 3.6;
        var scalar = options.radius + options.radiusOffset;
        var xVector = Math.sin(deg * (Math.PI / 180)) * scalar;
        var yVector = -Math.cos(deg * (Math.PI / 180)) * scalar;
        image.style.left = ((options.dimensions.width / -2) + options.radius + xVector) + 'px';
        image.style.top = ((options.dimensions.height / -2) + options.radius + yVector) + 'px';
        image.style.transitionDuration = '0ms';
        image.style.opacity = options.opacity;
        image.src = options.src;
        if (options.src)
            image.style.display = 'inline-block';
        else
            image.style.display = 'none';
        image.style.transform = "rotate(" + deg + "deg)";
    };
    Icon.prototype.getElement = function () {
        return this.element;
    };
    return Icon;
}());
exports.Icon = Icon;
