import React from "react";
import {
  toBeRenderedWithProps,
  toBeFirstRenderedWithProps,
} from "./toBeRenderedWithProps";
import {
  initializeReactContainer,
  render,
} from "../reactTestExtensions";
import { stripTerminalColor } from "./toContainText.test";

describe("toBeRenderedWithProps", () => {
  let Component;
  beforeEach(() => {
    initializeReactContainer();
    Component = jest.fn(() => <div />);
  });

  it("returns pass is true when mock has been rendered", () => {
    render(<Component />);

    const result = toBeRenderedWithProps(
      Component,
      {}
    );

    expect(result.pass).toBe(true);
  });

  it("returns pass is false when mock has not been rendered", () => {
    const result = toBeRenderedWithProps(
      Component,
      {}
    );
    expect(result.pass).toBe(false);
  });

  it("returns pass false when the properties do not match", () => {
    render(<Component a="b" />);

    const result = toBeRenderedWithProps(Component, {
      c: "d",
    });

    expect(result.pass).toBe(false);
  });

  it("render pass is true when the properties of the last render match", () => {
    render(<Component a="b" />);
    render(<Component c="d" />);
    const result = toBeRenderedWithProps(Component, {
      c: "d",
    });

    expect(result.pass).toBe(true);
  });

  it("return the source line when no match", () => {
    render(<Component a="b" />);

    const result = toBeRenderedWithProps(Component, {
      c: "d",
    });

    expect(
      stripTerminalColor(result.message())
    ).toContain(
      `expect(mockedComponent).toBeRenderedWithProps({"c": "d"})`
    );
  });

  it("return the source line when negated atch", () => {
    render(<Component a="b" />);

    const result = toBeRenderedWithProps(Component, {
      a: "b",
    });

    expect(
      stripTerminalColor(result.message())
    ).toContain(
      `expect(mockedComponent).not.toBeRenderedWithProps({"a": "b"})`
    );
  });

  it("return actual text in message", () => {
    render(<Component a="b" />);

    const result = toBeRenderedWithProps(Component, {
      c: "d",
    });

    expect(
      stripTerminalColor(result.message())
    ).toContain(`Rendered with props: {"a": "b"}`);
  });
});

describe("toBeFirstRenderedWithProps", () => {
  let Component;
  beforeEach(() => {
    initializeReactContainer();
    Component = jest.fn(() => <div />);
  });

  it("returns pass is true when mock has been rendered", () => {
    render(<Component />);

    const result = toBeFirstRenderedWithProps(
      Component,
      {}
    );

    expect(result.pass).toBe(true);
  });

  it("return pass is false when mock has not been rendered", () => {
    const result = toBeFirstRenderedWithProps(
      Component,
      {}
    );

    expect(result.pass).toBe(false);
  });

  it("return pass is false when props didn't match", () => {
    render(<Component a="b" />);

    const result = toBeFirstRenderedWithProps(
      Component,
      { c: "d" }
    );

    expect(result.pass).toBe(false);
  });

  it("return pass is true when props match", () => {
    render(<Component a="b" />);

    const result = toBeFirstRenderedWithProps(
      Component,
      { a: "b" }
    );

    expect(result.pass).toBe(true);
  });

  it("return pass when initial props equal", () => {
    render(<Component a="b" />);
    render(<Component c="d" />);

    const result = toBeFirstRenderedWithProps(
      Component,
      { a: "b" }
    );
    expect(result.pass).toBe(true);
  });

  it("return souce line when no match", () => {
    render(<Component a="b" />);

    const result = toBeFirstRenderedWithProps(
      Component,
      { c: "d" }
    );

    expect(
      stripTerminalColor(result.message())
    ).toContain(
      `expect(mockedComponent).toBeFirstRenderedWithProps({"c": "d"})`
    );
  });

  it("return source line when negated match", () => {
    render(<Component a="b" />);

    const result = toBeFirstRenderedWithProps(
      Component,
      { a: "b" }
    );

    expect(
      stripTerminalColor(result.message())
    ).toContain(
      `expect(mockedComponent).not.toBeFirstRenderedWithProps({"a": "b"})`
    );
  });

  it("return actual text in message", () => {
    render(<Component a="b" />);

    const result = toBeFirstRenderedWithProps(
      Component,
      { c: "d" }
    );

    expect(
      stripTerminalColor(result.message())
    ).toContain(`Rendered with props: {"a": "b"}`);
  });

  it("returns a message that the passed object is not a mock", () => {
    const result = toBeFirstRenderedWithProps(
      <div />,
      {}
    );
    expect(
      stripTerminalColor(result.message())
    ).toMatch(`mockedComponent is not a mock`);
  });

  it("returns a message that the component was never rendered", () => {
    const result = toBeFirstRenderedWithProps(
      Component,
      {}
    );
    expect(
      stripTerminalColor(result.message())
    ).toMatch(`mockedComponent was never rendered`);
  });
});
