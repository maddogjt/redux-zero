import { DefaultRootState } from "../interfaces/DefaultRootState";
import Store from "../interfaces/Store";

function isPromise<T>(s: T | Promise<T>): s is Promise<T> {
  return typeof s === "object" && typeof s["then"] === "function";
}

// export function set<S = DefaultRootState>(
//   store: Store<S>,
//   newState: Promise<Partial<S>>
// ): Promise<void>;

// export function set<S = DefaultRootState>(
//   store: Store<S>,
//   newState: Partial<S>
// ): void;

export function set<S = DefaultRootState>(
  store: Store<S>,
  newState: Partial<S> | Promise<Partial<S>>
): Promise<void> | void {
  if (newState != null) {
    if (isPromise(newState)) {
      return newState.then(store.setState);
    } else {
      store.setState(newState);
    }
  }
  return;
}

export default set;
