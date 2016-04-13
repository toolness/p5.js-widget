var p5Widget = (function() {
  var MY_FILENAME = 'p5-widget.js';
  var IFRAME_FILENAME = 'p5-widget.html';
  var IFRAME_STYLE = [
    'width: 100%',
    'border: 1px solid #ec245e',
    'box-sizing: border-box'
  ];
  var DEFAULT_HEIGHT = 300;

  var myScriptEl = getMyScriptEl() as HTMLScriptElement;
  var myBaseURL = getMyBaseURL(myScriptEl.src);
  var autoload = !myScriptEl.hasAttribute('data-manual');

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
    var iframe = document.createElement('iframe');
    var height = parseInt(el.getAttribute('data-height'));
    var previewWidth = parseInt(el.getAttribute('data-preview-width'));
    var p5version = el.getAttribute('data-p5-version');
    var autoplay = el.hasAttribute('data-autoplay');
    var url;
    var qsArgs = ['sketch=' + encodeURIComponent(el.textContent)];
    var style = IFRAME_STYLE.slice();

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
    var scripts = document.querySelectorAll("script[type='text/p5']");

    [].slice.call(scripts).forEach(replaceScriptWithWidget);
  }

  var self = {
    baseURL: myBaseURL,
    url: myBaseURL + MY_FILENAME,
    replaceScript: replaceScriptWithWidget,
    replaceAll: replaceAllScriptsWithWidget,
    defaults: {
      height: DEFAULT_HEIGHT
    }
  };

  if (autoload) {
    if (document.readyState === 'complete') {
      replaceAllScriptsWithWidget();
    } else {
      window.addEventListener('load', replaceAllScriptsWithWidget, false);
    }
  }

  return self;
})();

window['p5Widget'] = p5Widget;
