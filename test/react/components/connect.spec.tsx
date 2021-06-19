import * as React from "react";
import { mount } from "enzyme";

import createStore from "../..";
import { Provider, Connect, connect } from "..";

describe("redux-zero - react bindings", () => {
  let store, listener;
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

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe("<h1>hello</h1>");

      store.setState({ message: "bye" });

      expect(wrapper.html()).toBe("<h1>bye</h1>");
    });

    it("should provide the actions and subscribe to changes", () => {
      store.setState({ count: 0 });

      const Comp = ({ count, increment }) => (
        <h1 onClick={increment}>{count}</h1>
      );

      const mapToProps = ({ count }) => ({ count });

      const actions = (store) => ({
        increment: (state) => ({ count: state.count + 1 }),
      });

      const ConnectedComp = connect(mapToProps, actions)(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe("<h1>0</h1>");

      wrapper.children().simulate("click");
      wrapper.children().simulate("click");

      expect(wrapper.html()).toBe("<h1>2</h1>");
    });

    it("should provide actions with parameters and subscribe to changes", () => {
      store.setState({ count: 0 });

      const Comp = ({ count, incrementOf }) => (
        <h1 onClick={() => incrementOf(10)}>{count}</h1>
      );

      const mapToProps = ({ count }) => ({ count });

      const actions = (store) => ({
        incrementOf: (state, value) => ({ count: state.count + value }),
      });

      const ConnectedComp = connect(mapToProps, actions)(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe("<h1>0</h1>");

      wrapper.children().simulate("click");
      wrapper.children().simulate("click");

      expect(wrapper.html()).toBe("<h1>20</h1>");
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

      const wrapper = mount(<App />);

      wrapper.children().simulate("click");
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

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe("<h1>true</h1>");
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

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe(
        "<div>parent hello <span>child hello</span></div>"
      );

      store.setState({ message: "bye" });

      expect(wrapper.html()).toBe(
        "<div>parent bye <span>child bye</span></div>"
      );
    });

    it("should connect return all state when mapToProps is not passed", () => {
      store.setState({ message: "Hey!" });
      const Comp = ({ message }) => <h1>{message}</h1>;
      const ConnectedComp = connect()(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      const wrapper = mount(<App />);
      expect(wrapper.html()).toBe("<h1>Hey!</h1>");
    });

    it("should accept ownProps as the second parameter to mapToProps", () => {
      const Comp = ({ message }) => <h1>{message}</h1>;
      const ConnectedComp = connect((state, ownProps: any) => ({
        message: ownProps.someProp,
      }))(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp someProp="some value" />
        </Provider>
      );

      const wrapper = mount(<App />);
      expect(wrapper.html()).toBe("<h1>some value</h1>");
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

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe("<h1>hello</h1>");

      store.setState({ message: "bye" });

      expect(wrapper.html()).toBe("<h1>bye</h1>");
    });

    it("should provide the actions and subscribe to changes", () => {
      store.setState({ count: 0 });

      const mapToProps = ({ count }) => ({ count });

      const actions = (store) => ({
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

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe("<h1>0</h1>");

      wrapper.children().simulate("click");
      wrapper.children().simulate("click");

      expect(wrapper.html()).toBe("<h1>2</h1>");
    });
    it("should provide actions with ownprops", () => {
      store.setState({ count: 0 });

      const Comp = ({ count, increment }) => (
        <h1 onClick={increment}>{count}</h1>
      );

      const mapToProps = ({ count }) => ({ count });

      const actions = (store, ownProps) => ({
        increment: (state) => ({ count: state.count + ownProps.add }),
      });

      const ConnectedComp = connect(mapToProps, actions)(Comp);

      const App = () => (
        <Provider store={store}>
          <ConnectedComp add={10} />
        </Provider>
      );

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe("<h1>0</h1>");

      wrapper.children().simulate("click");
      wrapper.children().simulate("click");

      expect(wrapper.html()).toBe("<h1>20</h1>");
    });
    it("should provide actions with parameters and subscribe to changes", () => {
      store.setState({ count: 0 });

      const mapToProps = ({ count }) => ({ count });

      const actions = (store) => ({
        incrementOf: (state, value) => ({ count: state.count + value }),
      });

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps} actions={actions}>
          {({ count, incrementOf }) => (
            <h1 onClick={() => incrementOf(10)}>{count}</h1>
          )}
        </Connect>
      );

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      );

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe("<h1>0</h1>");

      wrapper.children().simulate("click");
      wrapper.children().simulate("click");

      expect(wrapper.html()).toBe("<h1>20</h1>");
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

      const wrapper = mount(<App />);

      wrapper.children().simulate("click");
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

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe("<h1>true</h1>");
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

      const wrapper = mount(<App />);

      expect(wrapper.html()).toBe(
        "<div>parent hello <span>child hello</span></div>"
      );

      store.setState({ message: "bye" });

      expect(wrapper.html()).toBe(
        "<div>parent bye <span>child bye</span></div>"
      );
    });
  });
});
