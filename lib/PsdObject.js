/** @babel */
/** @jsx etch.dom */

import etch from 'etch';

export default class PsdObject {
  constructor(props, children) {
    this.props = props;
    this.children = children;
    etch.initialize(this);
  }

  update() {}

  render() {
    return (
      <div
        className={this.props.class}
        style={this.props.style}
        onClick={() => this.props.onClick(this.props.object)}
        onMouseMove={() => this.props.onMouseMove(this.props.object)}
      ></div>
    );
  }
}
