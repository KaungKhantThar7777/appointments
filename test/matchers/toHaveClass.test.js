import { stripTerminalColor } from "./toContainText.test.js";
import { toHaveClass } from "./toHaveClass.js";

describe("toHaveClass", () => {
  it("return pass is true when element have toggled className", () => {
    const domElement = {
      className: "toggled",
    };
    const result = toHaveClass(domElement, "toggled");
    expect(result.pass).toBe(true);
  });

  it("return pass is false when element dont have toggled className", () => {
    const domElement = {
      className: "not",
    };

    const result = toHaveClass(domElement, "toggled");
    expect(result.pass).toBe(false);
  });

  it("returns a message that contains the source line if no match", () => {
    const domElement = {
      className: "not",
    };

    const result = toHaveClass(domElement, "toggled");
    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).toHaveClass("toggled")`
    );
  });

  it("returns a message that contains the source line if negated match", () => {
    const domElement = {
      className: "toggled",
    };

    const result = toHaveClass(domElement, "toggled");

    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).not.toHaveClass("toggled")`
    );
  });

  it("returns a message that contains actual text", () => {
    const domElement = {
      className: "toggled",
    };

    const result = toHaveClass(domElement, "toggled");

    expect(stripTerminalColor(result.message())).toContain(
      `Actual text: "toggled"`
    );
  });
});
