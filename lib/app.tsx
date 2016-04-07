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
}

interface AppState {
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
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onChange = (newValue: string) => {
    console.log("CHANGE", this);
  }

  onError = (message: string, line?: number) => {
    this.setState({ lastError: {
      message: message,
      line: line
    }});
  }

  render() {
    return (
      <div>
        <Editor initialContent={defaultSketchJS}
                onChange={this.onChange} />
        <Preview content={defaultSketchJS} onError={this.onError} />
        {this.state.lastError
          ? <ErrorMessage {...this.state.lastError} />
          : null}
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
