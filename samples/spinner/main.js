window.addEventListener('load', function() {
  var target = document.getElementById('target');
  window.spinner = new FlatGauge.Spinner(target, {
    rotationSpeed: 1000,
    title: {
      text: 'Spinning'
    },
    highlight: true
  });
  
})