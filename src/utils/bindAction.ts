import { set } from "./set";
import { Store } from "..";

type ActionResult<S> = Partial<S> | Promise<Partial<S>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Action<S> = (state: S, ...args: any[]) => ActionResult<S>;

export type BoundActionResult<R extends ActionResult<any>> = R extends Promise<
  Partial<any>
>
  ? Promise<void>
  : void;

export type ActionArgs<T extends Action<any>> = T extends (
  state: any,
  ...args: infer Q
) => any
  ? Q
  : never;

export type BoundAction<S, A extends Action<S>> = (
  ...args: ActionArgs<A>
) => BoundActionResult<A>;

export function bindAction<S, A extends Action<S>>(
  store: Store<S>,
  action: A
): (...args: ActionArgs<A>) => BoundActionResult<A> {
  const f = (...args: ActionArgs<A>): BoundActionResult<A> => {
    if (typeof store.middleware === "function") {
      const mw = store.middleware(store, action, args);
      return mw as BoundActionResult<A>;
    }

    const newState = action(store.getState(), ...args);
    return set(store, newState) as BoundActionResult<A>;
  };

  return f;
}
