import { NeedleOptions } from './interfaces';
import { Common } from './common';

export class Needle {
    private element: any;
    private common: Common;
    constructor(private options: NeedleOptions) {
        this.common = new Common();

        this.options = options;

        this.init();
    }

    init() {
        this.element = this.common.jsonToHtml(
            {
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
                            'style': `enable-background:new 0 0 11.5 103.8;position: relative; margin: auto; display: block;`
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
    }

    public update(options: NeedleOptions): void {
        this.options = this.common.extend(this.options, options);
        this.updateOptions();
    }

    updateOptions(): void {
        this.setDiv(this.options);
        this.setSvg(this.options);
    }

    setDiv(options: NeedleOptions): void {
        let div = this.element;
        let divStyle = this.common.getNeedleStyle(options.radius, options.minMaxVal.value, options.scale);
        div.style.left = divStyle.left;
        div.style.transform = divStyle.transform;
        div.style.transitionDuration = options.animationDuration + 'ms';
    }

    public getElement(): any {
        return this.element;
    }

    setSvg(options: NeedleOptions): void {
        let svg = this.element.querySelector('svg');
        let svgStyle = this.common.getNeedleInnerStyle(options.radius);
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
        let path = svg.querySelector('path');
        path.setAttributeNS(null, 'fill', options.color);
        path.style.transitionDuration = options.animationDuration + 'ms';
    }
}