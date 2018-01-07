window.addEventListener('load', function () {
  var target = document.getElementById('target');
  window.ampm = new FlatGauge.AmPm(target, {
    rotationSpeed: 1000,
    fromTo: {
      from: '3:52',
      to: '14:20'
    }
  });
})