import { TimerOptions } from './interfaces';
export declare class Timer {
    private element;
    private options;
    private common;
    private circleOptions;
    private circle;
    private edgesOptions;
    private edges;
    private fullSeconds;
    private isRunning;
    private lastInterval;
    constructor(element: any, options?: TimerOptions);
    fixOptions(): void;
    init(): void;
    update(options: TimerOptions): void;
    updatePercentage(): void;
    updateTimer(): void;
    updateOptions(setWrap?: boolean): void;
    setEdges(): void;
    setWrap(options: TimerOptions): void;
    setTitle(options: TimerOptions): void;
    getDefaultOptions(): TimerOptions;
    setCircle(): void;
    pause(): void;
    play(): void;
}
