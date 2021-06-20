import { createStore } from "../../src";

describe("redux-zero - the store", () => {
  const listener = jest.fn();
  const initialState = {};
  let store, unsubscribe;
  beforeEach(() => {
    store = createStore(initialState);
    listener.mockReset();
    unsubscribe = store.subscribe(listener);
  });

  test("setState - getState", () => {
    const state = { one: { two: { three: "four" } }, five: "six" };
    store.setState(state);
    expect(store.getState()).toEqual(state);
    store.setState((state) => state);
    expect(store.getState()).toEqual(state);
    store.setState({ five: "seven" });
    expect(store.getState()).toEqual({
      one: { two: { three: "four" } },
      five: "seven",
    });
    store.setState((_state) => ({ five: "eight" }));
    expect(store.getState()).toEqual({
      one: { two: { three: "four" } },
      five: "eight",
    });
  });

  test("subscribe / unsubscribe", () => {
    expect(listener).not.toBeCalled();
    store.setState({ a: "key" });
    expect(listener).toBeCalledWith({ a: "key" });

    const otherListener = jest.fn();
    store.subscribe(otherListener);
    listener.mockReset();

    unsubscribe(listener);
    store.setState({ a: "key" });
    expect(listener).not.toBeCalled();
    expect(otherListener).toBeCalledWith({ a: "key" });
  });

  test("middleware", () => {
    const middleware = jest.fn();
    store = createStore({}, middleware);
    expect(store.middleware).toEqual(middleware);
  });

  test("reset", () => {
    const state = { one: { two: { three: "four" } }, five: "six" };
    store.setState(state);

    store.reset();
    expect(store.getState()).toEqual({});
  });
});
