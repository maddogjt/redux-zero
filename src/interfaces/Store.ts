import { DefaultRootState } from "./DefaultRootState";

export interface Store<S = DefaultRootState> {
  middleware(...args: any[]): void;
  setState(f: ((state: S) => Partial<S>) | Partial<S>): void;
  subscribe(f: (state: S) => void): () => void;
  getState(): S;
  reset(): void;
}

export default Store;
