import { TuneOptions, CircleOptions, NeedleOptions, JsonToHtmlElement, EdgesOptions, IconOptions, SideState } from './interfaces';
import { Common } from './common';
import { Circle } from './circle';
import { Needle } from './needle';
import { Edges } from './edges';
import { Icon } from './icon';

export class Tune {
    private element: any;
    private options: TuneOptions;
    private common: Common;
    private circleOptions: CircleOptions;
    private circle: Circle;
    private needleOptions: NeedleOptions;
    private needle: Needle;
    private edgesOptions: EdgesOptions;
    private edges: Edges;
    private iconOptions: IconOptions;
    private icon: Icon;
    constructor(element: any, options?: TuneOptions) {
        this.element = element;
        this.common = new Common();
        // set default options
        let defaultOptions = this.getDefaultOptions();

        // override defaults with user options
        this.options = this.common.extend(defaultOptions, options);

        this.fixOptions();

        this.init();
    }

    fixOptions() {
        // this.options.title = this.common.setInnerTextDefaults(this.options.title);
        this.options.strokeWidth = this.common.fixStrokeWidth(this.options.strokeWidth);
        this.options.radius = this.common.fixRadius(this.options.radius);

        // if we're hiding bottom we should take thoes values in to considuration
        if (this.options.hideBottom) {
            let portionToHide = 0.3334;
            this.options.needleOptions.minMaxVal.max = this.common.normalizeByPercentage(this.options.needleOptions.minMaxVal.max, portionToHide);
            this.options.needleOptions.minMaxVal.min = this.common.normalizeByPercentage(this.options.needleOptions.minMaxVal.min, portionToHide);
            this.options.needleOptions.minMaxVal.value = this.common.normalizeByPercentage(this.options.needleOptions.minMaxVal.value, portionToHide);
            if (this.options.iconOptions && typeof this.options.iconOptions.degree === 'number')
                this.options.iconOptions.degree = this.common.normalizeByPercentage(this.options.iconOptions.degree, portionToHide);
        }
    }

    init() {
        // let h4 = {
        //     type: 'h4',
        //     attrs: {
        //         'style': `position: absolute; z-index: 10; text-align: center; width: 100%; transition-property: color; margin: 0;bottom: 0;`
        //     }
        // } as JsonToHtmlElement;
        // let h4Elem = this.common.jsonToHtml(h4) as any;

        let obj = {
            type: 'div',
            attrs: {
                'data-tune': ''
            }
        } as JsonToHtmlElement;

        let innerElem = this.common.jsonToHtml(obj);

        this.updateOptions(false);

        // innerElem.appendChild(h4Elem);

        innerElem.appendChild(this.circle.getElement());
        innerElem.appendChild(this.needle.getElement());
        innerElem.appendChild(this.edges.getLeftElement());
        innerElem.appendChild(this.edges.getRightElement());
        innerElem.appendChild(this.icon.getElement());
        

        this.element.appendChild(innerElem);

        this.updateOptions(true);
    }

    public update(options: TuneOptions): void {
        this.options = this.common.extend(this.options, options);
        this.fixOptions();
        this.updateOptions(true);
    }

    updateOptions(setWrap?: boolean): void {
        if (setWrap)
            this.setWrap(this.options);
        this.setCircle();
        this.setNeedle();
        this.setEdges();
        this.setIcon();
    }

    setWrap(options: TuneOptions) {
        let wrap = this.element;
        let dim = (options.radius * 2) + 'px';
        wrap.style.width = dim;
        wrap.style.height = dim;
        wrap.style.position = 'relative';
    }

    getDefaultOptions(): TuneOptions {
        let colors = this.common.getDefaultColors();
        let defRadius = 88, animationDuration = 500;
        return {
            needleOptions: {
                minMaxVal: {
                    min: 30,
                    max: 70,
                    value: 55
                },
                color: colors.active,
                scale: 1.1,
                radius: defRadius,
                animationDuration: animationDuration
            },
            iconOptions: {
                animationDuration: animationDuration,
                degree: 50,
                radius: defRadius,
                // src: 'https://cdn.hexa3d.io/hotlink-ok/capitalise/userpics_all/1.jpg',
                src: '',
                dimensions: {
                    width: 25,
                    height: 25
                },
                top: 0,
                left: 0,
                opacity: 1
            },
            colors: colors,
            strokeWidth: 6,
            animationDuration: animationDuration,
            radius: defRadius,
            showEdges: true,
            showIcon: true,
            hollowEdges: SideState.None,
            // title: this.common.setInnerTextDefaults(),
            hideBottom: true
        } as TuneOptions;
    }

    setCircle() {
        this.circleOptions = this.common.extend(this.options, this.circleOptions);
        
        this.circleOptions.fromDegree = this.options.needleOptions.minMaxVal.min;
        this.circleOptions.toDegree = this.options.needleOptions.minMaxVal.max;
        
        this.circleOptions.backgroundColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
        if (!this.circleOptions.backgroundColor)
            this.circleOptions.backgroundColor = '#fff';

        if (this.circle)
            this.circle.update(this.circleOptions);
        else
            this.circle = new Circle(this.circleOptions);
    }

    setNeedle() {
        this.needleOptions = this.common.extend(this.options.needleOptions, this.needleOptions);
        this.needleOptions.color = this.common.isInRange(this.options.needleOptions.minMaxVal, this.options.hollowEdges) ? this.options.colors.active : this.options.colors.default;
        if (this.options.needleOptions.minMaxVal.value > 100 || this.options.needleOptions.minMaxVal.value < 0)
            this.needleOptions.color = this.options.colors.inactive;
        else if (this.options.hideBottom) {
            if (this.options.needleOptions.minMaxVal.value >= 83.34 || this.options.needleOptions.minMaxVal.value <= 16.67)
                this.needleOptions.color = this.options.colors.inactive;
        }
        
        if (this.needle) {
            this.needle.update(this.needleOptions);
        }
        else
            this.needle = new Needle(this.needleOptions);
    }

    setEdges() {
        this.edgesOptions = this.common.extend(this.options.needleOptions, this.edgesOptions);
        this.edgesOptions.strokeWidth = this.options.strokeWidth;
        this.edgesOptions.color = this.options.colors.active;
        this.edgesOptions.hollowEdges = this.options.hollowEdges;
        
        
        if (this.edges)
            this.edges.update(this.edgesOptions);
        else
            this.edges = new Edges(this.edgesOptions);
        let left = this.element.querySelector('[data-left-edge]');
        let right = this.element.querySelector('[data-right-edge]');
        if (left && right) {
            if (!this.options.showEdges) {
                left.style.display = 'none';
                right.style.display = 'none';
            }
            else {
                left.style.display = 'inline-block';
                right.style.display = 'inline-block';
            }
        }
    }

    setIcon() {
        this.iconOptions = this.common.extend(this.options.iconOptions, this.iconOptions);
        
        if (this.icon)
            this.icon.update(this.iconOptions);
        else
            this.icon = new Icon(this.iconOptions);
        let image = this.element.querySelector('[data-icon]');
        if (image) {
            if (!this.options.showIcon) 
                image.style.display = 'none';
            else
                image.style.display = 'inline-block';
        }
    }
}