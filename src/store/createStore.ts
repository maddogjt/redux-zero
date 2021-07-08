import { Store, DefaultRootState, Middleware } from "../";

function createStore<S extends DefaultRootState>(): Store<S>;
function createStore<S extends DefaultRootState>(
  initialState?: S,
  middleware?: Middleware<S>
): Store<S>;
function createStore<S extends DefaultRootState>(
  initialState?: Partial<S>,
  middleware?: Middleware<S>
): Store<S>;
function createStore<S extends DefaultRootState>(
  initialState: Partial<S> | S = {},
  middleware: Middleware<S> = null
): Store<S> {
  type TListener = (state: S) => void;
  let state: S = initialState as S;
  const listeners: TListener[] = [];

  function dispatchListeners() {
    listeners.forEach((f) => f(state));
  }

  return {
    middleware,
    setState(update: ((state: Partial<S>) => Partial<S>) | Partial<S>) {
      state = {
        ...state,
        ...(typeof update === "function" ? update(state) : update),
      };

      dispatchListeners();
    },
    subscribe(f: TListener) {
      listeners.push(f);
      return () => {
        listeners.splice(listeners.indexOf(f), 1);
      };
    },
    getState(): S {
      return state;
    },
    reset() {
      state = initialState as S;
      dispatchListeners();
    },
  };
}
export { createStore };
