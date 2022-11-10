import { toBeInputFieldOfType } from "./toBeInputFieldOftype";
import { stripTerminalColor } from "./toContainText.test";

describe("toBeInputFieldOfType", () => {
  it("returns pass true when input of type matches", () => {
    const actualElement = {
      tagName: "INPUT",
      type: "text",
    };
    const result = toBeInputFieldOfType(actualElement, "text");

    expect(result.pass).toBe(true);
  });

  it("returns pass false when input of type does not match", () => {
    const actualElement = {
      tagName: "INPUT",
      type: "tel",
    };
    const result = toBeInputFieldOfType(actualElement, "email");

    expect(result.pass).toBe(false);
  });

  it("returns a message that contain the source line when no match", () => {
    const actualElement = {
      tagName: "INPUT",
      type: "text",
    };

    const result = toBeInputFieldOfType(actualElement, "email");
    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).toBeInputFieldOfType("email")`
    );
  });

  it("return a message tha contain the source line when negated match", () => {
    const actualElement = {
      tagName: "INPUT",
      type: "email",
    };

    const result = toBeInputFieldOfType(actualElement, "email");
    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).not.toBeInputFieldOfType("email")`
    );
  });

  it("return a message that contains the actual text", () => {
    const actualElement = {
      tagName: "INPUT",
      type: "email",
    };

    const result = toBeInputFieldOfType(actualElement, "email");

    expect(stripTerminalColor(result.message())).toContain(
      `Actual type: "email"`
    );
  });
});
