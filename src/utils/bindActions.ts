// import { bindAction3, RType } from "./bindAction";
import { Store } from "../interfaces";
import { ActionsObject, BoundActionsObject, /*Action*/ } from "../types";

// type OmitFirstArg<F, R> = F extends (x: unknown, ...args: infer P) => R
//   ? (...args: P) => R
//   : never;

export function bindActions<S, T extends ActionsObject<S>>(
  _actions: (store: Store<S>, ownProps: unknown) => T | T,
  _store: Store<S>,
  _ownProps?: unknown
): BoundActionsObject<S, T> {
  // const actionsObject: T =
    // typeof actions === "function" ? actions(store, ownProps) : actions;

  const bound: Partial<BoundActionsObject<S, T>> = {};
  // for (const name in actionsObject) {
    // const a: Action<S, unknown[]> = actionsObject[name];
    // bound[name] = bindAction3<
    //   unknown[],
    //   Partial<S> | Promise<Partial<S>>,
    //   RType<Partial<S> | Promise<Partial<S>>>,
    //   S
    // >(store, a);
  // }

  return bound as BoundActionsObject<S, T>;
}

export default bindActions;

/*
import bindAction from "./bindAction";
import Store from "../interfaces/Store";
import { Action } from "../types";

type OmitFirstArg<F, R> = F extends (x: any, ...args: infer P) => any
  ? (...args: P) => R
  : never;

export default function bindActions<S, T extends { [key: string]: Action<S> }>(
  actions: ((store: Store<S>, ownProps: any) => T) | T,
  store: Store<S>,
  ownProps?: object
): { [K in keyof T]: OmitFirstArg<T[K], Promise<void> | void> } {
  actions = typeof actions === "function" ? actions(store, ownProps) : actions;

  let bound: { [key: string]: (...args: any[]) => Promise<void> | void } = {};
  for (let name in actions) {
    const action = (actions as T)[name];

    bound[name] = bindAction(action, store);
  }

  return bound as { [K in keyof T]: OmitFirstArg<T[K], Promise<void> | void> };
}


*/
