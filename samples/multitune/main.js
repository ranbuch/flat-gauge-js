window.addEventListener('load', function () {
  var target = document.getElementById('target');
  var animationDuration = 500, defRadius = 88, bgColor = '#ffffff';
  window.multiTune = new FlatGauge.MultiTune(target, {
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

  var range = document.getElementById('range');
  var rangeLeft = document.getElementById('rangeLeft');
  var rangeRight = document.getElementById('rangeRight');
  var hollowLeft = document.getElementById('hollowLeft');
  var hollowRight = document.getElementById('hollowRight');
  var rangeIcon = document.getElementById('rangeIcon');
  var rangeIconActive = document.getElementById('rangeIconActive');

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
    window.multiTune.update(obj);
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

  rangeIconActive.addEventListener('change', function () {
    update();
  }, false);

  update();
})