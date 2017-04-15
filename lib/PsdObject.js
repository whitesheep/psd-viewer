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
      <div class={this.props.class} style={this.props.style} onClick={() => this.props.onClick(this.props.object)}></div>
    );
  }
}
