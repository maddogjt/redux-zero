<h1 align="center">
  <img src="https://i.imgur.com/S8jnr8O.png" height="300px" alt="redux zero logo" title="redux zero logo">
  <br>
</h1>
<p align="center" style="font-size: 1.2rem;">A lightweight state container based on Redux</p>

> Read [the intro blog post](https://medium.com/@matheusml/introducing-predux-bea42214c7ee)

<hr />

[![codacy](https://api.codacy.com/project/badge/Grade/a4adf13156bd4441ae132d2d9dc72186)](https://www.codacy.com/app/matheusml/predux?utm_source=github.com&utm_medium=referral&utm_content=predux/predux&utm_campaign=Badge_Grade)
[![build](https://img.shields.io/travis/predux/predux/master.svg)](https://travis-ci.org/predux/predux)
[![npm](https://img.shields.io/npm/v/predux.svg)](https://www.npmjs.com/package/predux)
[![downloads](https://img.shields.io/npm/dm/predux.svg)](https://www.npmjs.com/package/predux)
[![license](https://img.shields.io/github/license/predux/predux.svg)]()
[![dependencies](https://img.shields.io/david/predux/predux.svg)]()

## Table of Contents

- [Installation](#installation)
- [How](#how)
- [Example](#example)
- [Actions](#actions)
- [Async](#async)
- [Middleware](#middleware)
- [DevTools](#devtools)
- [TypeScript](#typescript)
- [Inspiration](#inspiration)
- [Roadmap](#roadmap)
- [Docs](#docs)

## Installation

To install the stable version:

```
npm i predux
```

This assumes that you’re using [npm](https://www.npmjs.com/) with a module bundler like [webpack](https://webpack.js.org/)

## How

**ES2015+:**

```js
import createStore from "predux";
import { Provider, connect } from "predux/react";
```

**TypeScript:**

```js
import * as createStore from "predux";
import { Provider, connect } from "predux/react";
```

**CommonJS:**

```js
const createStore = require("predux");
const { Provider, connect } = require("predux/react");
```

**UMD:**

```html
<!-- the store -->
<script src="https://unpkg.com/predux/dist/predux.min.js"></script>

<!-- for preact -->
<script src="https://unpkg.com/predux/preact/index.min.js"></script>
```

## Example

Let's make an increment/decrement simple application with React:

First, create your store. This is where your application state will live:

```js
/* store.js */
import createStore from "predux";

const initialState = { count: 1 };
const store = createStore(initialState);

export default store;
```

Then, create your actions. This is where you change the state from your store:

```js
/* actions.js */
const actions = store => ({
  increment: state => ({ count: state.count + 1 }),
  decrement: state => ({ count: state.count - 1 })
});

export default actions;
```

By the way, because the actions are bound to the store, they are just pure functions :)

Now create your component. With **Redux Zero** your component can focus 100% on the UI and just call the actions that will automatically update the state:

```js
/* Counter.js */
import React from "react";
import { connect } from "predux/react";

import actions from "./actions";

const mapToProps = ({ count }) => ({ count });

export default connect(
  mapToProps,
  actions
)(({ count, increment, decrement }) => (
  <div>
    <h1>{count}</h1>
    <div>
      <button onClick={decrement}>decrement</button>
      <button onClick={increment}>increment</button>
    </div>
  </div>
));
```

Last but not least, plug the whole thing in your index file:

```js
/* index.js */
import React from "react";
import { render } from "react-dom";
import { Provider } from "predux/react";

import store from "./store";

import Counter from "./Counter";

const App = () => (
  <Provider store={store}>
    <Counter />
  </Provider>
);

render(<App />, document.getElementById("root"));
```

Here's the full version: [https://codesandbox.io/s/n5orzr5mxj](https://codesandbox.io/s/n5orzr5mxj)

By the way, you can also reset the state of the store anytime by simply doing this:

```js
import store from "./store";

store.reset();
```

### More examples

- [Preact](https://github.com/predux/predux/tree/master/examples/preact/counter)

## Actions

There are three gotchas with Redux Zero's actions:

- Passing arguments
- Combining actions
- Binding actions outside your application scope

### Passing arguments

Here's how you can pass arguments to actions:

```js
const Component = ({ count, incrementOf }) => (
  <h1 onClick={() => incrementOf(10)}>{count}</h1>
);

const mapToProps = ({ count }) => ({ count });

const actions = store => ({
  incrementOf: (state, value) => ({ count: state.count + value })
});

const ConnectedComponent = connect(
  mapToProps,
  actions
)(Component);

const App = () => (
  <Provider store={store}>
    <ConnectedComponent />
  </Provider>
);
```

### Access props in actions

The initial component props are passed to the actions creator.

```js
const Component = ({ count, increment }) => (
  <h1 onClick={() => increment()}>{count}</h1>
);

const mapToProps = ({ count }) => ({ count });

const actions = (store, ownProps) => ({
  increment: state => ({ count: state.count + ownProps.value })
});

const ConnectedComponent = connect(
  mapToProps,
  actions
)(Component);

const App = () => (
  <Provider store={store}>
    <ConnectedComponent value={10} />
  </Provider>
);
```

### Combining actions

There's an utility function to combine actions on Redux Zero:

```js
import { connect } from "predux/react";
import { combineActions } from "predux/utils";

import Component from "./Component";
import firstActions from "../../actions/firstActions";
import secondActions from "../../actions/secondActions";

export default connect(
  ({ params, moreParams }) => ({ params, moreParams }),
  combineActions(firstActions, secondActions)
)(Component);
```

### Binding actions outside your application scope

If you need to bind the actions to an external listener outside the application scope, here's a simple way to do it:

On this example we listen to push notifications that sends data to our React Native app.

```js
import firebase from "react-native-firebase";
import { bindActions } from "predux/utils";
import store from "../store";
import actions from "../actions";

const messaging = firebase.messaging();
const boundActions = bindActions(actions, store);

messaging.onMessage(payload => {
  boundActions.saveMessage(payload);
});
```

## Async

Async actions in Redux Zero are almost as simple as sync ones. Here's an example:

```js
const mapActions = ({ setState }) => ({
  getTodos() {
    setState({ loading: true });

    return client
      .get("/todos")
      .then(payload => ({ payload, loading: false }))
      .catch(error => ({ error, loading: false }));
  }
});
```

They're still pure functions. You'll need to invoke `setState` if you have a loading status. But at the end, it's the same, just return whatever the updated state that you want.

And here's how easy it is to test this:

```js
describe("todo actions", () => {
  let actions, store, listener, unsubscribe;
  beforeEach(() => {
    store = createStore();
    actions = getActions(store);
    listener = jest.fn();
    unsubscribe = store.subscribe(listener);
  });

  it("should fetch todos", () => {
    nock("http://someapi.com/")
      .get("/todos")
      .reply(200, { id: 1, title: "test stuff" });

    return actions.getTodos().then(() => {
      const [LOADING_STATE, SUCCESS_STATE] = listener.mock.calls.map(
        ([call]) => call
      );

      expect(LOADING_STATE.loading).toBe(true);
      expect(SUCCESS_STATE.payload).toEqual({ id: 1, title: "test stuff" });
      expect(SUCCESS_STATE.loading).toBe(false);
    });
  });
});
```

## Middleware

The method signature for the middleware was inspired by redux. The main difference is that action is just a function:

```js
/* store.js */
import createStore from "predux";
import { applyMiddleware } from "predux/middleware";

const logger = store => (next, args) => action => {
  console.log("current state", store.getState());
  console.log("action", action.name, ...args);
  return next(action);
};

const initialState = { count: 1 };
const middlewares = applyMiddleware(logger, anotherMiddleware);

const store = createStore(initialState, middlewares);

export default store;
```

## DevTools

You can setup DevTools middleware in store.js to connect with Redux DevTools and inspect states in the store.

```js
/* store.js */
import createStore from "predux";
import { applyMiddleware } from "predux/middleware";
import { connect } from "predux/devtools";

const initialState = { count: 1 };
const middlewares = connect ? applyMiddleware(connect(initialState)) : [];
const store = createStore(initialState, middlewares);

export default store;
```

Also, these are unofficial tools, maintained by the community:

- [predux Tools](https://github.com/nyteshade/rzero-tools)
- [predux persist middleware](https://github.com/axetroy/predux-persist)
- [predux logger middleware](https://github.com/axetroy/predux-logger)
- [redux loading middleware](https://github.com/andre-araujo/redux-loading-middleware)

## TypeScript

You can use the `BoundActions` type to write your React component props in a type
safe way. Example:

```typescript
import { BoundActions } from "predux/types/Actions";

interface State {
  loading: boolean;
}

const actions = (store, ownProps) => ({
  setLoading: (state, loading: boolean) => ({ loading })
});

interface ComponentProps {
  value: string;
}

interface StoreProps {
  loading: boolean;
}

type Props = ComponentProps & StoreProps & BoundActions<State, typeof actions>

const Component = (props: Props) => (
  <h1 onClick={() => props.setLoading(!props.loading)}>{props.value}</h1>
);

const mapToProps = (state: State): StoreProps => ({ loading: state.loading });

const ConnectedComponent = connect<State, ComponentProps>(
  mapToProps,
  actions
)(Component);

const App = () => (
  <Provider store={store}>
    <ConnectedComponent value={10} />
  </Provider>
);
```

By doing this, TypeScript will know the available actions and their types
available on the component's props. For example, you will get a compiler error if you
call `props.setLoding` (that action doesn't exist), or if you call it
with incorrect argument types, like `props.setLoading(123)`.

## Inspiration

**Redux Zero** was based on this [gist](https://gist.github.com/developit/55c48d294abab13a146eac236bae3219) by [@developit](https://github.com/developit)

## Roadmap

- Make sure all bindings are working for latest versions of React, Vue, Preact and Svelte
- Add time travel

_Help is needed for both of these_

## Docs

- [Full Docs](https://matheusml1.gitbooks.io/predux-docs/content/)
- [Contributing](https://github.com/predux/predux/blob/master/CONTRIBUTING.md)
- [Changelog](https://github.com/predux/predux/blob/master/CHANGELOG.md)
- [Code of Conduct](https://github.com/predux/predux/blob/master/CODE_OF_CONDUCT.md)
- [License](https://github.com/predux/predux/blob/master/LICENSE)
