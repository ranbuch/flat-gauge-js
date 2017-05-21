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
        image.style.height = options.dimensions.height + 'px';
        // let deg = (options.degree - 75) * 3.6;
        // image.style.left = `calc(50% - ${Math.sin(deg * (Math.PI / 180)) * options.dimensions.width}px)`;
        // image.style.top = `calc(50% - ${-Math.cos(deg * (Math.PI / 180)) * options.dimensions.height}px)`;
        // image.style.top = '50%';
        // image.style.left = '50%';
        if (typeof options.dimensions.top === 'undefined')
            options.dimensions.top = 0;
        if (typeof options.dimensions.left === 'undefined')
            options.dimensions.left = 0;
        var subFromLeft = (options.dimensions.width / 2) + options.dimensions.left;
        image.style.left = `calc(50% - ${subFromLeft}px)`;
        var subFromTop = (options.dimensions.height / 2) + options.dimensions.top;
        image.style.top = `calc(50% - ${subFromTop}px)`;
        image.style.transitionDuration = options.animationDuration + 'ms';
        image.style.opacity = options.opacity;
        image.src = options.src;

        let scalar = options.radius - (options.dimensions.height / 2), xVector, yVector;
        let deg = (options.degree - 50) * 3.6;
        xVector = Math.sin(deg * (Math.PI / 180)) * scalar;
        yVector = -Math.cos(deg * (Math.PI / 180)) * scalar;
        image.style.transform = `translate3d(${xVector}px, ${yVector}px, 0) rotate(${deg}deg)`;
        // deg = (options.degree) * 3.6;
        // image.style.left = `calc(50% - ${(Math.sin(deg * (Math.PI / 180)) * (options.dimensions.width / 2)) - 12.5}px)`;
        // image.style.top = `calc(50% - ${(Math.cos(deg * (Math.PI / 180)) * (options.dimensions.height / 2)) + 12.5}px)`;
    }

    public getElement(): any {
        return this.element;
    }
}