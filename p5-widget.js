/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var MY_FILENAME = 'p5-widget.js';
	var IFRAME_FILENAME = 'p5-widget.html';
	var IFRAME_STYLE = [
	    'width: 100%',
	    'border: 1px solid #ec245e',
	    'box-sizing: border-box'
	];
	var DEFAULT_HEIGHT = 300;
	var myScriptEl = getMyScriptEl();
	var myBaseURL = getMyBaseURL(myScriptEl.src);
	var autoload = !myScriptEl.hasAttribute('data-manual');
	function getMyBaseURL(url) {
	    return url.slice(0, -MY_FILENAME.length);
	}
	function getMyScriptEl() {
	    return (document.currentScript ||
	        document.querySelectorAll("script[src$='" + MY_FILENAME + "']")[0]);
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
	    if (isNaN(height))
	        height = DEFAULT_HEIGHT;
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
	if (autoload) {
	    if (document.readyState === 'complete') {
	        replaceAllScriptsWithWidget();
	    }
	    else {
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


/***/ }
/******/ ]);
//# sourceMappingURL=p5-widget.js.map