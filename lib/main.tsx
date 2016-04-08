import React = require("react");
import ReactDOM = require("react-dom");

import url = require("url");

import App from "./app";

let defaultSketchJS = require("raw!./default-sketch.js") as string;

require("../css/style.css");

function start() {
  let qs = url.parse(window.location.search, true).query;
  let autoplay = (qs['autoplay'] === 'on');
  let initialContent = qs['sketch'] || defaultSketchJS;

  ReactDOM.render(
    <App initialContent={initialContent.trim()}
         previewWidth={150}
         autoplay={autoplay} />,
    document.getElementById('app-holder')
  );
}

start();
