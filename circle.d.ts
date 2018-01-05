import { CircleOptions } from './interfaces';
export declare class Circle {
    private options;
    private element;
    private common;
    constructor(options: CircleOptions);
    injectCss(): void;
    update(options: CircleOptions): void;
    updateOptions(): void;
    setSvg(options: CircleOptions): void;
    setElements(options: CircleOptions): void;
    init(): void;
    polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): any;
    describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): any;
    getElement(): any;
}
