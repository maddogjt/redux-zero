/* eslint-disable @typescript-eslint/no-unused-vars */
import { Store } from "../interfaces";

// export type SyncAction<TState, TArgs extends unknown[]> = (
//   state: TState,
//   ...args: TArgs
// ) => Partial<TState>;
// export type AsyncAction<TState, TArgs extends unknown[]> = (
//   state: TState,
//   ...args: TArgs
// ) => Promise<Partial<TState>>;
export type Action<TState> = (
  state: TState,
  ...args: unknown[]
) => Partial<TState> | Promise<Partial<TState>>;

type OmitFirstArg<F> = F extends (x: unknown, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

export type FuncTypeWithoutFirstArg<TS, T extends Action<TS>> = T extends (
  arg1: TS,
  ...args: infer V
) => TS | Promise<TS>
  ? ReturnType<T> extends Promise<TS>
    ? (...args: V) => Promise<void>
    : (...args: V) => void
  : never;
export type ActionsObject<S> = { [action: string]: Action<S> };
export type Actions<TState> = (store: Store<TState>) => ActionsObject<TState>;
export type BoundActions<State, T extends Actions<State>> = {
  [P in keyof ReturnType<T>]: FuncTypeWithoutFirstArg<State, ReturnType<T>[P]>;
};
export type BoundActionsObject<State, T extends ActionsObject<State>> = {
  [P in keyof T]: FuncTypeWithoutFirstArg<State, T[P]>;
};

// interface ST {
//   a: number;
// }

// function foo(state: ST) {
//   return state;
// }

// async function bar(state: ST, _arg1: number): Promise<ST> {
//   return state;
// }
// function baz(state: ST, _arg1: number, _arg2: string) {
//   return state;
// }

// function whee(state: ST): Promise<ST> | ST {
//   return state;
// }

type ResolveReturn<T> = T extends Promise<undefined> ? Promise<void> : void;

// type Concrete = number | string | object;
type RemoveReturnAsync<F> = F extends (...args: infer Q) => infer R
  ? (...args: Q) => ResolveReturn<R>
  : never;

type RemoveReturnAsync2<F> = F extends (...args: infer Q) => unknown
  ? (...args: Q) => Promise<void> | void
  : never;

export type BoundAction<T> = RemoveReturnAsync<OmitFirstArg<T>>;
export type BoundAction2<T> = RemoveReturnAsync2<OmitFirstArg<T>>;

// export type ReturnType<
//   S,
//   TR extends Partial<S> | Promise<Partial<S>>
// > = TR extends Promise<Partial<S>>
//   ? Promise<void>
//   : TR extends Partial<S>
//   ? void
//   : TR extends any
//   ? Promise<void> | void
//   : never;

// export type BoundAction3<
//   S,
//   TActionCreator extends Action<S, any[]>
// > = TActionCreator extends (
//   state: S,
//   ...args: infer TParams
// ) => Promise<Partial<S>>
//   ? (...args: TParams) => Promise<void>
//   : TActionCreator extends (state: S, ...args: infer TParams) => Partial<S>
//   ? (...args: TParams) => void
//   : TActionCreator extends (state: S, ...args: infer TParams) => any
//   ? (...arts: TParams) => (Promise<void> | void)
//   : never;

// export type BoundAction4<
//   S,
//   TActionCreator extends Action<S, any[]>
// > = TActionCreator extends (
//   state: S,
//   ...args: infer TParams
// ) => Promise<Partial<S>> | Partial<S>
//   ? (...args: TParams) => Promise<void> | void
//   : never;

// type FO = OmitFirstArg<typeof foo>;
// type BA = OmitFirstArg<typeof bar>;
// type BZ = OmitFirstArg<typeof baz>;
// type WH = OmitFirstArg<typeof whee>;

// type FOR = RemoveReturnAsync<FO>;
// type BAR = RemoveReturnAsync<BA>;
// type BZR = RemoveReturnAsync<BZ>;
// type WHR = RemoveReturnAsync<WH>;

// type HMMM = BoundAction<typeof whee>;

// type FAIL = RemoveReturnAsync<(a: number) => void>;

// type TEST<F> = F extends object ? any : never;

// type TR = TEST<>;

// export const obj = {
//   foo,
//   bar,
//   baz,
// };

// export type BoundType = BoundActionsObject<ST, typeof obj>;
