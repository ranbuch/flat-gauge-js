export interface ColorPalette {
    default: string;
    active: string;
    inactive: string;
}

export interface CircleOptions {
    colors?: ColorPalette;
    fromDegree?: number;
    toDegree?: number;
    radius?: number;
    strokeWidth?: number;
    rotationSpeed?: number;
    animationDuration?: number;
    backgroundColor?: string;
    hideBottom: boolean;
}

export interface SpinnerOptions {
    colors?: ColorPalette;
    activeDegree?: number;
    radius?: number;
    strokeWidth?: number;
    rotationSpeed?: number;
    title?: InnerText;
    animationDuration?: number;
    highlight?: boolean;
}

export interface InnerText {
    text: string;
    fontSize?: number;
    fontFamily?: string;
    lineHeight?: number;
    fontWeight?: string;
    letterSpacing?: string;
}

export interface JsonToHtmlElement {
    type: string;
    text?: string;
    attrs?: any;
    children?: Array<JsonToHtmlElement>;
}

export interface RGBA {
    Red: number;
    Green: number;
    Blue: number;
    Alpha?: number;
}

export interface MinMaxVal {
    min: number;
    max: number;
    value: number;
}

export interface NeedleOptions {
    color: string;
    minMaxVal: MinMaxVal;
    radius: number;
    scale: number;
    animationDuration?: number;
}

export interface TuneOptions {
    needleOptions?: NeedleOptions;
    iconOptions?: IconOptions;
    colors?: ColorPalette;
    strokeWidth?: number;
    // title?: InnerText;
    animationDuration?: number;
    radius: number;
    showEdges: boolean;
    hollowEdges?: SideState;
    showIcon: boolean;
    hideBottom: boolean;
}

export interface RangeOptions {
    colors?: ColorPalette;
    minMaxVal: MinMaxVal;
    strokeWidth?: number;
    animationDuration?: number;
    radius: number;
    showEdges: boolean;
    hollowEdges?: SideState;
    hideBottom: boolean;
    title?: InnerText;
    highlight?: boolean;
}

export enum SideState {
    None,
    Left,
    Right,
    Both,
}

export interface EdgesOptions {
    color: string;
    minMaxVal: MinMaxVal;
    radius: number;
    strokeWidth: number;
    animationDuration?: number;
    hollowEdges?: SideState;
}

export interface IconOptions {
    degree: number;
    radius: number;
    animationDuration?: number;
    src: string;
    dimensions: {
        width: number;
        height: number;
    },
    top?: number;
    left?: number;
    opacity: number;
}

export interface NumberData {
        number: string;
        isActive: boolean;
        remainder: number;
    }

export interface AmPmOptions {
    fromTo: FromToString;
    needleOptions?: NeedleOptions;
    colors?: ColorPalette;
    radius: number;
    minMaxValAm?: MinMaxVal;
    minMaxValPm?: MinMaxVal;
    animationDuration?: number;
    strokeWidth?: number;
    hollowEdgesAm?: SideState;
    hollowEdgesPm?: SideState;
}

export interface FromTo {
        from: number;
        to: number;
    }

export interface FromToString {
    from: string;
    to: string;
}

export interface Time {
    hours: number,
    minutes: number,
    seconds: number,
}

export interface TimerOptions {
    colors?: ColorPalette;
    strokeWidth?: number;
    time: Time;
    animationDuration?: number;
    radius: number;
    showEdges: boolean;
    title?: InnerText;
    percentage?: number;
}