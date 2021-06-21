/// <reference types="enzyme-adapter-preact-pure"/>
// This `<reference ...>` directive is necessary to include the adapter's
// extensions to types in the "preact" and "enzyme" packages.

import { configure } from "enzyme";
import { Adapter } from "enzyme-adapter-preact-pure";

jest.useFakeTimers();

// @ts-ignore
global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};

jest.useRealTimers();

console.error = (message) => {
  throw new Error(message);
};

configure({ adapter: new Adapter() });
