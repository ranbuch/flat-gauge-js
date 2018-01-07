import { CircleOptions } from './interfaces';
import { Common } from './common';

export class Circle {
    private element: any;
    private common: Common;
    constructor(private options: CircleOptions) {
        this.common = new Common();

        this.injectCss();

        this.init();
    }

    injectCss(): void {
        let className = '_all-gauge-js-circle-style';
        if (document.querySelector('.' + className)) return;

        let style = `@keyframes allGaugeRotatingCircle {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }`;

        let sheet = document.createElement('style');
        sheet.innerHTML = style;
        sheet.className = className;
        document.body.appendChild(sheet);
    }

    public update(options: CircleOptions): void {
        this.options = this.common.extend(this.options, options);
        if (typeof this.options.indent === 'undefined')
            this.options.indent = 50;
        this.updateOptions();
    }

    updateOptions(): void {
        this.setSvg(this.options);
        this.setElements(this.options);
    }

    setSvg(options: CircleOptions): void {
        if (options.toDegree - options.fromDegree == 100)
            options.toDegree -= 0.0001;
        let startAngle = (options.fromDegree - this.options.indent) * 3.6, endAngle = (options.toDegree - this.options.indent) * 3.6;
        let d = this.describeArc(options.radius, options.radius, options.radius - (options.strokeWidth / 2), startAngle, endAngle);

        let svg = this.element.querySelector('svg');
        let dim = options.radius * 2;
        svg.style.transitionDuration = options.animationDuration;
        svg.style.width = dim + 'px';
        svg.style.height = dim + 'px';
        svg.style.animation = `allGaugeRotatingCircle ${options.rotationSpeed}ms linear infinite`;
        svg.setAttributeNS(null, 'width', dim + 'px');
        svg.setAttributeNS(null, 'height', dim + 'px');
        let path = svg.querySelector('[data-arc]');
        path.setAttributeNS(null, 'stroke', options.colors.active);
        path.setAttributeNS(null, 'stroke-width', options.strokeWidth);
        if (d.indexOf('NaN') == -1)
            path.setAttributeNS(null, 'd', d);
        path.style.strokeWidth = options.strokeWidth + 'px';
        path.style.transitionDuration = options.animationDuration;

        let concealer = svg.querySelector('[data-concealer]');
        if (options.hideBottom) {
            startAngle = (33.334) * 3.6, endAngle = (66.667) * 3.6;
            d = this.describeArc(options.radius, options.radius, options.radius - (options.strokeWidth / 2), startAngle, endAngle);
            concealer.setAttributeNS(null, 'stroke-width', options.strokeWidth + 2);
            concealer.setAttributeNS(null, 'd', d);
            concealer.style.strokeWidth = (options.strokeWidth + 2) + 'px';
            concealer.style.display = '';
            let bgColor = options.backgroundColor;
            if (!bgColor)
                bgColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
            if (!bgColor)
                bgColor = '#ffffff';
            concealer.setAttributeNS(null, 'stroke', bgColor);
        }
        else
            concealer.style.display = 'none';
    }

    setElements(options: CircleOptions): void {
        // let circle = this.element.querySelector('div[data-circle]');
        let circle = this.element.children[0];
        let dim = this.options.radius * 2 + 'px';
        circle.style.width = dim;
        circle.style.height = dim;
        circle.style.transitionDuration = options.animationDuration;

        let c1 = circle.querySelector('[data-c1]');
        c1.style.width = dim;
        c1.style.height = dim;
        c1.style.backgroundColor = this.options.colors.inactive;
        c1.style.transitionDuration = options.animationDuration;
        
        let c3 = circle.querySelector('[data-c3]');
        dim = ((options.radius * 2) - (options.strokeWidth * 2)) + 'px';
        c3.style.width = dim;
        c3.style.height = dim;
        c3.style.top = options.strokeWidth + 'px';
        c3.style.left = options.strokeWidth + 'px';
        c3.style.backgroundColor = options.backgroundColor;
        c3.style.transitionDuration = options.animationDuration;
    }

    init() {
        this.element = this.common.jsonToHtml({
            type: 'div',
            attrs: {
                'style': `position: relative; margin: auto; display: block;`,
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
                                'style': `position: absolute;top: 0; left: 0; z-index: 1; border-radius: 50%;`
                            }
                        },
                        {
                            type: 'svg',
                            attrs: {
                                'style': `position: absolute; top: 0;left: 0; z-index: 2; border-radius: unset;`
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
                                'style': `position: absolute; z-index: 3; border-radius: 50%;`
                            }
                        }
                    ]
                }
            ]
        });

        this.updateOptions();
    }

    polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): any {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): any {
        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);
        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
        return d;
    }

    public getElement(): any {
        return this.element;
    }
}