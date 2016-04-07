/// <reference path="../typings/codemirror.d.ts"/>
/// <reference path="../typings/react.d.ts"/>
/// <reference path="../typings/react-dom.d.ts"/>
/// <reference path="../typings/custom.d.ts"/>

import ReactDOM = require("react-dom");
import React = require("react");
import CodeMirror = require("codemirror");

import "codemirror/mode/javascript/javascript.js";

let defaultSketchJS = require("raw!./default-sketch.js");

require("../sass/styles.scss");

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
    return <p>Hello from react {this.state.counter}</p>;
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

var cm = CodeMirror(document.getElementById('codemirror'), {
  value: defaultSketchJS,
  mode: 'javascript'
});
