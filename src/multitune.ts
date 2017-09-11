import { MultituneOptions, CircleOptions, NeedleOptions, JsonToHtmlElement, EdgesOptions, IconOptions, SideState } from './interfaces';
import { Common } from './common';
import { Circle } from './circle';
import { Needle } from './needle';
import { Edges } from './edges';
import { Icon } from './icon';

export class MultiTune {
    private element: any;
    private options: MultituneOptions;
    private common: Common;
    private circlesOptions: Array<CircleOptions>;
    private circles: Array<Circle>;
    private needleOptions: NeedleOptions;
    private needle: Needle;
    private edgesOptions: EdgesOptions;
    private edges: Edges;
    private iconOptions: IconOptions;
    private icon: Icon;
    constructor(element: any, options?: MultituneOptions) {
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
        let obj = {
            type: 'div',
            attrs: {
                'data-multi-tune': ''
            }
        } as JsonToHtmlElement;

        let innerElem = this.common.jsonToHtml(obj);

        this.updateOptions(false);

        // this.extractEdgesFromCircles();

        for (let i = 0; i < this.circles.length; i++) {
            let c =  this.circles[i].getElement();
            innerElem.appendChild(c);
            if (i == 1) {
                c.style.position = 'absolute';
                c.style.top= '0';
            }
            // innerElem.appendChild(this.edges[i].getLeftElement());
            // innerElem.appendChild(this.edges[i].getRightElement());
        }
        
        innerElem.appendChild(this.edges.getLeftElement());
        innerElem.appendChild(this.edges.getRightElement());
        innerElem.appendChild(this.needle.getElement());
        innerElem.appendChild(this.icon.getElement());

        this.element.appendChild(innerElem);

        this.updateOptions(true);
    }

    public update(options: MultituneOptions): void {
        this.options = this.common.extend(this.options, options);
        this.fixOptions();
        this.updateOptions(true);
    }

    // extractEdgesFromCircles() {
    // this.edges = [];
    // this.edgesOptions = [];
    // for (let i = 0; i < this.circles.length; i++) {
    //     this.edgesOptions[i].hollowEdges = SideState.Both;
    //     this.edgesOptions[i] = this.common.extend(this.options.needleOptions, this.edgesOptions);
    //     this.edgesOptions = this.common.extend(this.options.needleOptions, this.edgesOptions);
    //     this.edgesOptions.strokeWidth = this.options.strokeWidth;
    //     this.edgesOptions.color = this.options.colors.active;
    //     this.edgesOptions.hollowEdges = this.options.hollowEdges;
    //     this.edgesOptions.backgroundColor = this.options.hollowEdgesBgColor;

    // }
    // this.circles.forEach((c) => {




    //     this.edges = new Edges(this.edgesOptions);
    //     this.edgesOptions.push({

    //     });
    //     innerElem.appendChild(c.getElement());
    // });
    // }

    updateOptions(setWrap?: boolean): void {
        if (setWrap)
            this.setWrap(this.options);
        this.setCircles();
        this.setNeedle();
        this.setEdges();
        this.setIcon();
    }

    setWrap(options: MultituneOptions) {
        let wrap = this.element;
        let dim = (options.radius * 2) + 'px';
        wrap.style.width = dim;
        wrap.style.height = dim;
        wrap.style.position = 'relative';
    }

    getDefaultOptions(): MultituneOptions {
        let colors = this.common.getDefaultColors();
        let defRadius = 88, animationDuration = 500, bgColor = '#ffffff';
        return {
            needleOptions: {
                minMaxVal: {
                    min: 30,
                    max: 70,
                    value: 55
                },
                color: colors.active,
                scale: 1.125,
                radius: defRadius,
                animationDuration: animationDuration,
                disabled: false
            },
            segments: [
                {
                    // minMaxVal: {
                    min: 0,
                    max: 37.5
                    // }
                    // ,
                    // leftEdges: SinngleSideState.None,
                    // rightEdges: SinngleSideState.Hollow,
                    // bgColor: bgColor
                },
                {
                    // minMaxVal: {
                    min: 62.5,
                    max: 100
                    // },
                    // leftEdges: SinngleSideState.Hollow,
                    // rightEdges: SinngleSideState.None,
                    // bgColor: bgColor
                }
            ],
            iconOptions: {
                animationDuration: animationDuration,
                degree: 50,
                radius: defRadius,
                radiusOffset: 0,
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
            hideBottom: true,
            backgroundColor: bgColor,
            hollowEdgesBgColor: bgColor
        } as MultituneOptions;
    }

    setCircles() {
        let exist = true;
        if (!(this.circles instanceof Array)) {
            exist = false;
            this.circles = [];
            this.circlesOptions = [];
        }
        for (let i = 0; i < this.options.segments.length; i++) {
            if (exist)
                this.circlesOptions[i] = this.common.extend(this.options, this.circlesOptions[i]);
            else
                this.circlesOptions[i] = this.common.extend(this.options, {});
            

            if (i == 0) {
                this.circlesOptions[i].fromDegree = 0;
                this.circlesOptions[i].toDegree = this.options.needleOptions.minMaxVal.min;
            }
            if (i == 1) {
                this.circlesOptions[i].fromDegree = this.options.needleOptions.minMaxVal.max;
                this.circlesOptions[i].toDegree = 100;
            }
            

            this.circlesOptions[i].backgroundColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
            if (!this.circlesOptions[i].backgroundColor)
                this.circlesOptions[i].backgroundColor = '#fff';

            if (exist)
                this.circles[i].update(this.circlesOptions[i]);
            else
                this.circles[i] = new Circle(this.circlesOptions[i]);
        }
    }

    setNeedle() {
        this.needleOptions = this.common.extend(this.options.needleOptions, this.needleOptions);
        if (!this.options.needleOptions.color)
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
        this.edgesOptions.backgroundColor = this.options.hollowEdgesBgColor;

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
            if (!this.options.showIcon || !this.iconOptions.src)
                image.style.display = 'none';
            else
                image.style.display = 'inline-block';
        }
    }
}