/**
 * This interface can be augmented by users to add default types for the root state when
 * using `react-redux`.
 * Use module augmentation to append your own type definition in a your_custom_type.d.ts file.
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */

import { Action } from "../types";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DefaultRootState {}

export type Middleware<S> = (
  store: Store<S>,
  action: Action<S>,
  ...args: unknown[]
) => void | Promise<void>;

export interface Store<S = DefaultRootState> {
  middleware: Middleware<S>;
  setState(f: ((state: S) => Partial<S>) | Partial<S>): void;
  subscribe(f: (state: S) => void): () => void;
  getState(): S;
  reset(): void;
}
