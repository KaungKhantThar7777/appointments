import React from "react";

import {
  initializeReactContainer,
  render,
} from "../reactTestExtensions";
import { toBeRendered } from "./toBeRendered";

describe("toBeRendered", () => {
  let Component;

  beforeEach(() => {
    initializeReactContainer();
    Component = jest.fn(() => <div />);
  });
  it("return pass is true when mock has been rendered", () => {
    render(<Component />);

    const result = toBeRendered(Component);

    expect(result.pass).toBe(true);
  });

  it("return pass is false when mock has not been rendered", () => {
    const result = toBeRendered();

    expect(result.pass).toBe(false);
  });

  it("return pass is false when no mocked element", () => {
    const ele = <div />;
    render(ele);
    const result = toBeRendered(ele);
    expect(result.pass).toBe(false);
  });

  it("returns a message that contains the source line if no match", () => {
    const result = toBeRendered(Component);
    expect(result.message()).toMatch(
      `expect(mockedComponent).toBeRendered()`
    );
  });
});
