/// <reference path="../typings/react.d.ts"/>
import React = require("react");

/// <reference path="../typings/codemirror.d.ts"/>
import CodeMirror = require("codemirror");

import "codemirror/mode/javascript/javascript.js";

interface Props {
  initialContent: string
}

interface State {
}

export default class Editor extends React.Component<Props, State> {
  _cm: CodeMirror.Editor

  componentDidMount() {
    this._cm = CodeMirror(this.refs.container, {
      value: this.props.initialContent,
      lineNumbers: true,
      mode: 'javascript'
    });
  }

  componentWillUnmount() {
    // CodeMirror instances have no remove/destroy methods, so we
    // don't need to do anything: http://stackoverflow.com/a/18890324/2422398
    this._cm = null;
  }

  // http://stackoverflow.com/a/33826399/2422398
  refs: {
    [key: string]: (Element)
    container: HTMLDivElement
  }

  render() {
    return <div ref="container"></div>;
  }
}
