import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

export const toBeInputFieldOfType = (received, expectedType) => {
  const pass =
    received && received.tagName === "INPUT" && received.type === expectedType;

  const sourceHint = () =>
    matcherHint(
      "toBeInputFieldOfType",
      "element",
      printExpected(expectedType),
      {
        isNot: pass,
      }
    );

  const actualHint = () => `Actual type: ${printReceived(received.type)}`;
  const message = () => [sourceHint(), actualHint()].join("\n\n");

  return {
    pass,
    message,
  };
};
