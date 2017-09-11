window.addEventListener('load', function () {
    let initSpinner = function () {
        var spinner = new FlatGauge.Spinner(document.getElementById('spinnerTarget'), {
            rotationSpeed: 5000,
            title: {
                text: 'Spinning'
            },
            highlight: true
        });

        var isOn = true;

        document.getElementById('toggleSpinner').addEventListener('click', function () {
            isOn = !isOn;
            var activeDegree = isOn ? 10 : 100;
            spinner.update({ highlight: isOn, activeDegree: activeDegree });
        }, false);
    };

    let initRange = function () {
        var range = new FlatGauge.Range(document.getElementById('rangeTarget'), {
            title: {
                text: 'range'
            },
            showEdges: false,
            minMaxVal: { min: 25, max: 75 },
            highlight: true,
            hideBottom: true
        });
    };

    let initTune = function () {
        var tune = new FlatGauge.Tune(document.getElementById('tuneTarget'), {
            rotationSpeed: 1000,
            title: {
                text: 'Tune'
            },
            showIcon: true,
            showEdges: true,
            needleOptions: {
                minMaxVal: { value: -10, min: 0, max: 0 }
            },
            hollowEdges: 0
            // ,
            // icon: {
            //     src: "https://capitaliseprodstorage.blob.core.windows.net/app-static/breaks_above_big.svg",
            //     dimensions: {
            //         width: 20,
            //         height: 20
            //     },
            //     top: 4
            // }
        });

        var range = document.getElementById('tuneRange');
        var rangeLeft = document.getElementById('tuneRangeLeft');
        var rangeRight = document.getElementById('tuneRangeRight');
        var hollowLeft = document.getElementById('tuneHollowLeft');
        var hollowRight = document.getElementById('tuneHollowRight');
        var rangeIcon = document.getElementById('tuneRangeIcon');
        var rangeIconEnabled = document.getElementById('tuneRangeIconEnabled');


        var getSideState = function () {
            var state = String(hollowLeft.checked) + String(hollowRight.checked);
            switch (state) {
                case 'falsefalse': {
                    return 0;
                }
                case 'truefalse': {
                    return 1;
                }
                case 'falsetrue': {
                    return 2;
                }
                case 'truetrue': {
                    return 3;
                }
            }
        };

        var update = function () {
            var getOptions = () => {
                return {
                    edges: true,
                    hideBottom: true,
                    needleOptions: {
                        edges: false,
                        minMaxVal: {
                            value: parseInt(range.value),
                            min: Math.min(parseInt(rangeLeft.value), parseInt(rangeRight.value)),
                            max: Math.max(parseInt(rangeLeft.value), parseInt(rangeRight.value))
                        }
                    },
                    iconOptions: {
                        animationDuration: 500,
                        degree: parseInt(rangeIcon.value),
                        dimensions: {
                            height: 20,
                            width: 22
                        },
                        left: 0,
                        opacity: 1,
                        radius: 88,
                        src: rangeIconEnabled.checked ? "https://capitaliseprodstorage.blob.core.windows.net/app-static/breaks_above_big.svg" : '',
                        top: 6
                    },
                    hollowEdges: getSideState(),
                    colors: {
                        active: '#4CCEAD',
                        default: '#505050',
                        inactive: '#ededed'
                    }
                }
            };

            tune.update(getOptions());
            document.getElementById('tuneCode').textContent = JSON.stringify(getOptions());
            $('#tuneCodeWrap').show(500);

        };

        range.addEventListener('change', function () {
            update();
            document.querySelector('#rangeNumber').value = range.value;
        }, false);

        rangeLeft.addEventListener('change', function () {
            update();
            document.querySelector('#rangeLeftNumber').value = rangeLeft.value;
        }, false);

        rangeRight.addEventListener('change', function () {
            update();
            document.querySelector('#rangeRightNumber').value = rangeRight.value;
        }, false);

        hollowLeft.addEventListener('change', function () {
            update();
        }, false);

        hollowRight.addEventListener('change', function () {
            update();
        }, false);

        rangeIcon.addEventListener('change', function () {
            update();
            document.querySelector('#rangeIconNumber').value = rangeIcon.value;
        }, false);

        rangeIconEnabled.addEventListener('change', function () {
            update();
        }, false);

    };

    var initTimer = () => {
        var timer = new FlatGauge.Timer(document.getElementById('timerTarget'), {
            animationDuration: 500,
            time: {
                hours: 2,
                minutes: 45,
                seconds: 3
            },
            percentage: 33
        });
    };

    var initAmpm = () => {
        var ampm = new FlatGauge.AmPm(document.getElementById('ampmTarget'), {
            rotationSpeed: 1000,
            fromTo: {
                from: '1:52',
                to: '15:20'
            },
        });
    };

    var initMultitune = () => {
        var target = document.getElementById('multituneTarget');
        var animationDuration = 500, defRadius = 88, bgColor = '#ffffff';
        var multiTune = new FlatGauge.MultiTune(target, {
            needleOptions: {
                minMaxVal: {
                    min: 30,
                    max: 70,
                    value: 55
                },
                color: '#4CCEAD',
                scale: 1.125,
                radius: defRadius,
                animationDuration: animationDuration,
                disabled: false
            },
            segments: [
                {
                    min: 0,
                    max: 37.5
                },
                {
                    min: 62.5,
                    max: 100
                }
            ],
            colors: {
                active: '#4CCEAD',
                default: '#505050',
                inactive: '#ededed'
            },
            strokeWidth: 6,
            animationDuration: animationDuration,
            radius: defRadius,
            showEdges: true,
            showIcon: true,
            hollowEdges: 0,
            hideBottom: true,
            backgroundColor: bgColor,
            hollowEdgesBgColor: bgColor
        });

        var range = document.getElementById('multituneRange');
        var rangeLeft = document.getElementById('multituneRangeLeft');
        var rangeRight = document.getElementById('multituneRangeRight');
        var hollowLeft = document.getElementById('multituneHollowLeft');
        var hollowRight = document.getElementById('multituneHollowRight');
        var rangeIcon = document.getElementById('multituneRangeIcon');
        var rangeIconActive = document.getElementById('multituneRangeIconEnabled');

        var getSideState = function () {
            var state = String(hollowLeft.checked) + String(hollowRight.checked);
            switch (state) {
                case 'falsefalse': {
                    return 0;
                }
                case 'truefalse': {
                    return 1;
                }
                case 'falsetrue': {
                    return 2;
                }
                case 'truetrue': {
                    return 3;
                }
            }
        };

        var isInRange = function (val, left, right) {
            if (val >= left && val <= right) return false;
            return true;
        };

        var update = function () {
            let animationDuration = 1500;
            var obj = {
                backgroundColor: '#ffffff',
                hollowEdgesBgColor: '#ffffff',
                edges: true,
                hideBottom: true,
                animationDuration: animationDuration,
                needleOptions: {
                    animationDuration: animationDuration,
                    scale: 1.25,
                    color: isInRange(range.value, rangeLeft.value, rangeRight.value) ? '#4CCEAD' : '#505050',
                    edges: false,
                    minMaxVal: {
                        value: parseInt(range.value),
                        min: parseInt(rangeLeft.value),
                        max: parseInt(rangeRight.value)
                    }
                },
                iconOptions: {
                    animationDuration: animationDuration,
                    degree: parseInt(rangeIcon.value),
                    dimensions: {
                        height: 20,
                        width: 22
                    },
                    left: 0,
                    opacity: 1,
                    radius: 88,
                    src: rangeIconActive.checked ? "https://capitaliseprodstorage.blob.core.windows.net/app-static/breaks_above_big.svg" : '',
                    top: 6
                },
                hollowEdges: getSideState()
            };
            multiTune.update(obj);
            document.getElementById('multituneCode').textContent = JSON.stringify(obj);
            $('#multituneCodeWrap').show(500);
        };

        range.addEventListener('change', function () {
            update();
            document.querySelector('#multituneRangeNumber').value = range.value;
        }, false);

        rangeLeft.addEventListener('change', function () {
            update();
            document.querySelector('#multituneRangeLeftNumber').value = rangeLeft.value;
        }, false);

        rangeRight.addEventListener('change', function () {
            update();
            document.querySelector('#multituneRangeRightNumber').value = rangeRight.value;
        }, false);

        hollowLeft.addEventListener('change', function () {
            update();
        }, false);

        hollowRight.addEventListener('change', function () {
            update();
        }, false);

        rangeIcon.addEventListener('change', function () {
            update();
            document.querySelector('#multirangeIconNumber').value = rangeIcon.value;
        }, false);

        rangeIconActive.addEventListener('change', function () {
            update();
        }, false);

        // update();
    };

    var init = function () {
        initSpinner();
        initRange();
        initTune();
        initTimer();
        initAmpm();
        initMultitune();
    }

    init();
}, false);