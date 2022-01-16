import React = require("react");
import * as Monaco from 'monaco-editor';

import PureComponent from "./pure-component";
import MonacoTheme from "./monaco-theme";
import UndoRedoHelper from "./undo-redo-helper";

// TODO: versions
const p5dts = require("!!raw-loader!@types/p5/global.d.ts") as string;
const p5Uri = "ts:p5.d.ts";
// const p5domdts = require("raw-loader!@types/p5/lib/addons/p5.dom.d.ts") as string;
// const p5sounddts = require("raw-loader!@types/p5/lib/addons/p5.sound.d.ts") as string;

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
  _ed: Monaco.editor.IStandaloneCodeEditor
  _resizeTimeout: number
  _errorLineHandle: any

  componentDidUpdate(prevProps: Props) {
    if (this.props.content !== prevProps.content &&
        this.props.content !== this._ed.getValue()) {
      this._ed.setValue(this.props.content);
    }
    if (this.props.errorLine !== prevProps.errorLine) {
      if (this._errorLineHandle) {
        this._ed.deltaDecorations(this._errorLineHandle, []);
        this._errorLineHandle = null;
      }
      if (this.props.errorLine) {
        this._errorLineHandle = this._ed.deltaDecorations([], [
          {
            range: {
              startColumn: 0,
              startLineNumber: this.props.errorLine,
              endColumn: 0,
              endLineNumber: this.props.errorLine,
            },
            options: {
              className: 'error-line',
              isWholeLine: true,
            }
          }
        ]);
      }
    }
  }

  componentDidMount() {
    Monaco.editor.defineTheme("p5-widget", MonacoTheme);
    this._ed = Monaco.editor.create(this.refs.container, {
      value: this.props.content,
      language: "javascript",

      // Style:
      theme: 'p5-widget',
      fontSize: 16,
      fontFamily: '"Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro", monospace',
      lineNumbersMinChars: 2,
      lineNumbers: "on",
      folding: false,
      minimap: {
        enabled: false,
      },
      guides: {
        indentation: false,
      },

      // Unclear what we need to do here.
      automaticLayout: true,
      fixedOverflowWidgets: true,
    });

    Monaco.languages.typescript.javascriptDefaults.addExtraLib(p5dts, p5Uri);
    // When resolving definitions and references, the editor will try to use created models.
    // Creating a model for the library allows "peek definition/references" commands to work with the library.
    Monaco.editor.createModel(p5dts, 'typescript', Monaco.Uri.parse(p5Uri));

    // This could adapt to the browser---detect what features are supported and
    // add those libraries to the `lib`s, beyond just ES2015, which
    // https://www.typescriptlang.org/tsconfig#target recommends for browsers in
    // general.
    //
    // We get errors like `Unhandled Promise Rejection: Error: Could not find
    // source file: 'inmemory://model/1'.` if we don't Object.assign here.
    const currentOptions = Monaco.languages.typescript.javascriptDefaults.getCompilerOptions();
    Monaco.languages.typescript.javascriptDefaults.setCompilerOptions(Object.assign({
      lib: ["dom", "es2015"],
      module: Monaco.languages.typescript.ModuleKind.None,
    }, currentOptions));

    this._ed.onDidChangeModelContent(() => {
      if (this.props.onChange) {
        // TODO: extract to helper?
        const helper = new UndoRedoHelper(this._ed);
        this.props.onChange(
          this._ed.getValue(),
          helper.canUndo(),
          helper.canRedo());
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
    this._ed = null;
    clearTimeout(this._resizeTimeout);
    window.removeEventListener('resize', this.resizeEditor, false);
  }

  undo() {
    const helper = new UndoRedoHelper(this._ed);
    helper.undo();
  }

  redo() {
    const helper = new UndoRedoHelper(this._ed);
    helper.redo();
  }

  resizeEditor = () => {
    // TODO: we can use auto-layout, but it looks like the context menu gets
    // clipped for small iframes.

    // let wrapper = this._cm.getContainerDomNode();
    // let oldDisplay = wrapper.style.display;

    // // We need to get the size of our container when it's
    // // "uncorrupted" by the height of our codemirror widget, so
    // // temporarily hide the widget.
    // wrapper.style.display = 'none';

    // let rectHeight = this.refs.container.getBoundingClientRect().height;
    // console.log(rectHeight);

    // wrapper.style.display = oldDisplay;

    // this._cm.layout();
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
