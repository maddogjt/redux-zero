import { useContext } from "preact/hooks";
import { getTypedContext } from "../components/Store";
import { Store } from "../../interfaces/Store";

export function useStore<TStore = any>(): Store<TStore> {
  return useContext(getTypedContext<TStore>());
}
