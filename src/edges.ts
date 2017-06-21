import { EdgesOptions, SideState } from './interfaces';
import { Common } from './common';

export class Edges {
    private leftElement: any;
    private rightElement: any;
    private common: Common;

    static AddToEdge: number = 4;
    static AddToEdgeHeight: number = 4;

    constructor(private options?: EdgesOptions) {
        this.common = new Common();

        this.options = options;

        this.init();
    }

    init() {
        this.leftElement = this.common.jsonToHtml(
            {
                type: 'span',
                attrs: {
                    'style': `display: inline-block;width: ${Edges.AddToEdge}px;position: absolute;z-index: 5;box-sizing: initial;box-sizing: border-box;transition-property: background-color;`,
                    'data-left-edge': ''
                }
            });

        this.rightElement = this.common.jsonToHtml(
            {
                type: 'span',
                attrs: {
                    'style': `display: inline-block;width: ${Edges.AddToEdge}px;position: absolute;z-index: 5;box-sizing: initial;box-sizing: border-box;transition-property: background-color;`,
                    'data-right-edge': ''
                }
            });

        this.updateOptions();
    }

    public update(options: EdgesOptions): void {
        this.options = this.common.extend(this.options, options);
        this.updateOptions();
    }

    updateOptions() {
        this.setSpans(this.options);
    }

    setSpans(options: EdgesOptions) {
        let height = (options.strokeWidth + Edges.AddToEdge + Edges.AddToEdgeHeight) + 'px';
        let top = 'calc(50% - ' + ((options.strokeWidth / 2) + (Edges.AddToEdge / 2) + (Edges.AddToEdgeHeight / 2)) + 'px)';
        let leftStyle = 'calc(50% - ' + (Edges.AddToEdge / 2) + 'px)';

        let bgColor = this.common.getComputedStyleByParentRec(this.leftElement, 'backgroundColor');
        if (!bgColor)
            bgColor = '#fff';

        let left = this.leftElement;
        left.style.height = height;
        left.style.top = top;
        left.style.left = leftStyle;
        left.style.backgroundColor = options.color;
        left.style.transitionDuration = options.animationDuration + 'ms';
        // left.style.transitionDuration = '0ms';
        if (options.hollowEdges == SideState.Left || options.hollowEdges == SideState.Both) {
            left.style.border = 'solid 1px ' + options.color;
            left.style.backgroundColor = bgColor;
            // left.style.height = (options.strokeWidth + (Edges.AddToEdge * 2 - 2)) + 'px';
            // left.style.top = 'calc(50% - ' + ((options.strokeWidth / 2) + Edges.AddToEdge + 1) + 'px)';
        }

        let right = this.rightElement;
        right.style.height = height;
        right.style.top = top;
        right.style.left = leftStyle;
        right.style.backgroundColor = options.color;
        right.style.transitionDuration = options.animationDuration + 'ms';
        // right.style.transitionDuration = '0ms';
        if (options.hollowEdges == SideState.Right || options.hollowEdges == SideState.Both) {
            right.style.border = 'solid 1px ' + options.color;
            right.style.backgroundColor = bgColor;
            // right.style.height = (options.strokeWidth + (Edges.AddToEdge * 2 - 2)) + 'px';
            // right.style.top = 'calc(50% - ' + ((options.strokeWidth / 2) + Edges.AddToEdge + 1) + 'px)';
        }

        let scalar = options.radius - (options.strokeWidth / 2), xVectorLeft, yVectorLeft, xVectorRight, yVectorRight;
        let degLeft = (options.minMaxVal.min - 50) * 3.6;
        let degRight = (options.minMaxVal.max - 50) * 3.6;
        xVectorLeft = Math.sin(degLeft * (Math.PI / 180)) * scalar;
        yVectorLeft = -Math.cos(degLeft * (Math.PI / 180)) * scalar;
        left.style.transform = `translate3d(${xVectorLeft}px, ${yVectorLeft}px, 0) rotate(${degLeft}deg)`;
        xVectorRight = Math.sin(degRight * (Math.PI / 180)) * scalar;
        yVectorRight = -Math.cos(degRight * (Math.PI / 180)) * scalar;
        right.style.transform = `translate3d(${xVectorRight}px, ${yVectorRight}px, 0) rotate(${degRight}deg)`;
    }

    public getLeftElement(): any {
        return this.leftElement;
    }

    public getRightElement(): any {
        return this.rightElement;
    }
}