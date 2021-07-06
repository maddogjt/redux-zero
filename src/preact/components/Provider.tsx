import { Component, ComponentChild, JSX } from "preact";
import { DefaultRootState } from "../../interfaces/DefaultRootState";
import { Store } from "../../interfaces/Store";

import Props from "../../interfaces/Props";

export class Provider<S = DefaultRootState> extends Component<Props<S>> {
  getChildContext(): { store: Store<S> } {
    return { store: this.props.store };
  }
  render(): ComponentChild {
    return (
      (Array.isArray(this.props.children) && this.props.children[0]) ||
      (this.props.children as JSX.Element)
    );
  }
}
