const Enzyme = require("enzyme");
const { Adapter } = require("enzyme-adapter-preact-pure");

Enzyme.configure({ adapter: new Adapter() });

jest.useFakeTimers();
global.shallow = Enzyme.shallow;
global.render = Enzyme.render;
global.mount = Enzyme.mount;

global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};

jest.useRealTimers();

console.error = (message) => {
  throw new Error(message);
};
