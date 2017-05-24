import { IconOptions } from './interfaces';
import { Common } from './common';

export class Icon {
    private element: any;
    private common: Common;
    constructor(private options: IconOptions) {
        this.common = new Common();

        this.options = options;

        this.init();
    }

    init() {
        this.element = this.common.jsonToHtml(
            {
                type: 'img',
                attrs: {
                    'style': 'position: absolute;z-index: 15;display: inline-block;',
                    'data-icon': ''
                }
            });

        this.updateOptions();
    }

    public update(options: IconOptions): void {
        this.options = this.common.extend(this.options, options);
        this.updateOptions();
    }

    updateOptions() {
        this.setImage(this.options);
    }

    setImage(options: IconOptions) {
        let image = this.element;
        image.style.width = options.dimensions.width + 'px';
        image.style.height = options.dimensions.height + 'px';
        if (typeof options.top === 'undefined')
            options.top = 0;
        if (typeof options.left === 'undefined')
            options.left = 0;
        var subFromLeft = (options.dimensions.width / 2) + options.left;
        image.style.left = `calc(50% - ${subFromLeft}px)`;
        var subFromTop = (options.dimensions.height / 2) + options.top;
        image.style.top = `calc(50% - ${subFromTop}px)`;
        // image.style.transitionDuration = options.animationDuration + 'ms';
        image.style.transitionDuration = '0ms';
        image.style.opacity = options.opacity;
        image.src = options.src;
        if (options.src)
            image.style.display = 'inline-block';
        else
            image.style.display = 'none';

        // let scalarX = options.radius - (options.dimensions.width / 2), scalarY = options.radius - (options.dimensions.height / 2), xVector, yVector;
        let scalarX = options.radius, scalarY = options.radius - (options.dimensions.height / 2), xVector, yVector;
        let deg = (options.degree - 50) * 3.6;
        xVector = Math.sin(deg * (Math.PI / 180)) * scalarX;
        yVector = -Math.cos(deg * (Math.PI / 180)) * scalarY;
        console.log("sin: " + Math.sin(deg * (Math.PI / 180)) + ", xVector:" + xVector);
        console.log("cos: " + Math.cos(deg * (Math.PI / 180)) + ", yVector:" + yVector);
        // if (deg > 0)
            // xVector += Math.sin(deg * (Math.PI / 180)) * ((options.dimensions.width / 2) + (options.top / 2));
            
        // else
        //     xVector -= Math.cos(deg * (Math.PI / 180)) * (options.dimensions.width / 2);
        image.style.transform = `translate3d(${xVector}px, ${yVector}px, 0) rotate(${deg}deg)`;
    }

    public getElement(): any {
        return this.element;
    }
}