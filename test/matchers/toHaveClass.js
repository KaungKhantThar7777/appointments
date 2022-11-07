import { matcherHint, printExpected, printReceived } from "jest-matcher-utils";

export const toHaveClass = (received, expectedClass) => {
  const pass = received.className.includes(expectedClass);

  const sourceHint = () =>
    matcherHint("toHaveClass", "element", printExpected(expectedClass), {
      isNot: pass,
    });

  const actualHint = () => "Actual text: " + printReceived(received.className);

  const message = () => [sourceHint(), actualHint()].join("\n\n");

  return {
    pass,
    message,
  };
};
