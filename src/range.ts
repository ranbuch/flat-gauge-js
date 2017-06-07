import { RangeOptions, CircleOptions, JsonToHtmlElement, EdgesOptions, SideState } from './interfaces';
import { Common } from './common';
import { Circle } from './circle';
import { Edges } from './edges';

export class Range {
    private element: any;
    private options: RangeOptions;
    private common: Common;
    private circleOptions: CircleOptions;
    private circle: Circle;
    private edgesOptions: EdgesOptions;
    private edges: Edges;
    constructor(element: any, options?: RangeOptions) {
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
        this.options.title = this.common.setInnerTextDefaults(this.options.title);
        this.options.strokeWidth = this.common.fixStrokeWidth(this.options.strokeWidth);
        this.options.radius = this.common.fixRadius(this.options.radius);
        if (this.options.hideBottom) {
            let portionToHide = 0.3334;
            this.options.minMaxVal.max = this.common.normalizeByPercentage(this.options.minMaxVal.max, portionToHide);
            this.options.minMaxVal.min = this.common.normalizeByPercentage(this.options.minMaxVal.min, portionToHide);
            this.options.minMaxVal.value = this.common.normalizeByPercentage(this.options.minMaxVal.value, portionToHide);
        }
    }

    init() {
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
                'data-range': ''
            }
        } as JsonToHtmlElement;

        let innerElem = this.common.jsonToHtml(obj);

        innerElem.appendChild(h4Elem);

        this.updateOptions(false);

        


        innerElem.appendChild(this.circle.getElement());
        innerElem.appendChild(this.edges.getLeftElement());
        innerElem.appendChild(this.edges.getRightElement());
        
        

        this.element.appendChild(innerElem);

        this.updateOptions(true);
    }

    public update(options: RangeOptions): void {
        this.options = this.common.extend(this.options, options);
        this.fixOptions();
        this.updateOptions(true);
    }

    updateOptions(setWrap?: boolean): void {
        if (setWrap)
            this.setWrap(this.options);
        this.setTitle(this.options);
        this.setCircle();
        this.setEdges();
    }

    setTitle(options: RangeOptions) {
        let h4 = this.element.querySelector('h4');
        if (!h4) return;
        h4.style.color = options.highlight ? options.colors.active : options.colors.default;
        h4.style.transitionDuration = options.animationDuration + 'ms';
        h4.style.fontSize = options.title.fontSize + 'ms';
        h4.style.fontFamily = options.title.fontFamily;
        h4.style.fontWeight = options.title.fontWeight;
        h4.style.letterSpacing = options.title.letterSpacing;
        h4.style.lineHeight = options.title.lineHeight + 'px';
        h4.textContent = options.title.text;
        h4.style.top = 'calc(50% - ' + (options.title.lineHeight / 2) + 'px)';
    }

    setWrap(options: RangeOptions) {
        let wrap = this.element;
        let dim = (options.radius * 2) + 'px';
        wrap.style.width = dim;
        wrap.style.height = dim;
        wrap.style.position = 'relative';
    }

    getDefaultOptions(): RangeOptions {
        return {
            minMaxVal: {
                min: 30,
                max: 70,
                value: 55
            },
            title: {
                text: '',
                fontWeight: 'bold'
            },
            colors: this.common.getDefaultColors(),
            strokeWidth: 6,
            animationDuration: 500,
            radius: 88,
            showEdges: true,
            showIcon: true,
            hollowEdges: SideState.None,
            hideBottom: true,
            highlight: false
        } as RangeOptions;
    }

    setCircle() {
        this.circleOptions = this.common.extend(this.options, this.circleOptions);
        
        this.circleOptions.fromDegree = this.options.minMaxVal.min;
        this.circleOptions.toDegree = this.options.minMaxVal.max;
        
        this.circleOptions.backgroundColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
        if (!this.circleOptions.backgroundColor)
            this.circleOptions.backgroundColor = '#fff';

        if (this.circle)
            this.circle.update(this.circleOptions);
        else
            this.circle = new Circle(this.circleOptions);
    }

    setEdges() {
        this.edgesOptions = this.common.extend(this.options, this.edgesOptions);
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
}