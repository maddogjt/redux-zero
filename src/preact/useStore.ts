import { useContext } from "preact/hooks";
import { getTypedContext } from "./store";
import { DefaultRootState, Store } from "../store";

export function useStore<S = DefaultRootState>(): Store<S> {
  return useContext(getTypedContext<S>());
}
