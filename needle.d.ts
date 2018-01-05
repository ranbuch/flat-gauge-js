import { NeedleOptions } from './interfaces';
export declare class Needle {
    private options;
    private element;
    private common;
    constructor(options: NeedleOptions);
    init(): void;
    update(options: NeedleOptions): void;
    updateOptions(): void;
    setDiv(options: NeedleOptions): void;
    getElement(): any;
    setSvg(options: NeedleOptions): void;
}
