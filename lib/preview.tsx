import React = require("react");

interface Props {
  content: string
}

interface State {

}

let html = `<!DOCTYPE html>
<meta charset="utf-8">
<title>Preview</title>
<body>
  <script src="lib/preview-frame.js"></script>
</body>
`;

interface PreviewFrameProxy extends Window {
  startSketch: (sketch: string, p5version: string) => any
}

export default class Preview extends React.Component<Props, State> {
  _iframe: HTMLIFrameElement

  resetIframe() {
    if (this._iframe) {
      this._iframe.parentNode.removeChild(this._iframe);
      this._iframe = null;
    }
    let iframe = document.createElement('iframe');
    this.refs.container.appendChild(iframe);
    this._iframe = iframe;
    iframe.addEventListener('load', () => {
      // TODO: Do this in a way that doesn't mess things up if we
      // prematurely unmount.
      let frame = iframe.contentWindow as PreviewFrameProxy;
      frame.startSketch(this.props.content, '0.4.2');
    });
    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
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
