window.addEventListener('load', function() {
  var target = document.getElementById('target');
  window.timer = new FlatGauge.Timer(target, {
    animationDuration: 500,
    time: {
        hours: 0,
        minutes: 0,
        seconds: 33
    },
    percentage: 33
  });

  document.querySelector('#pause').addEventListener('click', function() {
    window.timer.pause();
  }, false);

  document.querySelector('#play').addEventListener('click', function() {
    window.timer.play();
  }, false);
})