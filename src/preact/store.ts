import { Context, createContext } from "preact";
import { DefaultRootState, Store } from "../";

export const StoreContext: Context<any> = createContext(null);

export function getTypedContext<S = DefaultRootState>(): Context<Store<S>> {
  return StoreContext as Context<Store<S>>;
}
