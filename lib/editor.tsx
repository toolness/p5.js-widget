import React = require("react");

import CodeMirror = require("codemirror");

import "codemirror/mode/javascript/javascript.js";

// It seems like CodeMirror behaves oddly with a flexbox layout, so
// we'll just manually resize the codemirror widget at regular intervals
// for now.
const RESIZE_INTERVAL_MS = 100;

interface Props {
  content?: string
  errorLine?: number
  onChange?: (newValue: string) => any
}

interface State {
}

export default class Editor extends React.Component<Props, State> {
  _cm: CodeMirror.Editor
  _resizeInterval: number
  _errorLineHandle: any

  componentDidUpdate(prevProps: Props) {
    if (this.props.content !== prevProps.content &&
        this.props.content !== this._cm.getValue()) {
      this._cm.setValue(this.props.content);
    }
    if (this.props.errorLine !== prevProps.errorLine) {
      if (this._errorLineHandle) {
        this._cm.removeLineClass(this._errorLineHandle, 'background',
                                 'error-line');
        this._errorLineHandle = null;
      }
      if (this.props.errorLine) {
        this._errorLineHandle = this._cm.addLineClass(
          this.props.errorLine - 1,
          'background',
          'error-line'
        );
      }
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
    let wrapper = this._cm.getWrapperElement();
    let oldDisplay = wrapper.style.display;

    // We need to get the size of our container when it's
    // "uncorrupted" by the height of our codemirror widget, so
    // temporarily hide the widget.
    wrapper.style.display = 'none';

    let rectHeight = this.refs.container.getBoundingClientRect().height;

    wrapper.style.display = oldDisplay;

    this._cm.setSize(null, rectHeight);
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
