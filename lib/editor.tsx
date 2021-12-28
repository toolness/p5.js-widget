import React = require("react");

// import CodeMirror = require("codemirror");
import Monaco = require("monaco-editor");

import "codemirror/mode/javascript/javascript.js";

import PureComponent from "./pure-component";

// It seems like CodeMirror behaves oddly with a flexbox layout, so
// we will manually size it. However, Chrome seems to have a bug
// whereby we need to wait a bit before resizing it after the
// component initially mounts (this isn't required for Firefox or MS Edge).
const INITIAL_RESIZE_DELAY_MS = 100;

interface Props {
  content?: string
  errorLine?: number
  onChange?: (newValue: string, canUndo: boolean, canRedo: boolean) => void
}

interface State {
}

export default class Editor extends PureComponent<Props, State> {
  _cm: Monaco.editor.IStandaloneCodeEditor
  _resizeTimeout: number
  _errorLineHandle: any

  componentDidUpdate(prevProps: Props) {
    if (this.props.content !== prevProps.content &&
        this.props.content !== this._cm.getValue()) {
      this._cm.setValue(this.props.content);
    }
    if (this.props.errorLine !== prevProps.errorLine) {
      if (this._errorLineHandle) {
        this._cm.deltaDecorations(this._errorLineHandle, []);
        // this._cm.removeLineClass(this._errorLineHandle, 'background',
        //                          'error-line');
        this._errorLineHandle = null;
      }
      if (this.props.errorLine) {
        this._errorLineHandle = this._cm.deltaDecorations([], [
          {
            range: {
              startColumn: 0,
              startLineNumber: this.props.errorLine - 1,
              endColumn: 0,
              endLineNumber: this.props.errorLine,
            },
            options: {
              linesDecorationsClassName: 'error-line'
            }
          }
        ]);
        // this._errorLineHandle = this._cm.addLineClass(
        //   this.props.errorLine - 1,
        //   'background',
        //   'error-line'
        // );
      }
    }
  }

  componentDidMount() {
    this._cm = Monaco.editor.create(this.refs.container, {
      theme: 'p5-widget',
      value: this.props.content,
      lineNumbers: "on",
    });
    // this._cm = CodeMirror(this.refs.container, {
    //   theme: 'p5-widget',
    //   value: this.props.content,
    //   lineNumbers: true,
    //   mode: 'javascript'
    // });
    this._cm.onDidChangeModelContent(() => {
      if (this.props.onChange) {
        // let size = this._cm.getDoc().historySize();
        // TODO:
        let size = { undo: 0, redo: 0 };
        this.props.onChange(this._cm.getValue(),
                            size.undo > 0, size.redo > 0);
      }
    });
    this.resizeEditor();
    this._resizeTimeout = setTimeout(this.resizeEditor,
                                     INITIAL_RESIZE_DELAY_MS);
    window.addEventListener('resize', this.resizeEditor, false);
  }

  componentWillUnmount() {
    // CodeMirror instances have no remove/destroy methods, so we
    // don't need to do anything: http://stackoverflow.com/a/18890324/2422398
    this._cm = null;
    clearTimeout(this._resizeTimeout);
    window.removeEventListener('resize', this.resizeEditor, false);
  }

  undo() {
    // TODO:
    // this._cm.executeCommand();
  }

  redo() {
    // TODO:
    // this._cm.getDoc().redo();
  }

  resizeEditor = () => {
    let wrapper = this._cm.getContainerDomNode();
    let oldDisplay = wrapper.style.display;

    // We need to get the size of our container when it's
    // "uncorrupted" by the height of our codemirror widget, so
    // temporarily hide the widget.
    wrapper.style.display = 'none';

    let rectHeight = this.refs.container.getBoundingClientRect().height;

    wrapper.style.display = oldDisplay;

    // TODO: may be unnec.
    // this._cm.resize(null, rectHeight);
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
