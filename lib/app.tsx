/// <reference path="../typings/react.d.ts"/>
/// <reference path="../typings/react-dom.d.ts"/>
/// <reference path="../typings/custom.d.ts"/>

import ReactDOM = require("react-dom");
import React = require("react");

import Editor from "./editor";

let defaultSketchJS = require("raw!./default-sketch.js") as string;

require("../css/style.css");

interface AppProps {
}

interface AppState {
  counter: number
}

class App extends React.Component<AppProps, AppState> {
  _interval: number

  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  componentDidMount() {
    this._interval = setInterval(() => {
      this.setState((prevState, prevProps) => {
        return { counter: prevState.counter + 1 };
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <div>
        <p>Hello from react {this.state.counter}</p>
        <Editor initialContent={defaultSketchJS}/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
