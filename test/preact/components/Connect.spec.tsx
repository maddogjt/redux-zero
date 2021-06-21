/// <reference types="enzyme-adapter-preact-pure" />
import { h } from "preact";
import { mount } from "enzyme";

import { createStore, Store } from "../../../src";
import { Provider, Connect, connect } from "../../../src/preact";

describe("redux-zero - preact bindings", () => {
  let store: Store<any>, listener;
  beforeEach(() => {
    store = createStore({});
    listener = jest.fn();
    store.subscribe(listener);
  });

  describe("connect HOC", () => {
    it("should provide the state and subscribe to changes", () => {
      store.setState({ message: "hello" });

      const Comp = ({ message }) => <h1>{message}</h1>;

      const mapToProps = ({ message }) => ({ message });

      const ConnectedComp = connect(mapToProps)(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      let context = mount(<App />);
      expect(context.contains(<h1>hello</h1>)).toBe(true);
      store.setState({ message: "bye" });
      context = mount(<App />);
      expect(context.contains(<h1>bye</h1>)).toBe(true);
    });

    it("should provide the actions and subscribe to changes", () => {
      store.setState({ count: 0 });

      const Comp = ({ count, increment }) => (
        <h1 onClick={increment}>{count}</h1>
      );

      const mapToProps = ({ count }) => ({ count });

      const actions = (_store) => ({
        increment: (state) => ({ count: state.count + 1 }),
      });

      const ConnectedComp = connect(mapToProps, actions)(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      let context = mount(<App />);
      expect(context.find("h1").text()).toBe("0");
      context.find("[onClick]").simulate("click");
      context.find("[onClick]").simulate("click");
      expect(context.find("h1").text()).toBe("2");
    });

    it("should provide actions with parameters and subscribe to changes", () => {
      store.setState({ count: 0 });

      const Comp = ({ count, incrementOf }) => (
        <h1 onClick={() => incrementOf(10)}>{count}</h1>
      );

      const mapToProps = ({ count }) => ({ count });

      const actions = (_store) => ({
        incrementOf: (state, value) => ({ count: state.count + value }),
      });

      const ConnectedComp = connect(mapToProps, actions)(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      let context = mount(<App />);
      expect(context.find("h1").text()).toBe("0");
      context.find("[onClick]").simulate("click");
      context.find("[onClick]").simulate("click");
      expect(context.find("h1").text()).toBe("20");
    });

    it("should peform async actions correctly", (done) => {
      store.setState({ count: 0 });

      const Comp = ({ count, increment }) => (
        <h1 onClick={increment}>{count}</h1>
      );

      const mapToProps = ({ count }) => ({ count });

      const actions = ({ getState, setState }) => ({
        increment() {
          setState({ pending: true });

          return Promise.resolve()
            .then(() => {
              setState({ pending: false, count: getState().count + 1 });
            })
            .then(() => {
              setState({ count: getState().count + 1 });

              const [state0, state1, state2, state3] = listener.mock.calls.map(
                ([c]) => c
              );

              expect(state0.count).toBe(0);
              expect(state1.pending).toBe(true);
              expect(state1.count).toBe(0);
              expect(state2.pending).toBe(false);
              expect(state2.count).toBe(1);
              expect(state3.count).toBe(2);

              done();
            });
        },
      });

      const ConnectedComp = connect(mapToProps, actions)(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      let context = mount(<App />);
      context.find("[onClick]").simulate("click");
    });

    it("should provide the store as a prop", () => {
      const Comp = ({ store }) => <h1>{String(!!store)}</h1>;

      const mapToProps = (state) => state;

      const ConnectedComp = connect(mapToProps)(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      let context = mount(<App />);
      expect(context.find("h1").text()).toBe("true");
    });

    it("should connect with nested children", () => {
      store.setState({ message: "hello" });

      const Comp = ({ message, children }) => (
        <div>
          parent {message} {children}
        </div>
      );
      const ChildComponent = ({ message }) => <span>child {message}</span>;

      const mapToProps = ({ message }) => ({ message });

      const ConnectedComp = connect(mapToProps)(Comp);
      const ConnectedChildComp = connect(mapToProps)(ChildComponent);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp>
            <ConnectedChildComp />
          </ConnectedComp>
        </Provider>
      );

      let context = mount(<App />);

      expect(
        context.contains(
          <div>
            parent hello <span>child hello</span>
          </div>
        )
      ).toBe(true);

      store.setState({ message: "bye" });

      context = mount(<App />);

      expect(
        context.contains(
          <div>
            parent bye <span>child bye</span>
          </div>
        )
      ).toBe(true);
    });

    it("should connect return all state when mapToProps is not passed", () => {
      store.setState({ message: "Hey!" });
      const Comp = ({ message }) => <h1>{message}</h1>;
      const ConnectedComp = connect(undefined)(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      let context = mount(<App />);
      expect(context.contains(<h1>Hey!</h1>)).toBe(true);
    });

    it("should accept ownProps as the second parameter to mapToProps", () => {
      const Comp = ({ message }) => <h1>{message}</h1>;
      const ConnectedComp = connect((_state, ownProps) => ({
        message: ownProps.someProp,
      }))(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp someProp="some value" />
        </Provider>
      );

      let context = mount(<App />);
      expect(context.contains(<h1>some value</h1>)).toBe(true);
    });

    it("should provide the state and map again when component props change", () => {
      store.setState({
        messages: {
          foo: "hello",
          bar: "bye",
        },
      });

      const Comp = ({ message }) => <h1>{message}</h1>;

      const mapToProps = ({ messages }, { name }) => ({
        message: messages[name],
      });

      const ConnectedComp = connect(mapToProps)(Comp);

      const App = ({ name }) => (
        <Provider store={store}>
          <ConnectedComp name={name} />
        </Provider>
      );

      let context = mount(<App name="foo" />);
      expect(context.contains(<h1>hello</h1>)).toBe(true);

      context = mount(<App name="bar" />);
      expect(context.contains(<h1>bye</h1>)).toBe(true);
    });
  });

  describe("Connect component", () => {
    it("should provide the state and subscribe to changes", () => {
      store.setState({ message: "hello" });

      const mapToProps = ({ message }) => ({ message });

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps}>
          {({ message }) => <h1>{message}</h1>}
        </Connect>
      );

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      let context = mount(<App />);
      expect(context.contains(<h1>hello</h1>)).toBe(true);
      store.setState({ message: "bye" });
      context = mount(<App />);
      expect(context.contains(<h1>bye</h1>)).toBe(true);
    });

    it("should provide the actions and subscribe to changes", () => {
      store.setState({ count: 0 });

      const mapToProps = ({ count }) => ({ count });

      const actions = (_store) => ({
        increment: (state) => ({ count: state.count + 1 }),
      });

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps} actions={actions}>
          {({ count, increment }) => <h1 onClick={increment}>{count}</h1>}
        </Connect>
      );

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      let context = mount(<App />);
      expect(context.find("h1").text()).toBe("0");
      context.find("[onClick]").simulate("click");
      context.find("[onClick]").simulate("click");
      expect(context.find("h1").text()).toBe("2");
    });

    it("should provide actions with ownprops", () => {
      store.setState({ count: 0 });

      const mapToProps = ({ count }) => ({ count });

      const actions = (_store, ownProps) => ({
        increment: (state) => ({ count: state.count + ownProps.add }),
      });

      const Comp = ({ count, increment }) => (
        <h1 onClick={increment}>{count}</h1>
      );

      const ConnectedComp = connect(mapToProps, actions)(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp add={10} />
        </Provider>
      );

      let context = mount(<App />);
      expect(context.find("h1").text()).toBe("0");
      context.find("[onClick]").simulate("click");
      context.find("[onClick]").simulate("click");
      expect(context.find("h1").text()).toBe("20");
    });

    it("should peform async actions correctly", (done) => {
      store.setState({ count: 0 });

      // const Comp = ({ count, increment }) => (
      //   <h1 onClick={increment}>{count}</h1>
      // );

      const mapToProps = ({ count }) => ({ count });

      const actions = ({ getState, setState }) => ({
        increment() {
          setState({ pending: true });

          return Promise.resolve()
            .then(() => {
              setState({ pending: false, count: getState().count + 1 });
            })
            .then(() => {
              setState({ count: getState().count + 1 });

              const [state0, state1, state2, state3] = listener.mock.calls.map(
                ([c]) => c
              );

              expect(state0.count).toBe(0);
              expect(state1.pending).toBe(true);
              expect(state1.count).toBe(0);
              expect(state2.pending).toBe(false);
              expect(state2.count).toBe(1);
              expect(state3.count).toBe(2);

              done();
            });
        },
      });

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps} actions={actions}>
          {({ count, increment }) => <h1 onClick={increment}>{count}</h1>}
        </Connect>
      );

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      let context = mount(<App />);

      context.find("[onClick]").simulate("click");
    });

    it("should provide the store as a prop", () => {
      const mapToProps = (state) => state;

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps}>
          {({ store }) => <h1>{String(!!store)}</h1>}
        </Connect>
      );

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      let context = mount(<App />);

      expect(context.find("h1").text()).toBe("true");
    });

    it("should connect with nested children", () => {
      store.setState({ message: "hello" });

      const mapToProps = ({ message }) => ({ message });

      const ConnectedComp = ({ children }) => (
        <Connect mapToProps={mapToProps}>
          {({ message }) => (
            <div>
              parent {message} {children}
            </div>
          )}
        </Connect>
      );
      const ConnectedChildComp = () => (
        <Connect mapToProps={mapToProps}>
          {({ message }) => <span>child {message}</span>}
        </Connect>
      );

      const App = () => (
        <Provider store={store}>
          <ConnectedComp>
            <ConnectedChildComp />
          </ConnectedComp>
        </Provider>
      );

      let context = mount(<App />);

      expect(
        context.contains(
          <div>
            parent hello <span>child hello</span>
          </div>
        )
      ).toBe(true);

      store.setState({ message: "bye" });

      context = mount(<App />);

      expect(
        context.contains(
          <div>
            parent bye <span>child bye</span>
          </div>
        )
      ).toBe(true);
    });
  });
});
