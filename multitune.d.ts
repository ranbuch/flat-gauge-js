import { MultituneOptions } from './interfaces';
export declare class MultiTune {
    private element;
    private options;
    private common;
    private circlesOptions;
    private circles;
    private needleOptions;
    private needle;
    private edgesOptions;
    private edges;
    private iconOptions;
    private icon;
    constructor(element: any, options?: MultituneOptions);
    fixOptions(): void;
    init(): void;
    update(options: MultituneOptions): void;
    updateOptions(setWrap?: boolean): void;
    setWrap(options: MultituneOptions): void;
    getDefaultOptions(): MultituneOptions;
    setCircles(): void;
    setNeedle(): void;
    setEdges(): void;
    setIcon(): void;
}
