import { EdgesOptions } from './interfaces';
export declare class Edges {
    private options;
    private leftElement;
    private rightElement;
    private common;
    static AddToEdge: number;
    static AddToEdgeHeight: number;
    constructor(options?: EdgesOptions);
    getDefaultOptions(): EdgesOptions;
    init(): void;
    update(options: EdgesOptions): void;
    updateOptions(): void;
    setSpans(options: EdgesOptions): void;
    getLeftElement(): any;
    getRightElement(): any;
}
