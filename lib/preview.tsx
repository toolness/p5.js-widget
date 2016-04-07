import React = require("react");

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
  startSketch: (sketch: string, p5version: string,
                errorCb: ErrorReporter) => any
}

export default class Preview extends React.Component<Props, State> {
  _iframe: HTMLIFrameElement

  resetIframe() {
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
      frame.startSketch(this.props.content, '0.4.2', this.props.onError);
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
