import { printExpected, matcherHint } from "jest-matcher-utils";

export const toBeElementWithTag = (element, expectedTag) => {
  const pass =
    !!element && element.tagName.toLowerCase() === expectedTag.toLowerCase();

  const sourceHint = () =>
    matcherHint("toBeElementWithTag", "element", printExpected(expectedTag), {
      isNot: pass,
    });

  const receivedText = () => {
    if (!element) {
      return "element was not found";
    }

    return `<${element.tagName.toLowerCase()}>`;
  };
  const actualHint = () => `Actual tag: ${receivedText()}`;
  const message = () => [sourceHint(), actualHint()].join("\n\n");

  return {
    pass,
    message,
  };
};
