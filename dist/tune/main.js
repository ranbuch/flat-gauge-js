window.addEventListener('load', function () {
  var target = document.getElementById('target');
  window.tune = new FlatGauge.Tune(target, {
    rotationSpeed: 1000,
    title: {
      text: 'Tune'
    },
    showIcon: false,
    showEdges: true,
    needleOptions: {
      minMaxVal: { value: -10, min: 0, max: 0 }
    },
    hollowEdges: 'Right'
  });

  var range = document.getElementById('range');
  var rangeLeft = document.getElementById('rangeLeft');
  var rangeRight = document.getElementById('rangeRight');
  var hollowLeft = document.getElementById('hollowLeft');
  var hollowRight = document.getElementById('hollowRight');

  var getSideState = function() {
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
      iconOptions: {
        degree: parseInt(range.value)
      },
      edges: true,
      hideBottom: true,
      needleOptions: {
        edges: false,
        minMaxVal: {
          value: parseInt(range.value),
          min: parseInt(rangeLeft.value),
          max: parseInt(rangeRight.value)
        }
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

})