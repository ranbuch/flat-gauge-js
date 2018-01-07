import { SpinnerOptions, JsonToHtmlElement, RGBA, InnerText, CircleOptions } from './interfaces';
import { Common } from './common';
import { Circle } from './circle';

export class Spinner {
    private element: any;
    private options: SpinnerOptions;
    private circleOptions: CircleOptions;
    private common: Common;
    private circle: Circle;
    constructor(element: any, options?: SpinnerOptions) {
        this.element = element;
        this.common = new Common();
        // set default options
        let defaultOptions = this.getDefaultOptions();

        // override defaults with user options
        this.options = this.common.extend(defaultOptions, options);

        this.options.strokeWidth = this.common.fixStrokeWidth(this.options.strokeWidth);
        this.options.radius = this.common.fixRadius(this.options.radius);

        this.init();
    }

    getDefaultOptions(): SpinnerOptions {
        return {
            colors: this.common.getDefaultColors(),
            activeDegree: 10,
            radius: 88,
            strokeWidth: 6,
            rotationSpeed: 5000,
            animationDuration: 500,
            title: {
                text: '',
                fontWeight: 'bold'
            },
            highlight: false
        } as SpinnerOptions;
    }

    public update(options: SpinnerOptions): void {
        this.options = this.common.extend(this.options, options);
        this.options.title = this.common.setInnerTextDefaults(this.options.title);
        this.updateOptions();
    }

    updateOptions(): void {
        this.setTitle(this.options);
        this.setDiv(this.options);
        this.setCircle();
    }

    setTitle(options: SpinnerOptions) {
        let h4 = this.element.querySelector('h4');
        h4.style.color = options.highlight ? options.colors.active : options.colors.default;
        // h4.style.top = ((options.radius) - (options.title.fontSize / 2)) + 'px';
        h4.style.transitionDuration = options.animationDuration + 'ms';
        h4.style.fontSize = options.title.fontSize + 'ms';
        h4.style.fontFamily = options.title.fontFamily;
        h4.style.fontWeight = options.title.fontWeight;
        h4.style.letterSpacing = options.title.letterSpacing;
        h4.style.lineHeight = options.title.lineHeight + 'px';
        h4.textContent = options.title.text;
        // setTimeout(() => {
        //     let h = parseInt(getComputedStyle(h4).height.replace('px', ''));
        //     if (!isNaN(h))
        //         h4.style.top = ((options.radius) - (h / 2)) + 'px';
        // }, 10);
    }

    setDiv(options: SpinnerOptions) {
        let div = this.element.querySelector('div[data-spinner]');
        let dim = options.radius * 2 + 'px';
        div.style.width = dim;
        div.style.height = dim;
        div.style.transitionDuration = options.animationDuration;
    }

    init() {
        
        this.options.title = this.common.setInnerTextDefaults(this.options.title);
        let h4 = {
            type: 'h4',
            attrs: {
                'style': `position: absolute; z-index: 10; text-align: center; width: 100%; transition-property: color; margin: 0;top: 50%;left: 0;transform: translateY(-50%);`
            }
        } as JsonToHtmlElement;
        let h4Elem = this.common.jsonToHtml(h4) as any;
        
        let obj = {
            type: 'div',
            attrs: {
                'style': `position: relative;`,
                'data-spinner': ''
            }
        } as JsonToHtmlElement;
        let innerElem = this.common.jsonToHtml(obj);

        this.setCircle();

        innerElem.appendChild(h4Elem);

        innerElem.appendChild(this.circle.getElement());

        this.element.appendChild(innerElem);

        this.updateOptions();
    }

    setCircle() {
        this.circleOptions = this.common.extend(this.options, this.circleOptions);
        this.circleOptions.fromDegree = -this.options.activeDegree / 2;
        this.circleOptions.toDegree = this.options.activeDegree / 2;
        
        this.circleOptions.backgroundColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
        if (!this.circleOptions.backgroundColor)
            this.circleOptions.backgroundColor = '#fff';

        if (this.circle) {
            this.circle.update(this.circleOptions);
        }
        else
            this.circle = new Circle(this.circleOptions);
    }
}