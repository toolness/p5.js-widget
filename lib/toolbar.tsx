import React = require("react");

interface Props {
  onPlayClick: () => void,
  onStopClick?: () => void,
  onRevertClick?: () => void
}

interface State {
}

// https://useiconic.com/open/
let OpenIconicMediaPlay = () => (
  <svg className="media-play" width="8" height="8" viewBox="0 0 8 8">
    <path d="M0 0v6l6-3-6-3z" transform="translate(1 1)" />
  </svg>
);

let OpenIconicMediaStop = () => (
  <svg className="media-stop" width="8" height="8" viewBox="0 0 8 8">
    <path d="M0 0v6h6v-6h-6z" transform="translate(1 1)" />
  </svg>
);

export default class Toolbar extends React.Component<Props, State> {
  render() {
    return (
      <div className="toolbar">
        <a className="p5-logo" href="http://p5js.org/" target="_blank">
          <img src="static/img/p5js-beta.svg" alt="p5js.org"/>
        </a>
        <button onClick={this.props.onPlayClick}>
          <OpenIconicMediaPlay/>
          Play
        </button>
        {this.props.onStopClick
          ? <button onClick={this.props.onStopClick}>
              <OpenIconicMediaStop/>
              Stop
            </button>
          : null }
        {this.props.onRevertClick
          ? <button onClick={this.props.onRevertClick}>Revert</button>
          : null}
      </div>
    );
  }
}
