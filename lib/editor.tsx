import React = require("react");

import CodeMirror = require("codemirror");

import "codemirror/mode/javascript/javascript.js";

// It seems like CodeMirror behaves oddly with a flexbox layout, so
// we'll just manually resize the codemirror widget at regular intervals
// for now.
const RESIZE_INTERVAL_MS = 100;

interface Props {
  content?: string
  onChange?: (newValue: string) => any
}

interface State {
}

export default class Editor extends React.Component<Props, State> {
  _cm: CodeMirror.Editor
  _resizeInterval: number

  componentDidUpdate(prevProps: Props) {
    if (this.props.content !== prevProps.content &&
        this.props.content !== this._cm.getValue()) {
      this._cm.setValue(this.props.content);
    }
  }

  componentDidMount() {
    this._cm = CodeMirror(this.refs.container, {
      value: this.props.content,
      lineNumbers: true,
      mode: 'javascript'
    });
    this._cm.on('change', () => {
      if (this.props.onChange) {
        this.props.onChange(this._cm.getValue());
      }
    });
    this._resizeInterval = setInterval(this.resizeEditor,
                                       RESIZE_INTERVAL_MS);
  }

  componentWillUnmount() {
    // CodeMirror instances have no remove/destroy methods, so we
    // don't need to do anything: http://stackoverflow.com/a/18890324/2422398
    this._cm = null;
    clearInterval(this._resizeInterval);
  }

  resizeEditor = () => {
    let rect = this.refs.container.getBoundingClientRect();
    this._cm.setSize(null, rect.height);
  }

  // http://stackoverflow.com/a/33826399/2422398
  refs: {
    [key: string]: (Element)
    container: HTMLDivElement
  }

  render() {
    return <div ref="container" className="editor-holder"></div>;
  }
}
