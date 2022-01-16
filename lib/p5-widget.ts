import * as defaults from "./defaults";

const MY_FILENAME = 'p5-widget.js';
const IFRAME_FILENAME = 'p5-widget.html';
const IFRAME_STYLE = [
  'width: 100%',
  'background-color: white',
  'border: 1px solid #ec245e',
  'box-sizing: border-box'
];
const AVOID_MIXED_CONTENT_WARNINGS = true;

let myScriptEl = getMyScriptEl() as HTMLScriptElement;
let myBaseURL = getMyBaseURL(myScriptEl.src);
let autoload = !myScriptEl.hasAttribute('data-manual');
let nextId = 1;

function getMyBaseURL(url: string) {
  let baseURL = url.slice(0, -MY_FILENAME.length);

  if (AVOID_MIXED_CONTENT_WARNINGS) {
    if (window.location.protocol === 'http:' && /^https:/.test(baseURL)) {
      // Our script was loaded over HTTPS, but the embedding page is
      // using HTTP. This is likely to result in mixed content warnings
      // if e.g. the widget's sketch wants to load resources relative to
      // the embedding page's URL, so let's just embed the widget over
      // HTTP instead of HTTPS.

      baseURL = baseURL.replace('https:', 'http:');
    }
  }

  return baseURL;
}

function getMyScriptEl() {
  return (
    document.currentScript ||
    document.querySelectorAll("script[src$='" + MY_FILENAME + "']")[0]
  );
}

// http://stackoverflow.com/a/7557433/2422398
function isElementInViewport(el: HTMLElement) {
  var rect = el.getBoundingClientRect();

  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= (window.innerHeight ||
                 document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth ||
                  document.documentElement.clientWidth)
  );
}

function getDataHeight(el: HTMLScriptElement) {
  const dataHeight = el.getAttribute('data-height') || "";
  if (dataHeight.indexOf("%") !== -1) {
    return dataHeight;
  }

  let height = parseInt(dataHeight);
  if (isNaN(height)) height = defaults.HEIGHT;

  return height;
}

function absoluteURL(url: string) {
  let a = document.createElement('a');
  a.setAttribute('href', url);

  return a.href;
}

function getSketch(url: string, cb: (sketch: string) => any) {
  let error = (msg?: any) => {
    let lines = ['// p5.js-widget failed to retrieve ' + url + '.'];

    if (msg && typeof(msg) == 'string') {
      lines.push('// ' + msg);
    }

    cb(lines.join('\n'));
  };
  let req = new XMLHttpRequest();
  req.open('GET', url);

  req.onload = () => {
    if (req.status == 200) {
      cb(req.responseText);
    } else {
      error('Server returned HTTP ' + req.status + '.');
    }
  };

  req.onerror = error;
  req.send(null);
}

function replaceScriptWithWidget(el: HTMLScriptElement) {
  let iframe = document.createElement('iframe');
  let height = getDataHeight(el);
  let previewWidth = parseInt(el.getAttribute('data-preview-width'));
  let baseSketchURL = absoluteURL(el.getAttribute('data-base-url'));
  let p5version = el.getAttribute('data-p5-version');
  let maxRunTime = parseInt(el.getAttribute('data-max-run-time'));
  let autoplay = el.hasAttribute('data-autoplay');
  let url;
  let qsArgs = [
    'id=' + encodeURIComponent(el.getAttribute('data-id'))
  ];
  let style = IFRAME_STYLE.slice();

  function makeWidget(sketch: string) {
    qsArgs.push('sketch=' + encodeURIComponent(sketch));

    if (typeof height === "number") {
      style.push('min-height: ' + height + 'px');
    } else {
      style.push('height: ' + height);
    }
    url = myBaseURL + IFRAME_FILENAME + '?' + qsArgs.join('&');
    iframe.setAttribute('src', url);
    iframe.setAttribute('style', style.join('; '));
    el.parentNode.replaceChild(iframe, el);
  }

  if (!isNaN(previewWidth) && previewWidth >= 0) {
    qsArgs.push('previewWidth=' + previewWidth);
  }

  if (!isNaN(maxRunTime) && maxRunTime >= 0) {
    qsArgs.push('maxRunTime=' + maxRunTime);
  }

  if (baseSketchURL) {
    qsArgs.push('baseSketchURL=' + encodeURIComponent(baseSketchURL));
  }

  if (p5version) {
    qsArgs.push('p5version=' + encodeURIComponent(p5version));
  }

  if (autoplay) {
    qsArgs.push('autoplay=on');
  }

  if (el.src && el.textContent && el.textContent.trim()) {
    return makeWidget([
      '// Your widget includes both a "src" attribute and inline script',
      '// content, which makes no sense. Please remove one of them.'
    ].join('\n'));
  }

  if (el.src) {
    getSketch(el.src, makeWidget);
  } else {
    makeWidget(el.textContent);
  }
}

function whenVisible(el: HTMLScriptElement,
                     cb: (el: HTMLScriptElement) => void) {
  let CHECK_INTERVAL_MS = 1000;
  let interval: number;

  function maybeMakeVisible() {
    if (!isElementInViewport(el)) return;

    clearInterval(interval);
    window.removeEventListener('scroll', maybeMakeVisible, false);
    window.removeEventListener('resize', maybeMakeVisible, false);
    cb(el);
  }

  // We want to check at a fixed interval as a fallback, to make
  // sure that we detect when the element is visible even outside
  // of the usual means (e.g., because the user did some
  // sort of pinch/zoom gesture).
  interval = setInterval(maybeMakeVisible, 1000);

  window.addEventListener('scroll', maybeMakeVisible, false);
  window.addEventListener('resize', maybeMakeVisible, false);
  maybeMakeVisible();
}

function lazilyReplaceScriptWithWidget(el: HTMLScriptElement) {
  let height = getDataHeight(el);

  el.style.display = 'block';
  el.style.fontSize = '0';
  el.style.width = '100%';
  el.style.minHeight = height + 'px';
  el.style.background = '#f0f0f0';

  if (!el.hasAttribute('data-id')) {
    el.setAttribute('data-id', nextId.toString());
    nextId++;
  }

  whenVisible(el, replaceScriptWithWidget);
}

function lazilyReplaceAllScriptsWithWidget() {
  let scripts = document.querySelectorAll("script[type='text/p5']");

  [].slice.call(scripts).forEach((el: HTMLScriptElement) => {
    lazilyReplaceScriptWithWidget(el);
  });
}

if (autoload) {
  if (document.readyState === 'complete') {
    lazilyReplaceAllScriptsWithWidget();
  } else {
    window.addEventListener(
      'load',
      lazilyReplaceAllScriptsWithWidget,
      false
    );
  }
}

window['p5Widget'] = {
  baseURL: myBaseURL,
  url: myBaseURL + MY_FILENAME,
  replaceScript: lazilyReplaceScriptWithWidget,
  replaceAll: lazilyReplaceAllScriptsWithWidget,
  defaults: defaults
};
