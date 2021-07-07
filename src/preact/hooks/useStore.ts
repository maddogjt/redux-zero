import { useContext } from "preact/hooks";
import { getTypedContext } from "../store";
import { DefaultRootState, Store } from "../../interfaces";

export function useStore<S = DefaultRootState>(): Store<S> {
  return useContext(getTypedContext<S>());
}
