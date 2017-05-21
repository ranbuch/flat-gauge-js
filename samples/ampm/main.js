window.addEventListener('load', function() {
  var target = document.getElementById('target');
  window.ampm = new FlatGauge.AmPm(target, {
    rotationSpeed: 1000
  });
})