import { RangeOptions } from './interfaces';
export declare class Range {
    private element;
    private options;
    private common;
    private circleOptions;
    private circle;
    private edgesOptions;
    private edges;
    constructor(element: any, options?: RangeOptions);
    fixOptions(): void;
    init(): void;
    update(options: RangeOptions): void;
    updateOptions(setWrap?: boolean): void;
    setTitle(options: RangeOptions): void;
    setWrap(options: RangeOptions): void;
    getDefaultOptions(): RangeOptions;
    setCircle(): void;
    setEdges(): void;
}
