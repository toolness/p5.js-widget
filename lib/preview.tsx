import React = require("react");
import esprima = require("esprima");

import falafel from "./falafel";
import LoopInserter from "./loop-inserter";

const LOOP_CHECK_FUNC_NAME = '__loopCheck';

interface ErrorReporter {
  (message: string, line?: number): any
}

interface Props {
  content: string,
  timestamp: number,
  onError: ErrorReporter
}

interface State {

}

interface PreviewFrameProxy extends Window {
  startSketch: (sketch: string, p5version: string, maxRunTime: number,
                loopCheckFuncName: string, errorCb: ErrorReporter) => any
}

export default class Preview extends React.Component<Props, State> {
  _iframe: HTMLIFrameElement

  resetIframe() {
    let content = this.props.content;

    try {
      content = falafel(content, {}, LoopInserter(function(node) {
        return LOOP_CHECK_FUNC_NAME + "(" +
               JSON.stringify(node.range) + ");";
      })).toString();
    } catch (e) {
      // There's almost definitely a syntax error in the user's code;
      // just leave it unmangled and let the preview frame bubble up
      // the error.
    }

    if (this._iframe) {
      this._iframe.parentNode.removeChild(this._iframe);
      this._iframe = null;
    }
    let iframe = document.createElement('iframe');

    iframe.setAttribute('src', 'preview-frame.html');
    iframe.addEventListener('load', () => {
      // TODO: Do this in a way that doesn't mess things up if we
      // prematurely unmount.
      let frame = iframe.contentWindow as PreviewFrameProxy;
      frame.startSketch(content, '0.4.2', 1000,
                        LOOP_CHECK_FUNC_NAME, this.props.onError);
    });
    this.refs.container.appendChild(iframe);
    this._iframe = iframe;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.timestamp !== this.props.timestamp) {
      this.resetIframe();
    }
  }

  componentDidMount() {
    this.resetIframe();
  }

  componentWillUnmount() {
    this._iframe = null;
  }

  refs: {
    [key: string]: (Element)
    container: HTMLDivElement
  }

  render() {
    return <div ref="container"></div>;
  }
}
