import React = require("react");
import ReactDOM = require("react-dom");

import * as defaults from "./defaults";
import { SessionStorageAutosaver } from "./autosaver";
import App from "./app";

let defaultSketchJS = require("raw-loader!./default-sketch.js") as string;

require("../node_modules/codemirror/lib/codemirror.css");
require("../css/style.css");
require("../css/p5-widget-codemirror-theme.css");

function start() {
  let embeddingPageURL = document.referrer;
  let qs = new URLSearchParams(window.location.search);
  let id = embeddingPageURL + '_' + qs.get('id');
  let baseSketchURL = qs.get('baseSketchURL') || embeddingPageURL;
  let autoplay = (qs.get('autoplay') === 'on');
  let initialContent = qs.get('sketch') || defaultSketchJS;
  let p5version = qs.get('p5version') || defaults.P5_VERSION;
  let previewWidth = parseInt(qs.get('previewWidth'));
  let maxRunTime = parseInt(qs.get('maxRunTime'))
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
