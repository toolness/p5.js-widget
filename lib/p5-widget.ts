const MY_FILENAME = 'p5-widget.js';
const IFRAME_FILENAME = 'p5-widget.html';
const IFRAME_STYLE = [
  'width: 100%',
  'border: 1px solid #ec245e',
  'box-sizing: border-box'
];
const DEFAULT_HEIGHT = 300;

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

function replaceScriptWithWidget(el) {
  let iframe = document.createElement('iframe');
  let height = parseInt(el.getAttribute('data-height'));
  let previewWidth = parseInt(el.getAttribute('data-preview-width'));
  let p5version = el.getAttribute('data-p5-version');
  let autoplay = el.hasAttribute('data-autoplay');
  let url;
  let qsArgs = ['sketch=' + encodeURIComponent(el.textContent)];
  let style = IFRAME_STYLE.slice();

  if (isNaN(height)) height = DEFAULT_HEIGHT;

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

function replaceAllScriptsWithWidget() {
  let scripts = document.querySelectorAll("script[type='text/p5']");

  [].slice.call(scripts).forEach(replaceScriptWithWidget);
}

if (autoload) {
  if (document.readyState === 'complete') {
    replaceAllScriptsWithWidget();
  } else {
    window.addEventListener('load', replaceAllScriptsWithWidget, false);
  }
}

window['p5Widget'] = {
  baseURL: myBaseURL,
  url: myBaseURL + MY_FILENAME,
  replaceScript: replaceScriptWithWidget,
  replaceAll: replaceAllScriptsWithWidget,
  defaults: {
    height: DEFAULT_HEIGHT
  }
};
