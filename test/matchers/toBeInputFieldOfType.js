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

  const receivedText = () => {
    if (!received) {
      return "element was not found";
    }
    if (received?.tagName !== "INPUT") {
      return `<${received?.tagName.toLowerCase()}>`;
    }
    return `<input type=${received.type}>`;
  };

  const actualHint = () => `Actual type: ${receivedText()}`;

  const message = () => [sourceHint(), actualHint()].join("\n\n");

  return {
    pass: Boolean(pass),
    message,
  };
};
