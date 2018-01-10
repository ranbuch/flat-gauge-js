import { JsonToHtmlElement, RGBA, InnerText, ColorPalette, MinMaxVal, FromTo, Time, SideState } from './interfaces';
export declare class Common {
    static NameSpaceElements: Array<string>;
    static xmlns: string;
    static needleWidthHeightRatio: number;
    extend(src: any, dest: any, copy?: boolean): any;
    jsonToHtml(obj: JsonToHtmlElement): any;
    isHex(str: string): boolean;
    isRgba(str: string): boolean;
    toRgbObj(rgba: string): RGBA;
    RgbObjToString(rgba: RGBA): string;
    hexToRgb(hex: string): RGBA;
    setInnerTextDefaults(innerText?: InnerText): InnerText;
    getComputedStyleByParentRec(elem: any, cssProp: string): string;
    fixStrokeWidth(sw: number): number;
    fixRadius(r: number): number;
    getDefaultColors(): ColorPalette;
    getNeedleInnerStyle(radius: number): any;
    getNeedleStyle(radius: number, arcNeedlePercentage: number, scale: number, indent?: number): {
        'left': string;
        'transform': string;
    };
    isInRange(minMaxVal: MinMaxVal, sides: SideState): boolean;
    normalizeByPercentage(value: number, percentage: number, mid?: number, max?: number): number;
    getRemainder(range: FromTo, hour: number): number;
    isHourInRange(range: FromTo, hour: number): boolean;
    getPercentageByTime(dateTime: Date): number;
    getMinutesFromHour(hour: string): number;
    getMinutesFromStart(hour: string, start?: number): number;
    getHoursAndMinutesLT(date: Date): string;
    getSecondsFromTime(timer: Time): number;
    setTimeToZero(timer: Time): void;
    decreaseTime(timer: Time): boolean;
    isTimeZero(timer: Time): boolean;
    padWithZiro(text: string): string;
    getSideStateByString(state: string): SideState;
}
