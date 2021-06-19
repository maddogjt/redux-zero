import { useContext } from "preact/compat";
import { getTypedContext } from "../components/Store";
import {Store} from "../../interfaces/Store";

export function useStore<TStore = any>(): Store<TStore> {
  return useContext(getTypedContext<TStore>());
}
