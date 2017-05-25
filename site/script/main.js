window.addEventListener('load', function () { 
    let initSpinner = function() {
        var spinner = new FlatGauge.Spinner(document.getElementById('spinnerTarget'), {
            rotationSpeed: 1000,
            title: {
            text: 'Spinning'
            },
            highlight: true
        });

        var isOn = true;

        document.getElementById('toggleSpinner').addEventListener('click', function() {
            isOn = !isOn;
            var activeDegree = isOn ? 10 : 100;
            spinner.update({highlight: isOn, activeDegree: activeDegree});
        }, false);
    };

    var init = function() {
        initSpinner();
    }

    init();
}, false);