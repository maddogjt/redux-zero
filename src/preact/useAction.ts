import { useMemo } from "preact/hooks";
import { useStore } from "./useStore";
import { Action, bindAction } from "../utils";
import { ActionArgs, BoundActionResult } from "../utils/bindAction";

// tuple<T extends any[]>(...args: T)

// export declare type TypedAction<TState, TArgs extends any[]> = (
// state: TState,
// ...args: TArgs
// ) => Promise<Partial<TState>> | Partial<TState>;
// export declare type FuncTypeWithoutFirstArg<T extends (...args: any[]) => any> =
//   T extends (arg1: infer U, ...args: infer V) => infer Q
//     ? (...args: V) => void
//     : any;
// export declare type ActionsObject<S> = {
//   [action: string]: Action<S>;
// };
// export declare type Actions<T> = (store: Store<T>) => ActionsObject<T>;
// export declare type BoundActions<State, T extends Actions<State>> = {
//   [P in keyof ReturnType<T>]: FuncTypeWithoutFirstArg<ReturnType<T>[P]>;
// };

export function useAction<
  T extends Action<any>,
  S = T extends (a: infer Q, ...args: any[]) => any ? Q : never
>(action: T): (...args: ActionArgs<T>) => BoundActionResult<T> {
  const store = useStore<S>();

  return useMemo(() => {
    return bindAction(store, action);
  }, [store, action]);
}
