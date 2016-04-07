function loadP5(version, cb) {
  var url = '//cdnjs.cloudflare.com/ajax/libs/p5.js/' + version + '/p5.js';
  var script = document.createElement('script');

  cb = cb || function() {};

  script.onload = cb;
  script.setAttribute('src', url);

  document.body.appendChild(script);    
};

function startSketch(sketch, p5version, errorCb) {
  var sketchScript = document.createElement('script');

  sketchScript.textContent = sketch;

  window.addEventListener('error', function(e) {
    var line = undefined;

    if (typeof(e.lineno) === 'number' &&
        (e.filename === '' || e.filename === window.location.href)) {
      line = e.lineno;
    }

    errorCb(e.message, line);
  });

  document.body.appendChild(sketchScript);

  loadP5(p5version);
}
