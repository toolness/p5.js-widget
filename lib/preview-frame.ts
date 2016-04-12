require("../css/preview-frame.css");

declare interface PreviewFrameWindow extends PreviewFrame {
  // This is exported by p5 when it's in global mode.
  noLoop: () => void;
}

let global = window as PreviewFrameWindow;

function loadP5(version: string, cb?: () => void) {
  let url = '//cdnjs.cloudflare.com/ajax/libs/p5.js/' + version + '/p5.js';
  let script = document.createElement('script');

  cb = cb || (() => {});

  script.onload = cb;
  script.setAttribute('src', url);

  document.body.appendChild(script);
}

function LoopChecker(sketch: string, funcName: string, maxRunTime: number) {
  let self = {
    wasTriggered: false,
    getLineNumber() {
      let index = loopCheckFailureRange[0];
      let line = 1;

      for (let i = 0; i < index; i++) {
        if (sketch[i] === '\n')
          line++;
      }

      return line;
    }
  };
  let startTime = Date.now();
  let loopCheckFailureRange: Array<number> = null;

  global[funcName] = (range: Array<number>) => {
    if (Date.now() - startTime > maxRunTime) {
      self.wasTriggered = true;
      loopCheckFailureRange = range;
      throw new Error("Loop took over " + maxRunTime + " ms to run");
    }
  };

  setInterval(() => {
    startTime = Date.now();
  }, maxRunTime / 2);

  return self;
}

function startSketch(sketch: string, p5version: string, maxRunTime: number,
                     loopCheckFuncName: string,
                     errorCb: PreviewFrameErrorReporter) {
  let sketchScript = document.createElement('script');
  let loopChecker = LoopChecker(sketch, loopCheckFuncName, maxRunTime);

  sketchScript.textContent = sketch;

  global.addEventListener('error', (e: ErrorEvent) => {
    let message = e.message;
    let line = undefined;

    if (loopChecker.wasTriggered) {
      message = "Your loop is taking too long to run.";
      line = loopChecker.getLineNumber();
    } else if (typeof(e.lineno) === 'number' &&
              (e.filename === '' || e.filename === window.location.href)) {
      line = e.lineno;
    }

    // p5 sketches don't actually stop looping if they throw an exception,
    // so try to stop the sketch.
    try { global.noLoop(); } catch (e) {}

    errorCb(message, line);
  });

  document.body.appendChild(sketchScript);

  loadP5(p5version);
}

global.startSketch = startSketch;
