import { AmPmOptions, CircleOptions, NeedleOptions, JsonToHtmlElement, EdgesOptions, NumberData, FromTo } from './interfaces';
import { Common } from './common';
import { Circle } from './circle';
import { Needle } from './needle';
import { Edges } from './edges';

export class AmPm {
    private element: any;
    private options: AmPmOptions;
    private common: Common;
    private circleOptionsAm: CircleOptions;
    private circleAm: Circle;
    private circleOptionsPm: CircleOptions;
    private circlePm: Circle;
    private edgesOptionsAm: EdgesOptions;
    private edgesAm: Edges;
    private edgesOptionsPm: EdgesOptions;
    private edgesPm: Edges;
    private needleOptions: NeedleOptions;
    private needle: Needle;
    // private amNumbers: Array<NumberData>;
    // private pmNumbers: Array<NumberData>;
    private minMaxValAm: FromTo;
    private minMaxValPm: FromTo;
    private lower: Array<NumberData>;
    private higher: Array<NumberData>;

    constructor(element: any, options?: AmPmOptions) {
        this.element = element;
        this.common = new Common();
        // set default options
        let defaultOptions = this.getDefaultOptions();

        // override defaults with user options
        this.options = this.common.extend(defaultOptions, options);

        this.setMinutes();

        this.init();
    }

    setMinutes() {
        let arrFrom = this.options.fromTo.from.split(':');
        let arrTo = this.options.fromTo.to.split(':');
        let fromMinutes = 0, toMinutes = 0, from = null, to = null;

        if (parseInt(arrFrom[0]) <= 12 || parseInt(arrTo[0]) <= 12) {
            fromMinutes = this.common.getMinutesFromHour(this.options.fromTo.from);
        }

        if (parseInt(arrFrom[0]) >= 12 || parseInt(arrTo[0]) >= 12) {
            toMinutes = this.common.getMinutesFromHour(this.options.fromTo.to);
        }
        
        let max = 60 * 12;
        if (fromMinutes > 0) {
            from = this.common.getMinutesFromStart(this.options.fromTo.from, 0);
            to = this.common.getMinutesFromStart(this.options.fromTo.to, 0);
                
            this.minMaxValAm = {
                from: from / max * 100,
                to: Math.min(to / max * 100, 100)
            } as FromTo;
        }

        if (toMinutes > 0) {
            from = this.common.getMinutesFromStart(this.options.fromTo.from, 60 * 12);
            to = this.common.getMinutesFromStart(this.options.fromTo.to, 60 * 12);
            
            this.minMaxValPm = {
                from: from / max * 100,
                to: Math.min(to / max * 100, 100)
            } as FromTo;
        }
        
        this.lower = [];
        this.higher = [];

        this.lower.push({
            number: '00',
            isActive: this.common.isHourInRange(this.minMaxValAm, 0),
            remainder: this.common.getRemainder(this.minMaxValAm, 0)
        });
        for (let i = 1; i < 24; i++) {
            if (i < 12) {
                this.lower.push({
                    number: i.toString(),
                    isActive: this.common.isHourInRange(this.minMaxValAm, i),
                    remainder: this.common.getRemainder(this.minMaxValAm, i)
                });
            }
            else {
                this.higher.push({
                    number: i.toString(),
                    isActive: this.common.isHourInRange(this.minMaxValPm, i - 12),
                    remainder: this.common.getRemainder(this.minMaxValAm, i - 12)
                });
            }
        }

        this.setNeedle();
        setTimeout(() => {
            this.setMinutes();
        }, 60000);
    }

    setNeedle() {
        
        let now = this.common.getHoursAndMinutesLT(new Date());

        let isAm = now.indexOf('AM') > -1;

        let relevantHours = isAm ? this.lower : this.higher;

        // let diameterForNeedle = isAm ? (this.options.radius * 2) - 20 : this.options.radius * 2;

        this.needleOptions = this.common.extend(this.options.needleOptions, this.needleOptions);
        if (this.edgesOptionsAm && this.edgesOptionsPm)
            this.needleOptions.color = this.common.isInRange(this.options.needleOptions.minMaxVal, (isAm ? this.edgesOptionsAm.hollowEdges : this.edgesOptionsPm.hollowEdges)) ? this.options.colors.active : this.options.colors.default;
        if (this.options.needleOptions.minMaxVal.value > 100 || this.options.needleOptions.minMaxVal.value < 0)
            this.needleOptions.color = this.options.colors.inactive;

        for (let i = 0; i < relevantHours.length; i++) {
            if (relevantHours[i].isActive) {
                let current = (i * (100 / 12)) + relevantHours[i].remainder;
                if (this.needleOptions.minMaxVal.min === null)
                    this.needleOptions.minMaxVal.min = current;
                this.needleOptions.minMaxVal.max = current;
            }
        }

        if (this.needle)
            this.needle.update(this.needleOptions);
        else
            this.needle = new Needle(this.needleOptions);
            
            // this.needle = {
            //     minMaxVal: {
            //         min: null,
            //         max: null,
            //         value: this.piService.getCurrentTimePercentage()
            //     },
            //     color: null
            // };
        
        

        // this.needleStyleInner = this.common.getNeedleInnerStyle(this.diameter);
        // this.needleStyle = this.piService.getStyleByPercentage(this.diameter, this.niddle.minMaxVal.value, isAm);
        // this.needle.color = this.piService.getColor(this.niddle);
    }

