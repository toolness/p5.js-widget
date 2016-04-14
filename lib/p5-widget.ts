import * as defaults from "./defaults";

const MY_FILENAME = 'p5-widget.js';
const IFRAME_FILENAME = 'p5-widget.html';
const IFRAME_STYLE = [
  'width: 100%',
  'border: 1px solid #ec245e',
  'box-sizing: border-box'
];

let myScriptEl = getMyScriptEl() as HTMLScriptElement;
let myBaseURL = getMyBaseURL(myScriptEl.src);
let autoload = !myScriptEl.hasAttribute('data-manual');

function getMyBaseURL(url) {
  return url.slice(0, -MY_FILENAME.length);
}

function getMyScriptEl() {
  return (
    document.currentScript ||
    document.querySelectorAll("script[src$='" + MY_FILENAME + "']")[0]
  );
}

// http://stackoverflow.com/a/7557433/2422398
function isElementInViewport(el) {
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
  let height = parseInt(el.getAttribute('data-height'));

  if (isNaN(height)) height = defaults.HEIGHT;

  return height;
}

function replaceScriptWithWidget(el: HTMLScriptElement) {
  let iframe = document.createElement('iframe');
  let height = getDataHeight(el);
  let previewWidth = parseInt(el.getAttribute('data-preview-width'));
  let p5version = el.getAttribute('data-p5-version');
  let autoplay = el.hasAttribute('data-autoplay');
  let url;
  let qsArgs = ['sketch=' + encodeURIComponent(el.textContent)];
  let style = IFRAME_STYLE.slice();

  if (!isNaN(previewWidth) && previewWidth >= 0) {
    qsArgs.push('previewWidth=' + previewWidth);
  }

  if (p5version) {
    qsArgs.push('p5version=' + encodeURIComponent(p5version));
  }

  if (autoplay) {
    qsArgs.push('autoplay=on');
  }

  style.push('min-height: ' + height + 'px');
  url = myBaseURL + IFRAME_FILENAME + '?' + qsArgs.join('&');
  iframe.setAttribute('src', url);
  iframe.setAttribute('style', style.join('; '));

  el.parentNode.replaceChild(iframe, el);
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

function lazilyReplaceAllScriptsWithWidget() {
  let scripts = document.querySelectorAll("script[type='text/p5']");

  [].slice.call(scripts).forEach((el: HTMLScriptElement) => {
    let height = getDataHeight(el);

    el.style.display = 'block';
    el.style.fontSize = '0';
    el.style.width = '100%';
    el.style.minHeight = height + 'px';
    el.style.background = '#f0f0f0';

    whenVisible(el, replaceScriptWithWidget);
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
  replaceScript: replaceScriptWithWidget,
  replaceAll: lazilyReplaceAllScriptsWithWidget,
  defaults: defaults
};
