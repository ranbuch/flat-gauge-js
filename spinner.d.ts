import { SpinnerOptions } from './interfaces';
export declare class Spinner {
    private element;
    private options;
    private circleOptions;
    private common;
    private circle;
    constructor(element: any, options?: SpinnerOptions);
    getDefaultOptions(): SpinnerOptions;
    update(options: SpinnerOptions): void;
    updateOptions(): void;
    setTitle(options: SpinnerOptions): void;
    setDiv(options: SpinnerOptions): void;
    init(): void;
    setCircle(): void;
}
