import {createStore} from "../../src";
import {applyMiddleware} from "../../src/middleware";
import {bindActions} from "../../src/utils";


const getActions = (_state: any) => ({
  syncAction: ({ count }) => ({ count: count + 1 }),
  syncActionDouble: ({ count }) => ({ count: count + 2 }),
  syncActionTriple: ({ count }) => ({ count: count + 3 }),
});

const noAction = () => () => () => {};
const doAnotherAction = (store) => (next) => (_action) => {
  return next(getActions(store).syncActionDouble);
};
const doTripleAction = (store) => (next) => (_action) => {
  return next(getActions(store).syncActionTriple);
};

describe("applyMiddleware", () => {
  it("should not fail without middleware", () => {
    const store = createStore({ count: 0 }, applyMiddleware());
    const actions = bindActions(getActions, store);

    actions.syncAction();
    expect((<{ count: number }>store.getState()).count).toBe(1);
  });

  it("should drop the action", () => {
    const store = createStore({ count: 0 }, applyMiddleware(noAction));
    const actions = bindActions(getActions, store);

    actions.syncAction();
    expect((<{ count: number }>store.getState()).count).toBe(0);
  });

  it("should replace with another action", () => {
    const store = createStore({ count: 0 }, applyMiddleware(doAnotherAction));
    const actions = bindActions(getActions, store);

    actions.syncAction();
    expect((<{ count: number }>store.getState()).count).toBe(2);
  });

  it("should apply middlewares in correct order", () => {
    const store = createStore(
      { count: 1 },
      applyMiddleware(doTripleAction, doAnotherAction)
    );
    const actions = bindActions(getActions, store);

    actions.syncAction();
    actions.syncAction();
    expect((<{ count: number }>store.getState()).count).toBe(5); // 1 + 2 + 2 not 1 + 2 + 3
  });
});
