window.addEventListener('load', function() {
  var target = document.getElementById('target');
  window.timer = new FlatGauge.Timer(target, {
    animationDuration: 500,
    time: {
        hours: 2,
        minutes: 45,
        seconds: 3
    },
    percentage: 33
  });
})