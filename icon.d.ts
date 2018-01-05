import { IconOptions } from './interfaces';
export declare class Icon {
    private options;
    private element;
    private common;
    constructor(options: IconOptions);
    init(): void;
    update(options: IconOptions): void;
    updateOptions(): void;
    setImage(options: IconOptions): void;
    getElement(): any;
}
