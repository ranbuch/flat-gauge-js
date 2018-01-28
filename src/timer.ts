import { TimerOptions, JsonToHtmlElement, CircleOptions, EdgesOptions } from './interfaces';
import { Common } from './common';
import { Circle } from './circle';
import { Edges } from './edges';

export class Timer {
    private element: any;
    private options: TimerOptions;
    private common: Common;
    private circleOptions: CircleOptions;
    private circle: Circle;
    private edgesOptions: EdgesOptions;
    private edges: Edges;
    private fullSeconds: number;
    constructor(element: any, options?: TimerOptions) {
        this.element = element;
        this.common = new Common();
        // set default options
        let defaultOptions = this.getDefaultOptions();

        // override defaults with user options
        this.options = this.common.extend(defaultOptions, options);

        this.options.title = this.common.setInnerTextDefaults(this.options.title);

        this.fixOptions();

        this.init();
    }

    fixOptions() {
        this.options.strokeWidth = this.common.fixStrokeWidth(this.options.strokeWidth);
        this.options.radius = this.common.fixRadius(this.options.radius);
    }

    init() {
        let currentSeconds = this.common.getSecondsFromTime(this.options.time);
        this.fullSeconds = currentSeconds * 100 / this.options.percentage;

        let h4 = {
            type: 'h4',
            attrs: {
                'style': 'position: absolute;z-index: 10;text-align: center;width: 100%;top: 50%;transform: translateY(-50%);transition-property: color;left: 0; margin: 0;'
            },
            children: [
                {
                    type: 'div',
                    attrs: {
                        'data-clock': ''
                    },
                    children: [
                        {
                            type: 'span',
                            attrs: {
                                'data-number': ''
                            }
                        },
                        {
                            type: 'span',
                            children: [
                                {
                                    type: '#text',
                                    text: ':'
                                }
                            ]
                        },
                        {
                            type: 'span',
                            attrs: {
                                'data-number': ''
                            }
                        },
                        {
                            type: 'span',
                            children: [
                                {
                                    type: '#text',
                                    text: ':'
                                }
                            ]
                        },
                        {
                            type: 'span',
                            attrs: {
                                'data-number': ''
                            }
                        }
                    ]
                },
                {
                    type: 'div',
                    attrs: {
                        'data-text': ''
                    }
                }
            ]
        } as JsonToHtmlElement;
        let h4Elem = this.common.jsonToHtml(h4) as any;

        let obj = {
            type: 'div',
            attrs: {
                'style': `position: relative;`,
                'data-spinner': ''
            }
        } as JsonToHtmlElement;
        let innerElem = this.common.jsonToHtml(obj);

        this.updateOptions(false);

        innerElem.appendChild(h4Elem);

        innerElem.appendChild(this.circle.getElement());
        innerElem.appendChild(this.edges.getLeftElement());
        innerElem.appendChild(this.edges.getRightElement());

        this.element.appendChild(innerElem);

        this.updateOptions(true);

        setTimeout(() => {
            this.updateTimer();
        }, 1000);
    }

    public update(options: TimerOptions): void {
        this.options = this.common.extend(this.options, options);
        this.fixOptions();
        // this.fixOptions();
        this.updateOptions(true);
    }

    updatePercentage() {
        this.options.percentage = this.common.getSecondsFromTime(this.options.time) / this.fullSeconds * 100;
        if (isNaN(this.options.percentage) || this.options.percentage < 0)
            this.options.percentage = 0;
    }

    updateTimer() {
        this.updatePercentage();
        if (this.common.decreaseTime(this.options.time)) {
            // TODO time is up!
            // this.status = 'Time is up!';
            // return this.mode = '';
        }
        else if (this.element.parentElement) { // check if element is still in DOM
            setTimeout(() => {
                this.updateTimer();
            }, 1000);
        }
        this.updateOptions(true);
    }

