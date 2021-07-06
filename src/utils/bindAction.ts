// import { set } from "./set";
import Store from "../interfaces/Store";
import { DefaultRootState } from "../interfaces/DefaultRootState";

export interface BindAction<S = DefaultRootState> {
  <TArgs extends unknown[]>(
    store: Store<S>,
    action: (s: S, ...args: TArgs) => Promise<Partial<S>>
  ): (...args: TArgs) => Promise<void>;

  <TArgs extends unknown[]>(
    store: Store<S>,
    action: (s: S, ...args: TArgs) => Partial<S>
  ): (...args: TArgs) => void;

  <TArgs extends unknown[]>(
    store: Store<S>,
    action: (s: S, ...args: TArgs) => Partial<S> | Promise<Partial<S>>
  ): (...args: TArgs) => void | Promise<void>;
}

export type RType<T> = T extends Promise<Partial<unknown>>
  ? Promise<void>
  : T extends Partial<unknown>
  ? void
  : Promise<void> | void;

function isPromise<T>(s: T | Promise<T>): s is Promise<T> {
  return typeof s === "object" && typeof s["then"] === "function";
}

export function bindAction3<
  TArgs extends unknown[],
  // R extends Partial<S> | Promise<Partial<S>>,
  RT extends RType<Partial<S> | Promise<Partial<S>>>,
  S = DefaultRootState
>(
  store: Store<S>,
  action: (s: S, ...args: TArgs) => Partial<S> | Promise<Partial<S>>
): (...args: TArgs) => RT {
  return (...args: TArgs): RT => {
    if (typeof store.middleware === "function") {
      const mw = store.middleware(store, action, args) as unknown;
      return mw as RT;
    }
    let result: void | Promise<void>;
    const newState = action(store.getState(), ...args);
    if (newState != null) {
      if (isPromise(newState)) {
        result = newState.then(store.setState);
      } else {
        store.setState(newState);
      }
    }
    return result as RT;
    // return set(store, action(store.getState(), ...args));
  };
}

// type BindActionT<> = BindAction<DefaultRootState, T>;

// export function bindAction<S, A extends Action<S, any[]>>(
//   action: A,
//   store: Store<S>
// ): BoundAction5<S, A> {
//   // const bound: BoundAction<Action<S, T>> = (...args: T) => {};
//   return function (...args: any[]): void | Promise<void> {
//     return;
//   };
//   // return tr;
//   // return (...args: T) => {
//   //   const newState: Partial<S> | Promise<Partial<S>> = action(store.getState(), ...args);
//   //   return set(store, newState);
//   // };
// }

// type DRS = { num: number; str: string };
// interface ST {
//   foo: number;
//   bar: string;
// }

// const action1 = (s: ST) => {
//   return s;
// };
// const action2 = (s: ST, _foo: number, _bar: string) => {
//   return s;
// };
// const action3 = (s: DRS) => {
//   return Promise.resolve(s);
// };
// let action4: Action<ST, [number]>;
//  = (s: DefaultRootState, _whee: number): Promise<DefaultRootState> | DefaultRootState =>
// {
//   return Promise.resolve(s);
// };

// let dst: Store<ST>;

// type B1 = BoundAction4<DefaultRootState, typeof action1>;
// type B2 = BoundAction4<DefaultRootState, typeof action2>;
// type B3 = BoundAction4<DefaultRootState, typeof action3>;
// type B4 = BoundAction4<ST, typeof action4>;

// let drs: Store<DRS>;

// let rs: Store<DefaultRootState>;
// const setRes = bindAction3(dst, action1);
// const setRes2 = bindAction3(dst, action2);
// const setRes3 = bindAction3(drs, action3);
// const setRes4 = bindAction3(dst, action4);

export default bindAction3;
