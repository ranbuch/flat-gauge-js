window.addEventListener('load', function() {
  var target = document.getElementById('target');
  window.range = new FlatGauge.Range(target, {
    title: {
      text: 'range'
    },
    showEdges: false,
    minMaxVal: { min: 25, max: 75 },
    highlight: true
  });
  
})