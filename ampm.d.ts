import { AmPmOptions } from './interfaces';
export declare class AmPm {
    private element;
    private options;
    private common;
    private circleOptionsAm;
    private circleAm;
    private circleOptionsPm;
    private circlePm;
    private edgesOptionsAm;
    private edgesAm;
    private edgesOptionsPm;
    private edgesPm;
    private needleOptions;
    private needle;
    private minMaxValAm;
    private minMaxValPm;
    private lower;
    private higher;
    constructor(element: any, options?: AmPmOptions);
    setMinutes(): void;
    setNeedle(): void;
    init(): void;
    setNumbers(): void;
    setCircles(): void;
    setEdges(): void;
    update(options: AmPmOptions): void;
    updateOptions(setWrap?: boolean): void;
    setWrap(options: AmPmOptions): void;
    getDefaultOptions(): AmPmOptions;
}
