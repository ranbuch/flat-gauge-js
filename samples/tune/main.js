window.addEventListener('load', function () {
  var target = document.getElementById('target');
  window.tune = new FlatGauge.Tune(target, {
    rotationSpeed: 1000,
    title: {
      text: 'Tune'
    },
    showIcon: true,
    showEdges: true,
    needleOptions: {
      minMaxVal: { value: -10, min: 0, max: 0 }
    },
    hollowEdges: 'Right',
    icon: {
      src: "https://capitaliseprodstorage.blob.core.windows.net/app-static/breaks_above_big.svg",
      dimensions: {
        width: 20,
        height: 20
      },
      top: 4
    }
  });

  var range = document.getElementById('range');
  var rangeLeft = document.getElementById('rangeLeft');
  var rangeRight = document.getElementById('rangeRight');
  var hollowLeft = document.getElementById('hollowLeft');
  var hollowRight = document.getElementById('hollowRight');
  var rangeIcon = document.getElementById('rangeIcon');

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
    console.log(getSideState());
    window.tune.update({
      edges: true,
      hideBottom: false,
      needleOptions: {
        edges: false,
        minMaxVal: {
          value: parseInt(range.value),
          min: parseInt(rangeLeft.value),
          max: parseInt(rangeRight.value)
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
        src: "https://capitaliseprodstorage.blob.core.windows.net/app-static/breaks_above_big.svg",
        top: 6
      },
      hollowEdges: getSideState()
    });
  };

  range.addEventListener('change', function () {
    update();
    document.querySelector('[type="number"]').value = range.value;
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

})