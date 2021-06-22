import "./style";

import { Provider } from "predux/preact";

import store from "./store";

import Counter from "./Counter";

export default () => (
  <Provider store={store}>
    <Counter />
  </Provider>
);
