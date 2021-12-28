import * as PreviewFrame from "./preview-frame-interface";

require("../css/preview-frame.css");

interface PreviewFrameWindow extends PreviewFrame.Runner {
  // This is exported by p5 when it's in global mode.
  noLoop: () => void;

  // This is the p5 constructor. An undocumented feature is that
  // even the first argument is actually *optional*; if omitted,
  // p5 will initialize itself in global mode.
  p5: (sketch?: Function, node?: HTMLElement, sync?: boolean) => void;
}

let global = window as unknown as PreviewFrameWindow;

function loadScript(url, cb?: () => void) {
  let script = document.createElement('script');

  cb = cb || (() => {});

  script.onload = cb;
  script.onerror = () => {
    console.log("Failed to load script: " + url);
  };
  script.setAttribute('src', url);

  document.body.appendChild(script);
}

function loadScripts(urls: string[], cb?: () => void) {
  cb = cb || (() => {});

  let i = 0;
  let loadNextScript = () => {
    if (i === urls.length) {
      return cb();
    }
    loadScript(urls[i++], loadNextScript);
  };

  loadNextScript();
}

function p5url(version: string) {
  return `//cdnjs.cloudflare.com/ajax/libs/p5.js/${version}/p5.js`;
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

function setBaseURL(url: string) {
  var base = document.createElement('base');
  base.setAttribute('href', url);

  document.head.appendChild(base);
}

function startSketch(sketch: string, p5version: string, maxRunTime: number,
                     loopCheckFuncName: string, baseURL: string,
                     errorCb: PreviewFrame.ErrorReporter) {
  let sketchScript = document.createElement('script');
  let loopChecker = LoopChecker(sketch, loopCheckFuncName, maxRunTime);

  if (baseURL) {
    setBaseURL(baseURL);
  }

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

  loadScripts([
    p5url(p5version),
  ], () => {
    document.body.appendChild(sketchScript);
    if (document.readyState === 'complete') {
      new global.p5();
    }
  });
}

global.startSketch = startSketch;
