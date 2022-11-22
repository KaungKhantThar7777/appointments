import React from "react";
import { toBeRenderWithProps } from "./toBeRenderWithProps";
import {
  initializeReactContainer,
  render,
} from "../reactTestExtensions";
import { stripTerminalColor } from "./toContainText.test";

describe("toBeRenderWithProps", () => {
  let Component;
  beforeEach(() => {
    initializeReactContainer();
    Component = jest.fn(() => <div />);
  });

  it("returns pass is true when mock has been rendered", () => {
    render(<Component />);

    const result = toBeRenderWithProps(Component, {});

    expect(result.pass).toBe(true);
  });

  it("returns pass is false when mock has not been rendered", () => {
    const result = toBeRenderWithProps(Component, {});
    expect(result.pass).toBe(false);
  });

  it("returns pass false when the properties do not match", () => {
    render(<Component a="b" />);

    const result = toBeRenderWithProps(Component, {
      c: "d",
    });

    expect(result.pass).toBe(false);
  });

  it("render pass is true when the properties of the last render match", () => {
    render(<Component a="b" />);
    render(<Component c="d" />);
    const result = toBeRenderWithProps(Component, {
      c: "d",
    });

    expect(result.pass).toBe(true);
  });

  it("return the source line when no match", () => {
    render(<Component a="b" />);

    const result = toBeRenderWithProps(Component, {
      c: "d",
    });

    expect(
      stripTerminalColor(result.message())
    ).toContain(
      `expect(element).toBeRenderWithProps({"c": "d"})`
    );
  });

  it("return the source line when negated atch", () => {
    render(<Component a="b" />);

    const result = toBeRenderWithProps(Component, {
      a: "b",
    });

    expect(
      stripTerminalColor(result.message())
    ).toContain(
      `expect(element).not.toBeRenderWithProps({"a": "b"})`
    );
  });

  it("return actual text in message", () => {
    render(<Component a="b" />);

    const result = toBeRenderWithProps(Component, {
      c: "d",
    });

    expect(
      stripTerminalColor(result.message())
    ).toContain(`Actual props: {"a": "b"}`);
  });
});
