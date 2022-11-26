import { toContainText } from "./matchers/toContainText";
import { toHaveClass } from "./matchers/toHaveClass";
import { toBeInputFieldOfType } from "./matchers/toBeInputFieldOfType";
import { toBeElementWithTag } from "./matchers/toBeElementWithTag";
import {
  toBeRenderedWithProps,
  toBeFirstRenderedWithProps,
} from "./matchers/toBeRenderedWithProps";

expect.extend({
  toHaveClass,
  toContainText,
  toBeInputFieldOfType,
  toBeElementWithTag,
  toBeRenderedWithProps,
  toBeFirstRenderedWithProps,
});
