var p5Widget = (function() {
  var MY_FILENAME = 'p5-widget.js';
  var IFRAME_FILENAME = 'p5-widget.html';
  var IFRAME_STYLE = [
    'width: 100%',
    'border: 1px solid darkgray',
    'box-sizing: border-box'
  ];
  var DEFAULT_HEIGHT = 300;

  var myScriptEl = getMyScriptEl();
  var myBaseURL = getMyBaseURL(myScriptEl.src);
  var autoload = !myScriptEl.hasAttribute('data-manual');
  var self = {};

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
    var autoplay = el.hasAttribute('data-autoplay');
    var url;
    var qsArgs = ['sketch=' + encodeURIComponent(el.textContent)];
    var style = IFRAME_STYLE.slice();

    if (isNaN(height)) height = DEFAULT_HEIGHT;

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

  self.baseURL = myBaseURL;
  self.url = myBaseURL + MY_FILENAME;

  if (autoload) {
    if (document.readyState === 'complete') {
      replaceAllScriptsWithWidget();
    } else {
      window.addEventListener('load', replaceAllScriptsWithWidget, false);
    }
  }

  self.replaceScript = replaceScriptWithWidget;
  self.replaceAll = replaceAllScriptsWithWidget;
  self.defaults = {
    height: DEFAULT_HEIGHT
  };

  return self;
})();
