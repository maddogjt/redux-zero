import { Action, bindAction } from "./";
import { Store } from "..";
import { BoundAction } from "./bindAction";

export interface ActionMap<K> {
  [actionName: string]: Action<K>;
}

export type BoundActionMap<S, T extends ActionMap<S>> = {
  [P in keyof T]: BoundAction<S, T[P]>;
};

export type ActionCreator<K> = (
  store: Store<K>,
  ownProps: unknown
) => ActionMap<K>;

export function bindActions<S, T extends ActionMap<S>>(
  actions: T | ((store: Store<S>, ownProps: unknown) => T),
  store: Store<S>,
  ownProps?: unknown
): BoundActionMap<S, T> {
  const actionsObject: T =
    typeof actions === "function" ? actions(store, ownProps) : actions;

  const bound: Partial<BoundActionMap<S, T>> = {};
  for (const name in actionsObject) {
    bound[name] = bindAction(store, actionsObject[name]);
  }

  return bound as BoundActionMap<S, T>;
}
