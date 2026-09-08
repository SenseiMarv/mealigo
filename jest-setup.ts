jest.mock("react-native-worklets", () =>
  require("react-native-worklets/src/mock"),
);

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
