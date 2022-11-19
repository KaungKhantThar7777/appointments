import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";
import { toBeElementWithTag } from "./matchers/toBeElementWithTag";

expect.extend({
  toHaveClass,
  toContainText,
  toBeInputFieldOfType,
  toBeElementWithTag,
  toBeCalledWith(received, ...expectedArguments) {
    if (received.receivedArguments() === undefined) {
      return {
        pass: false,
        message: () => "Spy was not called",
      };
    }

    const notMatch = !this.equals(
      received.receivedArguments(),
      expectedArguments
    );
    if (notMatch) {
      return {
        pass: false,
        message: () =>
          "Spy called with the wrong arguments: " +
          JSON.stringify(
            received.receivedArguments()
          ) +
          ".",
      };
    }

    return {
      pass: true,
      message: () => "Spy was called",
    };
  },
});
