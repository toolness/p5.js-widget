import React = require("react");

import PureComponent from "./pure-component";

interface Props {
  onPlayClick: () => void,
  onStopClick?: () => void,
  onUndoClick?: () => void,
  onRedoClick?: () => void,
  onRevertClick?: () => void
}

interface State {
}

// https://useiconic.com/open/
let OpenIconicMediaPlay = () => (
  <svg className="open-iconic media-play" width="8" height="8" viewBox="0 0 8 8">
    <path d="M0 0v6l6-3-6-3z" transform="translate(1 1)" />
  </svg>
);

let OpenIconicMediaStop = () => (
  <svg className="open-iconic media-stop" width="8" height="8" viewBox="0 0 8 8">
    <path d="M0 0v6h6v-6h-6z" transform="translate(1 1)" />
  </svg>
);

let OpenIconicActionUndo = () => (
  <svg className="open-iconic action-undo" width="8" height="8" viewBox="0 0 8 8">
    <path d="M4.5 0c-1.93 0-3.5 1.57-3.5 3.5v.5h-1l2 2 2-2h-1v-.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0-1.93-1.57-3.5-3.5-3.5z" transform="translate(0 1)" />
  </svg>
);

let OpenIconicActionRedo = () => (
  <svg className="open-iconic action-redo" width="8" height="8" viewBox="0 0 8 8">
    <path d="M3.5 0c-1.93 0-3.5 1.57-3.5 3.5 0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v.5h-1l2 2 2-2h-1v-.5c0-1.93-1.57-3.5-3.5-3.5z" transform="translate(0 1)" />
  </svg>
);

export default class Toolbar extends PureComponent<Props, State> {
  render() {
    return (
      <div className="toolbar">
        <a className="p5-logo" href="http://p5js.org/" target="_blank">
          <svg>
            <use xlinkHref="static/img/p5js-beta.svg#p5js-beta"/>
          </svg>
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
        {this.props.onUndoClick
          ? <button onClick={this.props.onUndoClick}>
              <OpenIconicActionUndo/>
              Undo
            </button>
          : null}
        {this.props.onRedoClick
          ? <button onClick={this.props.onRedoClick}>
              <OpenIconicActionRedo/>
              Redo
            </button>
          : null}
        {this.props.onRevertClick
          ? <button onClick={this.props.onRevertClick}>Revert</button>
          : null}
      </div>
    );
  }
}
