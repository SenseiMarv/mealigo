jest.mock("react-native-worklets", () =>
  require("react-native-worklets/src/mock"),
);

jest.mock("@dev-plugins/react-query", () => ({
  useReactQueryDevTools: jest.fn(),
}));

jest.mock("@dev-plugins/react-navigation", () => ({
  useReactNavigationDevTools: jest.fn(),
}));

const originalWarn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    message.includes("Uniwind") &&
    message.includes("We couldn't find your variable")
  ) {
    return;
  }
  originalWarn(...args);
};
