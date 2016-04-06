/// <reference path="typings/codemirror.d.ts"/>
/// <reference path="typings/react.d.ts"/>
/// <reference path="typings/react-dom.d.ts"/>

import ReactDOM = require("react-dom");
import React = require("react");
import CodeMirror = require("codemirror");

let i = 0;

setInterval(() => {
  ReactDOM.render(
    <p>hello from react {i++}</p>,
    document.getElementById('app')
  );
}, 300);

var cm = CodeMirror(document.getElementById('codemirror'), {
  value: 'hello from codemirror'
});
