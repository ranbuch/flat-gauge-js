import { TuneOptions } from './interfaces';
export declare class Tune {
    private element;
    private options;
    private common;
    private circleOptions;
    private circle;
    private needleOptions;
    private needle;
    private edgesOptions;
    private edges;
    private iconOptions;
    private icon;
    constructor(element: any, options?: TuneOptions);
    fixOptions(): void;
    init(): void;
    update(options: TuneOptions): void;
    updateOptions(setWrap?: boolean): void;
    setWrap(options: TuneOptions): void;
    getDefaultOptions(): TuneOptions;
    setCircle(): void;
    setNeedle(): void;
    setEdges(): void;
    setIcon(): void;
}
