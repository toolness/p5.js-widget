import React = require("react");
import PureRenderMixin = require('react-addons-pure-render-mixin');

export default class PureComponent<P, S> extends React.Component<P, S> {
  shouldComponentUpdate() {
    return PureRenderMixin.shouldComponentUpdate.apply(this, arguments);
  }
}
