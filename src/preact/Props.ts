import { JSX } from "preact";
import { DefaultRootState, Store } from "../interfaces";

export interface Props<S = DefaultRootState> {
  store: Store<S>;
  children: JSX.Element[] | JSX.Element;
}