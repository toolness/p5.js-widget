import ReactDOM = require("react-dom");
import React = require("react");

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
    this.setState({ editorContent: this.props.initialContent });
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
    return (
      <div>
        <button onClick={this.handlePlayClick}>Play</button>
        {this.state.isPlaying
          ? (<button onClick={this.handleStopClick}>Stop</button>)
          : null }
        {this.state.editorContent !== this.props.initialContent
          ? <button onClick={this.handleRevertClick}>Revert</button>
          : null}
        <Editor content={this.state.editorContent}
                onChange={this.handleEditorChange} />
        {this.state.isPlaying
          ? (<div>
               <Preview content={this.state.previewContent}
                        timestamp={this.state.startPlayTimestamp}
                        onError={this.handlePreviewError} />
               {this.state.lastError
                ? <ErrorMessage {...this.state.lastError} />
                : null}
             </div>)
          : null}
      </div>
    );
  }
}

ReactDOM.render(
  <App initialContent={defaultSketchJS} autoplay={true} />,
  document.getElementById('app')
);
