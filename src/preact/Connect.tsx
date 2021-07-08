/** @jsx h */
import { h, ComponentChild } from "preact";
import * as Preact from "preact";
import { useStore } from "./useStore";
import {
  ActionCreator,
  bindActions,
  BoundActionMap,
} from "../utils/bindActions";
import { Store } from "../store";
import { useCallback, useLayoutEffect, useState } from "preact/hooks";

type TMapToProps<S> = (store: S, props?: any) => any;

type MappedValues<S, P extends TMapToProps<S>, R extends ActionCreator<S>> = {
  store: Store<S>;
} & BoundActionMap<S, ReturnType<R>> &
  P;

interface Props2<S> {
  actions?: ActionCreator<S>;
  mapToProps: TMapToProps<S>;
  children: (
    mappedValues: MappedValues<S, TMapToProps<S>, ActionCreator<S>>
  ) => ComponentChild;
  ownProps?: unknown;
}

export function Connect<S>(props: Props2<S>): JSX.Element {
  const store = useStore<S>();

  const { mapToProps, children, actions } = props;
  const [mappedProps, setMappedProps] = useState({});
  const [mappedActions, setMappedActions] = useState({});

  const update = useCallback(() => {
    const state: S = store.getState();
    const mapped = mapToProps ? mapToProps(state, props) : state;

    setMappedProps(mapped);

    const tempActions = actions
      ? bindActions(actions, store, props.ownProps)
      : {};
    setMappedActions(tempActions);
  }, [store, props]);

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe(update);
    update();
    return unsubscribe;
  }, [store]);

  const child = (children && children[0]) || children;
  return child({ store, ...mappedProps, ...mappedActions });
}

export type StateMapper<T, S, I> = (state: S, props: T) => I;

type CType<P, S = unknown> =
  | Preact.FunctionComponent<P>
  | Preact.ComponentConstructor<P, S>;

export function connect<
  S,
  P extends TMapToProps<S>,
  R extends ActionCreator<S>
>(
  mapToProps: P,
  actions?: R
): (Child: CType<any, unknown>) => (props: any) => JSX.Element {
  type StoreProps = { store: Store<S> };
  return (Child: CType<any & StoreProps>) => (props: any) => {
    return (
      <Connect<S> mapToProps={mapToProps} actions={actions} ownProps={props}>
        {(mappedValues: MappedValues<S, P, R>) => (
          <Child {...mappedValues} {...props} />
        )}
      </Connect>
    );
  };
}
