import ReactDOM = require("react-dom");
import React = require("react");
import url = require("url");

import Editor from "./editor";
import Preview from "./preview";

let defaultSketchJS = require("raw!./default-sketch.js") as string;

require("../css/style.css");

interface ErrorMessage {
  message: string,
  line?: number
}

interface AppProps {
  initialContent: string,
  previewWidth: number,
  autoplay?: boolean
}

// Ugh, in practice, not all of these are truly optional, but we need
// to declare them as such in order to actually use setState() without
// ridiculous amounts of repetition.
//
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/4809
interface AppState {
  isPlaying?: boolean
  startPlayTimestamp?: number
  previewContent?: string
  editorContent?: string
  lastError?: ErrorMessage
}

let ErrorMessage = (props: ErrorMessage) => (
  <div className="error-message">
    Line {props.line}: {props.message}
  </div>
);

class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      previewContent: this.props.initialContent,
      editorContent: this.props.initialContent
    };
  }

  componentDidMount() {
    if (this.props.autoplay) {
      this.handlePlayClick();
    }
  }

  handleEditorChange = (newValue: string) => {
    this.setState({ editorContent: newValue });
  }

  handlePreviewError = (message: string, line?: number) => {
    this.setState({
      lastError: {
        message: message,
        line: line
      }
    });
  }

  handleRevertClick = () => {
    this.setState({
      isPlaying: false,
      editorContent: this.props.initialContent
    });
  }

  handlePlayClick = () => {
    this.setState((prevState, props) => ({
      isPlaying: true,
      previewContent: prevState.editorContent,
      startPlayTimestamp: Date.now(),
      lastError: null
    }));
  }

  handleStopClick = () => {
    this.setState({ isPlaying: false });
  }

  render() {
    let errorLine = null;

    if (this.state.lastError &&
        this.state.editorContent === this.state.previewContent) {
      errorLine = this.state.lastError.line;
    }

    return (
      <div className="app">
        <div className="toolbar">
          <button onClick={this.handlePlayClick}>Play</button>
          {this.state.isPlaying
            ? <button onClick={this.handleStopClick}>Stop</button>
            : null }
          {this.state.editorContent !== this.props.initialContent
            ? <button onClick={this.handleRevertClick}>Revert</button>
            : null}
        </div>
        <div className="panes">
          <Editor content={this.state.editorContent}
                  errorLine={errorLine}
                  onChange={this.handleEditorChange} />
          <div className="preview-holder-wrapper">
          {this.state.isPlaying
            ? <Preview content={this.state.previewContent}
                       width={this.props.previewWidth}
                       timestamp={this.state.startPlayTimestamp}
                       onError={this.handlePreviewError} />
            : null}
          </div>
        </div>
        <div className="status-bar">
          {this.state.lastError
           ? <ErrorMessage {...this.state.lastError} />
           : null}
        </div>
      </div>
    );
  }
}

function start() {
  let qs = url.parse(window.location.search, true).query;
  let autoplay = ('autoplay' in qs);

  ReactDOM.render(
    <App initialContent={defaultSketchJS}
         previewWidth={150}
         autoplay={autoplay} />,
    document.getElementById('app-holder')
  );
}

start();
