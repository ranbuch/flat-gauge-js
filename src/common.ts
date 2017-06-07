import { JsonToHtmlElement, RGBA, InnerText, ColorPalette, NeedleOptions, MinMaxVal, FromTo, Time, SideState } from './interfaces';

export class Common {
    static NameSpaceElements: Array<string> = ['svg', 'path', 'g'];
    static xmlns: string = "http://www.w3.org/2000/svg";
    static needleWidthHeightRatio: number = 9.107127839547825;
    extend(src: any, dest: any, copy?: boolean): any {
        for (let i in src) {
            if (typeof src[i] === 'object') {
                if (dest && dest[i])
                    src[i] = this.extend(src[i], dest[i]);
            }
            else if (typeof dest === 'object' && typeof dest[i] !== 'undefined') {
                src[i] = dest[i];
            }
        }
        if (copy)
            return JSON.parse(JSON.stringify(src));
        return src;
    }

    jsonToHtml(obj: JsonToHtmlElement): any {
        let elm = null, isNsElem = Common.NameSpaceElements.filter(x => x == obj.type).length > 0;
        if (isNsElem)
            elm = document.createElementNS(Common.xmlns, obj.type);
        else
            elm = document.createElement(obj.type);
        for (var i in obj.attrs) {
            if (isNsElem)
                elm.setAttributeNS(null, i, obj.attrs[i]);
            else
                elm.setAttribute(i, obj.attrs[i]);
        }
        for (let i in obj.children) {
            let newElem = null;
            if (obj.children[i].type == '#text')
                newElem = document.createTextNode(obj.children[i].text);
            else
                newElem = this.jsonToHtml(obj.children[i]);
            if ((newElem && newElem.tagName && newElem.tagName.toLowerCase() !== 'undefined') || newElem.nodeType == 3)
                elm.appendChild(newElem);
        }
        return elm;
    }

    isHex(str: string): boolean {
        return str.indexOf('#') > -1;
    }

    isRgba(str: string) {
        return str.split(',').length > 3;
    }

    toRgbObj(rgba: string): RGBA {
        let arr = rgba.split(',').map((item) => {
            return parseInt(item, 10);
        });
        return {
            Red: arr[0],
            Green: arr[1],
            Blue: arr[2],
            Alpha: arr[3]
        };
    }

    RgbObjToString(rgba: RGBA): string {
        let ans = '(' + rgba.Red + ',' + rgba.Green + ',' + rgba.Blue;
        if (rgba.Alpha)
            ans += ',' + rgba.Alpha
        ans += ')';
        return ans;
    }

