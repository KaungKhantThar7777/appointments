import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";
import { toBeElementWithTag } from "./matchers/toBeElementWithTag";
import { toBeRenderWithProps } from "./matchers/toBeRenderWithProps";

expect.extend({
  toHaveClass,
  toContainText,
  toBeInputFieldOfType,
  toBeElementWithTag,
  toBeRenderWithProps,
});
