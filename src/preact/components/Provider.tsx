import { Component, JSX } from "preact";

import Props from "../../interfaces/Props";

export default class Provider<S = any> extends Component<Props<S>, {}> {
  getChildContext() {
    return { store: this.props.store };
  }
  render() {
    return (
      (Array.isArray(this.props.children) && this.props.children[0]) ||
      (this.props.children as JSX.Element)
    );
  }
}
