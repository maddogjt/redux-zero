import preact, {createContext} from "preact";
import { Store } from "../../interfaces/Store"; 
// import { useSelector } from "../hooks";

export const Context: preact.Context<any> = createContext(undefined);

// interface TypedContext<TState = any> {
//   context: preact.Context<Store<TState>>;

// }

// * const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export interface TypedUseSelectorHook<TState> {
  <TSelected>(
    selector: (state: TState) => TSelected
  ): TSelected;
}

// const useTypedSelector: TypedUseSelectorHook<string> = useSelector;


export function getTypedContext<TStore>() : preact.Context<Store<TStore>> {
    return Context as preact.Context<Store<TStore>>;
}

// function createChild<TStore, PT>(
//     props: PT,
//     Child: (props: PT & {store: Store<TStore>}) => JSX.Element,
//     store: Store<TStore>)
//  {
//         return (
//           <Child {...props} store={store} />
//         );
//   }


// function Connect<TStore, PT>(props: PT) {
//     const StoreContext = getStoreContext<TStore>();
//    return (Child: (props: PT) => JSX.Element) => {
//     return createChild(this.props, Child, StoreContext);    
//    }
//   );
// }

// export function createConnector<
//   R,
//   A extends Actions<RootState> | ActionsObject<RootState>,
//   PT extends R & BoundActions<RootState, Actions<RootState>>
// >(mapToProps: (store: RootState) => R, actions: A) {
//   return (Child: (props: PT) => JSX.Element) =>
//     class ConnectWrapper extends Component<any, {}> {
//       render() {
//         const { props } = this;
//         return (
//           <Connect {...props} mapToProps={mapToProps} actions={actions}>
//             {(mappedProps: any) => <Child {...mappedProps} {...props} />}
//           </Connect>
//         );
//       }
//     };
// }


// function App() {
//   return (
//     <Store.Provider value="dark">
//       <SomeComponent>
//         <ThemedButton />
//       </SomeComponent>
//     </Store.Provider>
//   );
// }