    hexToRgb(hex: string): RGBA {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m: string, r: string, g: string, b: string) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            Red: parseInt(result[1], 16),
            Green: parseInt(result[2], 16),
            Blue: parseInt(result[3], 16)
        } : null;
    }

    setInnerTextDefaults(innerText?: InnerText): InnerText {
        if (!innerText)
            innerText = {
                text: ''
            };
        if (!innerText.text)
            innerText.text = '';
        if (!innerText.fontSize)
            innerText.fontSize = 18;
        if (!innerText.lineHeight)
            innerText.lineHeight = innerText.fontSize;
        if (!innerText.fontFamily)
            innerText.fontFamily = 'Arial,Utkal,sans-serif';
        if (!innerText.fontWeight)
            innerText.fontWeight = 'normal';
        if (!innerText.letterSpacing)
            innerText.letterSpacing = '0';
        return innerText;
    }

    getComputedStyleByParentRec(elem: any, cssProp: string): string {
        if (!elem) return null;
        let css = getComputedStyle(elem) as any;
        let val = css['cssProp'];
        if (val) return val;
        return this.getComputedStyleByParentRec(elem.parentElement, cssProp);
    }

    // odd strokeWidth is not supported
    fixStrokeWidth(sw: number): number {
        if (sw % 2 == 1)
            console.warn('all-gauge: stroke-width "' + sw + '" is not supported (odd), changed to "' + (++sw)) + '"';
        return sw;
    }

    // odd radius is not supported
    fixRadius(r: number): number {
        if (r % 2 == 1)
            console.warn('all-gauge: radius "' + r + '" is not supported (odd), changed to "' + (++r)) + '"';
        return r;
    }

    getDefaultColors(): ColorPalette {
        return {
            active: '#4CCEAD',
            default: '#505050',
            inactive: '#ededed'
        };
    }

    getNeedleInnerStyle(radius: number): any {
        return {
            'height': (radius + 20) + 'px',
            'width': (radius / Common.needleWidthHeightRatio) + 'px'
        };
    }

    getNeedleStyle(radius: number, arcNeedlePercentage: number, scale: number) {
        if (typeof scale !== 'number')
            scale = 1.1;
        let deg = (arcNeedlePercentage - 50) * 3.6;
        return {
            'left': 'calc(50% - ' + ((radius / Common.needleWidthHeightRatio)) / 2 + 'px',
            'transform': 'rotate(' + deg + 'deg) scale(' + scale + ')'
        };
    }

    isInRange(minMaxVal: MinMaxVal, sides: SideState) {
        switch (sides) {
            case SideState.Both: {
                return (minMaxVal.min < minMaxVal.value && minMaxVal.max > minMaxVal.value);
            }
            case SideState.None: {
                return (minMaxVal.min <= minMaxVal.value && minMaxVal.max >= minMaxVal.value);
            }
            case SideState.Left: {
                return (minMaxVal.min < minMaxVal.value && minMaxVal.max >= minMaxVal.value);
            }
            case SideState.Right: {
                return (minMaxVal.min <= minMaxVal.value && minMaxVal.max > minMaxVal.value);
            }
        }    
    }

    normalizeByPercentage(value: number, percentage: number, mid?: number, max?: number): number {
        if (typeof mid === 'undefined')
            mid = 50;
        if (typeof max === 'undefined')
            max = mid * 2;
        let rel = null;

        if (value > mid) {
            percentage /= 2;
            rel = Math.abs(mid - value);
            rel = rel / mid;
            percentage *= rel;
            return value * (1 - percentage);
        }
        else {
            if (value == 0.0)
                value = 0.001;
            rel = Math.abs(value - mid);
            rel = rel / mid;
            percentage *= rel;
            return value + (mid * (percentage));
        }
    }

    getRemainder(range: FromTo, hour: number) {
        let current = 100 / 12 * hour;
        if (current >= range.from && current <= range.to) {
            return current - range.from;
        }
        return 0;
    }

    isHourInRange(range: FromTo, hour: number): boolean {
        let current = 100 / 12 * hour;
        if (current >= range.from && current <= range.to) return true;
        return false;
    }

    getMinutesFromHour(hour: string) {
        let arr = hour.split(':');
        return parseInt(arr[0].trim()) * 60 + parseInt(arr[1].trim());
    }

    getMinutesFromStart(hour: string, start = 0) {
        let arr = hour.split(':');
        return Math.max((parseInt(arr[0].trim()) * 60 + (parseInt(arr[1].trim()))) - start, 0);
    }

    getHoursAndMinutesLT(date: Date): string {
        let hours = date.getHours();
        hours = (hours + 24 - 2) % 24;
        let mid = 'am';
        if (hours == 0) { //At 00 hours we need to show 12 am
            hours = 12;
        }
        else if (hours > 12) {
            hours = hours % 12;
            mid = 'pm';
        }
        return hours + ':' + date.getMinutes() + ' ' + mid;
    }

    getSecondsFromTime(timer: Time): number {
        let hours = 0;
        hours += timer.hours * 3600;
        hours += timer.minutes * 60;
        hours += timer.seconds;
        return hours;
    }

    setTimeToZero(timer: Time): void {
        timer.hours = 0;
        timer.minutes = 0;
        timer.seconds = 0;
    }

    decreaseTime(timer: Time): boolean {
        if (timer.seconds > 0) {
            if (--timer.seconds < 0) {
                timer.seconds = 59;
                if (--timer.minutes < 0) {
                    timer.minutes = 59;
                    if (--timer.hours < 0) {
                        this.setTimeToZero(timer);
                        return true;
                    }
                }
            }
        }
        else if (timer.minutes > 0) {
            timer.seconds = 59;
            if (--timer.minutes < 0) {
                timer.minutes = 59;
                if (--timer.hours < 0) {
                    this.setTimeToZero(timer);
                    return true;
                }
            }
        }
        else if (timer.hours > 0) {
            timer.minutes = 59;
            if (--timer.hours < 0) {
                this.setTimeToZero(timer);
                return true;
            }
        }
        else if (this.isTimeZero(timer)) {
            this.setTimeToZero(timer);
            return true;
        }
        return false;
    }

    isTimeZero(timer: Time): boolean {
        if (timer.hours <= 0 && timer.minutes <= 0 && timer.seconds <= 0) return true;
        return false;
    }

    padWithZiro(text: string) {
        if (String(text).length < 2)
            text = '0' + text;
        return text;
    }

    getSideStateByString(state: string): SideState {
        if (!state) return SideState.None;
        switch (state.toLowerCase()) {
            case 'left':
                return SideState.Left;
            case 'right':
                return SideState.Right;
            case 'both':
                return SideState.Both;
            case 'none':
                return SideState.None;
            default:
                return SideState.None
        }
    }
}