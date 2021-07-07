import { Context, createContext } from "preact";
import { DefaultRootState, Store } from "../interfaces";

const gContext: Context<unknown> = createContext(null);

export function getTypedContext<S = DefaultRootState>(): Context<Store<S>> {
  return gContext as Context<Store<S>>;
}