    // initNumbers(numbers: Array<NumberData>) {
    //     numbers.push({
    //         number: '00',
    //         isActive: this.common.isHourInRange(this.minMaxValAm, 0),
    //         remainder: this.common.getRemainder(this.minMaxValAm, 0)
    //     });
    //     numbers.push({

    //     });
    //     // this.amNumbers.
    // }

    init() {
        // this.amNumbers = [];
        // this.initNumbers(this.amNumbers);

        let innerElem = this.common.jsonToHtml({
            type: 'div',
            attrs: {
                'style': 'position: relative;',
                'data-ampm': ''
            },
            children: [
                {
                    type: 'div',
                    attrs: {
                        'data-am-wrap': '',
                        'style': 'position: absolute'
                    }
                },
                {
                    type: 'div',
                    attrs: {
                        'data-pm-wrap': '',
                        'style': 'position: absolute'
                    }
                },
                {
                    type: 'div',
                    attrs: {
                        'data-needle-wrap': '',
                        'style': 'position: absolute'
                    }
                }
            ]
        });

        let amWrap = {
            type: 'div',
            attrs: {
                style: 'position: absolute;height: 60px;top: 65px;left: 105px;color: #CBCBCB;font-size: 16px;z-index: 30',
                'data-am-numbers': ''
            },
            children: []
        } as JsonToHtmlElement;
        for (let i = 0; i < this.lower.length; i++) {
            amWrap.children.push({
                type: 'span',
                attrs: {
                    'style': `height: 100%;position: absolute;width: 20px;left: 0;top: 0;transform-origin: bottom center;text-align: center;transform: rotate(${i * 30}deg);`,
                    'data-num': i
                },
                children: [
                    {
                        type: 'span',
                        attrs: {
                            'style': `transform: rotate(-${i * 30}deg);display: block;`
                        },
                        children: [
                            {
                                type: '#text',
                                text: this.lower[i].number
                            }
                        ]
                    }
                ]
            });
        }

        let pmWrap = {
            type: 'div',
            attrs: {
                style: 'position: absolute;height: 110px;color: #CBCBCB;font-size: 16px;',
                'data-pm-numbers': ''
            },
            children: []
        } as JsonToHtmlElement;
        for (let i = 0; i < this.higher.length; i++) {
            pmWrap.children.push({
                type: 'span',
                attrs: {
                    'style': `height: 100%;position: absolute;width: 20px;left: 0;top: 0;transform-origin: bottom center;text-align: center;transform: rotate(${i * 30}deg);`,
                    'data-num': i
                },
                children: [
                    {
                        type: 'span',
                        attrs: {
                            'style': `transform: rotate(-${i * 30}deg);display: block;`
                        },
                        children: [
                            {
                                type: '#text',
                                text: this.higher[i].number
                            }
                        ]
                    }
                ]
            });
        }

        this.updateOptions(false);

        innerElem.querySelector('[data-am-wrap]').appendChild(this.common.jsonToHtml(amWrap));
        innerElem.querySelector('[data-am-wrap]').appendChild(this.circleAm.getElement());
        innerElem.querySelector('[data-am-wrap]').appendChild(this.edgesAm.getLeftElement());
        innerElem.querySelector('[data-am-wrap]').appendChild(this.edgesAm.getRightElement());

        innerElem.querySelector('[data-pm-wrap]').appendChild(this.common.jsonToHtml(pmWrap));
        innerElem.querySelector('[data-pm-wrap]').appendChild(this.circlePm.getElement());
        innerElem.querySelector('[data-pm-wrap]').appendChild(this.edgesPm.getLeftElement());
        innerElem.querySelector('[data-pm-wrap]').appendChild(this.edgesPm.getRightElement());

        
        innerElem.querySelector('[data-needle-wrap]').appendChild(this.needle.getElement());
        

        this.element.appendChild(innerElem);

        this.updateOptions(true);
    }

