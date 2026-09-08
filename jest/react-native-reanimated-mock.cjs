"use strict";

const path = require("node:path");

const officialMockPath = path.join(
  path.dirname(require.resolve("react-native-reanimated/package.json")),
  "mock.js",
);

const official = jest.requireActual(officialMockPath);

function getAnimated(mod) {
  const candidate = mod?.default ?? mod;
  if (typeof candidate?.createAnimatedComponent === "function") {
    return candidate;
  }
  if (typeof candidate?.default?.createAnimatedComponent === "function") {
    return candidate.default;
  }
  return {
    ...(typeof candidate === "object" && candidate !== null ? candidate : {}),
    createAnimatedComponent: (component) => component,
  };
}

const identity = (value) => value;
const Animated = getAnimated(official);

const patched = {
  ...official,
  useReducedMotion: () => false,
  useComposedEventHandler: identity,
  default: {
    ...Animated,
    createAnimatedComponent:
      Animated.createAnimatedComponent ?? ((component) => component),
    call: () => {},
  },
};

module.exports = new Proxy(patched, {
  get(target, prop, receiver) {
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    }
    if (typeof prop === "string" && prop.startsWith("use")) {
      return () => undefined;
    }
    return identity;
  },
});
