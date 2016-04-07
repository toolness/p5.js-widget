function loadP5(version, cb) {
  var url = '//cdnjs.cloudflare.com/ajax/libs/p5.js/' + version + '/p5.js';
  var script = document.createElement('script');

  cb = cb || function() {};

  script.onload = cb;
  script.setAttribute('src', url);

  document.body.appendChild(script);    
};

function startSketch(sketch, p5version) {
  var sketchScript = document.createElement('script');

  sketchScript.textContent = sketch;
  document.body.appendChild(sketchScript);

  loadP5(p5version);
}
