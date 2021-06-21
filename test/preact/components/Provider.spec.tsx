/// <reference types="enzyme-adapter-preact-pure" />  
import { h } from "preact";
import { mount } from "enzyme";

import { createStore, Store } from "../../../src";
import { Provider } from "../../../src/preact";

describe("redux-zero - react bindings", () => {
  const listener = jest.fn();
  let store: Store<any>;
  beforeEach(() => {
    store = createStore({});
    listener.mockReset();
    store.subscribe(listener);
  });

  describe("Provider", () => {
    it("should provide the store in the apps context", () => {
      store.setState({ message: "hello" });

      const Comp = (_props, context) => <h1>{String(!!context.store)}</h1>;

      const App = () => (
        <Provider store={store}>
          <Comp />
        </Provider>
      );

      const wrapper = mount(<App />);
      expect(wrapper.find("h1").matchesElement(<h1>Increment</h1>)).toEqual(true);
    });
  });
});
