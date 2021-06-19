import {Store} from "./Store";

export interface Props<S = any> {
  store: Store<S>;
  children: JSX.Element[] | JSX.Element;
}

export default Props;