    updateOptions(setWrap?: boolean): void {
        if (setWrap) {
            this.setWrap(this.options);
            this.setTitle(this.options);
        }
        this.setCircle();
        this.setEdges();
    }

    setEdges() {
        this.edgesOptions = this.common.extend(this.options, this.edgesOptions);
        this.edgesOptions.minMaxVal = {
            min: this.circleOptions.fromDegree,
            max: this.circleOptions.toDegree,
            value: this.options.percentage
        }
        this.edgesOptions.strokeWidth = this.options.strokeWidth;
        this.edgesOptions.color = this.options.colors.active;

        if (this.edges)
            this.edges.update(this.edgesOptions);
        else
            this.edges = new Edges(this.edgesOptions);
        let left = this.element.querySelector('[data-left-edge]');
        let right = this.element.querySelector('[data-right-edge]');
        if (left && right) {
            if (!this.options.showEdges) {
                left.style.display = 'none';
                right.style.display = 'none';
            }
            else {
                left.style.display = 'inline-block';
                right.style.display = 'inline-block';
            }
        }
    }

    setWrap(options: TimerOptions) {
        let wrap = this.element;
        let dim = (options.radius * 2) + 'px';
        wrap.style.width = dim;
        wrap.style.height = dim;
        wrap.style.position = 'relative';
    }

    setTitle(options: TimerOptions) {
        let h4 = this.element.querySelector('h4');
        h4.style.color = options.percentage == 0 ? options.colors.active : options.colors.default;
        // h4.style.top = ((options.radius) - (options.title.fontSize / 2)) + 'px';
        h4.style.top = '50%';
        h4.style.transitionDuration = options.animationDuration + 'ms';
        h4.style.fontSize = options.title.fontSize + 'ms';
        h4.style.fontFamily = options.title.fontFamily;
        h4.style.fontWeight = options.title.fontWeight;
        h4.style.letterSpacing = options.title.letterSpacing;
        h4.style.lineHeight = options.title.lineHeight + 'px';
        let spans = h4.querySelectorAll('[data-clock] span[data-number]');
        spans.forEach((element: any) => {
            element.style.color = options.colors.default;
        });
        if (options.percentage > 0) {
            h4.querySelector('[data-clock]').style.display = 'block';
            spans[0].textContent = this.common.padWithZiro(options.time.hours.toString());
            spans[1].textContent = this.common.padWithZiro(options.time.minutes.toString());
            spans[2].textContent = this.common.padWithZiro(options.time.seconds.toString());
            h4.querySelector('[data-text]').textContent = '';
        }
        else {
            h4.querySelector('[data-clock]').style.display = 'none';
            h4.querySelector('[data-text]').textContent = options.title.text;
        }
        // setTimeout(() => {
        //     let h = parseInt(getComputedStyle(h4).height.replace('px', ''));
        //     if (!isNaN(h))
        //         h4.style.top = ((options.radius) - (h / 2)) + 'px';
        // }, 10);
    }

    getDefaultOptions(): TimerOptions {
        return {
            colors: this.common.getDefaultColors(),
            radius: 88,
            strokeWidth: 6,
            animationDuration: 500,
            title: {
                text: 'time is up!',
                fontSize: 18,
                fontWeight: 'bold',
                letterSpacing: '1px'
            },
            time: {
                hours: 3,
                minutes: 24,
                seconds: 42
            },
            percentage: 100,
            showEdges: true
        } as TimerOptions;
    }

    setCircle() {
        this.circleOptions = this.common.extend(this.options, this.circleOptions);
        this.circleOptions.fromDegree = 50;
        this.circleOptions.toDegree = this.options.percentage + 50;

        this.circleOptions.backgroundColor = this.common.getComputedStyleByParentRec(this.element, 'backgroundColor');
        if (!this.circleOptions.backgroundColor)
            this.circleOptions.backgroundColor = '#fff';

        if (this.circle)
            this.circle.update(this.circleOptions);
        else
            this.circle = new Circle(this.circleOptions);
    }
}