    setNumbers() {
        let pmNumbers = this.element.querySelector('[data-pm-numbers]');
        if (!pmNumbers) return;
        pmNumbers.style.left = (((this.options.radius * 2) / 1.67) - 30) + 'px';
        pmNumbers.style.top = '-20px';
    }

    setCircles() {
        let setCircle = (prefix: string) => {
            this['circleOptions' + prefix] = this.common.extend(this.options, this['circleOptions' + prefix], true);
        
            this['circleOptions' + prefix].fromDegree = this.options.needleOptions.minMaxVal.min;
            this['circleOptions' + prefix].toDegree = this.options.needleOptions.minMaxVal.max;
            
            this['circleOptions' + prefix].backgroundColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
            if (!this['circleOptions' + prefix].backgroundColor)
                this['circleOptions' + prefix].backgroundColor = '#fff';

            if (prefix == 'Am')
                this['circleOptions' + prefix].radius = this.options.radius - (this.options.strokeWidth);

            if (this['circle' + prefix]) {
                this['circle' + prefix].update(this['circleOptions' + prefix]);
            }
            else
                this['circle' + prefix] = new Circle(this['circleOptions' + prefix]);
        };

        setCircle('Am');
        setCircle('Pm');
    }

    setEdges() {
        let setEdge = (prefix: string) => {
            this['edgesOptions' + prefix] = this.common.extend(this.options.needleOptions, this['edgesOptions' + prefix], true);
            this['edgesOptions' + prefix].strokeWidth = this.options.strokeWidth;
            this['edgesOptions' + prefix].color = this.options.colors.active;
            this['edgesOptions' + prefix].hollowEdges = this.options['hollowEdges' +  + prefix];
            
            if (this['edges' + prefix])
                this['edges' + prefix].update(this['edgesOptions' + prefix]);
            else
                this['edges' + prefix] = new Edges(this['edgesOptions' + prefix]);
            let left = this.element.querySelector('[data-left-edge]');
            let right = this.element.querySelector('[data-right-edge]');
            if (left && right) {
                if (!this.options['showEdges' + prefix]) {
                    left.style.display = 'none';
                    right.style.display = 'none';
                }
                else {
                    left.style.display = 'inline-block';
                    right.style.display = 'inline-block';
                }
            }
        }

        setEdge('Am');
        setEdge('Pm');
    }

    public update(options: AmPmOptions): void {
        this.options = this.common.extend(this.options, options);
        this.updateOptions(true);
    }

    updateOptions(setWrap?: boolean): void {
        if (setWrap)
            this.setWrap(this.options);
        this.setCircles();
        this.setNeedle();
        this.setNumbers();
        this.setEdges();
        this.setNeedle();
    }

    setWrap(options: AmPmOptions) {
        let wrap = this.element;
        let dim = (options.radius * 2) + 'px';
        wrap.style.width = dim;
        wrap.style.height = dim;
        wrap.style.position = 'relative';
        let topLeftDim = (options.radius / 3.5) + 'px';

        let amWrap = wrap.querySelector('[data-am-wrap]');
        amWrap.style.top = ((options.radius / 3.5) + (options.strokeWidth * 2)) + 'px';
        amWrap.style.left = ((options.radius / 3.5) + (options.strokeWidth * 2)) + 'px';
        amWrap.style.zIndex = '20';
        // let amCircle = amWrap.querySelector('[data-circle]')
        let amNumbers = amWrap.querySelector('[data-am-numbers');
        amNumbers.style.top = (options.strokeWidth * 3) + 'px';
        amNumbers.style.left = (options.radius - options.strokeWidth * 3) + 'px';
        
        let pmWrap = wrap.querySelector('[data-pm-wrap]');
        // let pmCircle = pmWrap.querySelector('[data-circle]')
        pmWrap.style.top = topLeftDim;
        pmWrap.style.left = topLeftDim;
        

        
        let nWrap = wrap.querySelector('[data-needle-wrap]');
        nWrap.style.top = topLeftDim;
        nWrap.style.left = ((options.radius / 3.5) + options.radius) + 'px';
        
        
        
    }

    getDefaultOptions(): AmPmOptions {
        let animationDuration = 500, radius = 88;
        let colors = this.common.getDefaultColors();
        return {
            fromTo: {
                from: '3:52',
                to: '14:20'
            },
            radius: radius,
            colors: colors,
            strokeWidth: 6,
            animationDuration: animationDuration,
            needleOptions: {
                animationDuration: animationDuration,
                color: colors.active,
                radius: radius,
                scale: 1.1,
                minMaxVal: {
                    max: 3,
                    min: 14,
                    value: 14
                }
            }
        };
    }
}
