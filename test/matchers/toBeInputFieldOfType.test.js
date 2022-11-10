import { toBeInputFieldOfType } from "./toBeInputFieldOftype";
import { stripTerminalColor } from "./toContainText.test";

describe("toBeInputFieldOfType", () => {
  const elementFrom = (text) => {
    const parent = document.createElement("div");
    parent.innerHTML = text;
    return parent.firstChild;
  };
  it("return pass false when pass null", () => {
    const result = toBeInputFieldOfType(null, "text");
    expect(result.pass).toBe(false);
  });
  it("returns pass true when input of type matches", () => {
    const domElement = elementFrom('<input type="text" />');
    const result = toBeInputFieldOfType(domElement, "text");

    expect(result.pass).toBe(true);
  });

  it("returns pass false when input of type does not match", () => {
    const p = elementFrom("<p />");
    const result = toBeInputFieldOfType(p, "email");

    expect(result.pass).toBe(false);
  });

  it("returns a message that contain the source line when no match", () => {
    const domElement = elementFrom("<input type=text />");

    const result = toBeInputFieldOfType(domElement, "email");
    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).toBeInputFieldOfType("email")`
    );
  });

  it("return a message tha contain the source line when negated match", () => {
    const domElement = elementFrom('<input type="email" />');
    const result = toBeInputFieldOfType(domElement, "email");
    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).not.toBeInputFieldOfType("email")`
    );
  });

  it("return a message that contains the actual text", () => {
    const domElement = elementFrom("<p>");

    const result = toBeInputFieldOfType(domElement, "email");

    expect(stripTerminalColor(result.message())).toContain(`Actual type: <p>`);
  });

  it("returns a specific message the element passed is null", () => {
    const result = toBeInputFieldOfType(null, "text");
    expect(stripTerminalColor(result.message())).toMatch(
      `Actual type: element was not found`
    );
  });

  it("returns a message when the element has the wrong tag", () => {
    const domElement = elementFrom("<p>");
    const result = toBeInputFieldOfType(domElement, "text");
    expect(stripTerminalColor(result.message())).toMatch(`Actual type: <p>`);
  });

  it("returns a message when the element has the wrong type", () => {
    const domElement = elementFrom("<input type=text>");
    const result = toBeInputFieldOfType(domElement, "email");
    expect(stripTerminalColor(result.message())).toMatch(
      `Actual type: <input type=text>`
    );
  });
});
