// import { Action } from "../../types";

export { useSelector } from "./useSelector";
export { useStore } from "./useStore";
export { useAction } from "./useAction";

// export interface TypedHooks<TState> {
//   typedUseSelector: <TSelected>(
//     selector: (state: TState) => TSelected
//   ) => TSelected;
//   typedUseAction: (
//     action: Action<TState>
//   ) => (...args: any[]) => Promise<void> | void;
// }
