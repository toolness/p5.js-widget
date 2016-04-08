var p5jsWidget = (function() {
  var MY_FILENAME = 'p5-widget.js';
  var IFRAME_FILENAME = 'p5-widget.html';
  var IFRAME_STYLE = 'width: 100%; border: 1px solid black';
  var DEFAULT_HEIGHT = 300;

  var myScriptEl = getMyScriptEl();
  var myBaseURL = getMyBaseURL(myScriptEl.src);
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
    var style = IFRAME_STYLE;

    if (isNaN(height)) height = DEFAULT_HEIGHT;

    style += '; min-height: ' + height + 'px';
    iframe.setAttribute('src', myBaseURL + IFRAME_FILENAME);
    iframe.setAttribute('style', style);

    el.parentNode.replaceChild(iframe, el);
  }

  function replaceAllScriptsWithWidget() {
    var scripts = document.querySelectorAll("script[type='text/p5']");

    [].slice.call(scripts).forEach(replaceScriptWithWidget);
  }

  if (document.readyState === 'complete') {
    replaceAllScriptsWithWidget();
  } else {
    window.addEventListener('load', replaceAllScriptsWithWidget, false);
  }

  return self;
})();
