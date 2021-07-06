import { JSX } from "preact";
import { DefaultRootState } from "./DefaultRootState";
import { Store } from "./Store";

export interface Props<S = DefaultRootState> {
  store: Store<S>;
  children: JSX.Element[] | JSX.Element;
}

export default Props;
