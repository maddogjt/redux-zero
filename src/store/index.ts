import { Action } from "../utils/bindAction";

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
