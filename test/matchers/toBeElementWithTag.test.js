import { toBeElementWithTag } from "./toBeElementWithTag";
import { stripTerminalColor } from "./toContainText.test";

describe("toBeElementWithTag", () => {
  const elementFrom = (text) => {
    const parent = document.createElement("div");
    parent.innerHTML = text;
    return parent.firstChild;
  };
  it("return pass true when tag matches", () => {
    const select = elementFrom("<select />");
    const result = toBeElementWithTag(select, "select");

    expect(result.pass).toBe(true);
  });

  it("return pass false when element is null", () => {
    const result = toBeElementWithTag(null, "input");
    expect(result.pass).toBe(false);
  });

  it("return pass false when tag did not match", () => {
    const input = elementFrom("<input />");
    const result = toBeElementWithTag(input, "select");
    expect(result.pass).toBe(false);
  });

  it("return source line when no tag match", () => {
    const input = elementFrom("<input />");
    const result = toBeElementWithTag(input, "select");

    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).toBeElementWithTag("select")`
    );
  });

  it("returns source line when negated match", () => {
    const input = elementFrom("<input />");
    const result = toBeElementWithTag(input, "input");
    expect(stripTerminalColor(result.message())).toContain(
      `expect(element).not.toBeElementWithTag("input")`
    );
  });

  it("return actual tag", () => {
    const input = elementFrom("<input />");
    const result = toBeElementWithTag(input, "select");

    expect(stripTerminalColor(result.message())).toMatch(`Actual tag: <input>`);
  });
});
