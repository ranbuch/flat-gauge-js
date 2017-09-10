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
      
	    let deg = (options.degree - 50) * 3.6;
	    let scalar = options.radius + options.radiusOffset;
	
        let xVector = Math.sin(deg * (Math.PI / 180)) * scalar;
        let yVector = -Math.cos(deg * (Math.PI / 180)) * scalar;

        image.style.left = ((options.dimensions.width / -2) + options.radius + xVector) + 'px';
        image.style.top = ((options.dimensions.height / -2) + options.radius + yVector) + 'px';
       
        image.style.transitionDuration = '0ms';
        image.style.opacity = options.opacity;
        image.src = options.src;
        if (options.src)
            image.style.display = 'inline-block';
        else
            image.style.display = 'none';

        image.style.transform = `rotate(${deg}deg)`;
    }

    public getElement(): any {
        return this.element;
    }
}