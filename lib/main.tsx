import React = require("react");
import ReactDOM = require("react-dom");

import url = require("url");

import * as defaults from "./defaults";
import { SessionStorageAutosaver } from "./autosaver";
import App from "./app";

let defaultSketchJS = require("raw!./default-sketch.js") as string;

require("../node_modules/codemirror/lib/codemirror.css");
require("../css/style.css");
require("../css/p5-widget-codemirror-theme.css");

function start() {
  let embeddingPageURL = document.referrer;
  let qs = url.parse(window.location.search, true).query;
  let id = embeddingPageURL + '_' + qs['id'];
  let baseSketchURL = qs['baseSketchURL'] || embeddingPageURL;
  let autoplay = (qs['autoplay'] === 'on');
  let initialContent = qs['sketch'] || defaultSketchJS;
  let p5version = qs['p5version'] || defaults.P5_VERSION;
  let previewWidth = parseInt(qs['previewWidth']);
  let maxRunTime = parseInt(qs['maxRunTime']) || defaults.MAX_RUN_TIME;
  if (isNaN(previewWidth)) {
    previewWidth = defaults.PREVIEW_WIDTH;
  }

  if (isNaN(maxRunTime)) {
    maxRunTime = defaults.MAX_RUN_TIME;
  }

  initialContent = initialContent.replace(/\r\n/g, '\n').trim();

  ReactDOM.render(
    <App initialContent={initialContent}
         autosaver={new SessionStorageAutosaver(id)}
         baseSketchURL={baseSketchURL}
         p5version={p5version}
         previewWidth={previewWidth}
         maxRunTime={maxRunTime}
         autoplay={autoplay} />,
    document.getElementById('app-holder')
  );
}

window.addEventListener('load', start);
