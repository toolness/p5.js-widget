function loadP5(version, cb) {
  var url = '//cdnjs.cloudflare.com/ajax/libs/p5.js/' + version + '/p5.js';
  var script = document.createElement('script');

  cb = cb || function() {};

  script.onload = cb;
  script.setAttribute('src', url);

  document.body.appendChild(script);    
};

function LoopChecker(sketch, funcName, maxRunTime) {
  var self = {};
  var startTime = Date.now();
  var loopCheckFailureRange = null;

  window[funcName] = function(range) {
    if (Date.now() - startTime > maxRunTime) {
      self.wasTriggered = true;
      loopCheckFailureRange = range;
      throw new Error("Loop took over " + maxRunTime + " ms to run");
    }
  };

  self.getLineNumber = function() {
    var index = loopCheckFailureRange[0];
    var line = 1;

    for (var i = 0; i < index; i++) {
      if (sketch[i] === '\n')
        line++;
    }

    return line;
  };

  self.wasTriggered = false;

  window.setInterval(function() {
    startTime = Date.now();
  }, maxRunTime / 2);

  return self;
}

function startSketch(sketch, p5version, maxRunTime, loopCheckFuncName,
                     errorCb) {
  var sketchScript = document.createElement('script');
  var loopChecker = LoopChecker(sketch, loopCheckFuncName, maxRunTime);

  sketchScript.textContent = sketch;

  window.addEventListener('error', function(e) {
    var message = e.message;
    var line = undefined;

    if (loopChecker.wasTriggered) {
      message = "Your loop is taking too long to run.";
      line = loopChecker.getLineNumber();
    } else if (typeof(e.lineno) === 'number' &&
              (e.filename === '' || e.filename === window.location.href)) {
      line = e.lineno;
    }

    // p5 sketches don't actually stop looping if they throw an exception,
    // so try to stop the sketch.
    try { noLoop(); } catch (e) {}

    errorCb(message, line);
  });

  document.body.appendChild(sketchScript);

  loadP5(p5version);
}
