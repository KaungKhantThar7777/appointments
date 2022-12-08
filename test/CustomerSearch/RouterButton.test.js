import React from "react";
import { RouterButton } from "../../src/components/CustomerSearch/RouterButton";
import {
  element,
  initializeReactContainer,
  render,
} from "../reactTestExtensions";
import { Link } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  Link: jest.fn(({ children }) => (
    <div id="Link">{children}</div>
  )),
}));
describe("RouterButton", () => {
  const queryParams = { a: 123, b: 234 };

  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a Link", () => {
    render(
      <RouterButton queryParams={queryParams} />
    );

    expect(element("#Link")).toBeDefined();
    expect(Link).toBeRenderedWithProps({
      className: "",
      role: "button",
      to: {
        search: "?a=123&b=234",
      },
    });
  });

  it("renders children", () => {
    render(
      <RouterButton queryParams={queryParams}>
        Children
      </RouterButton>
    );

    expect(element("#Link")).toContainText(
      "Children"
    );
  });

  it("adds toggled className when toggled props is true", () => {
    render(
      <RouterButton
        queryParams={queryParams}
        toggled={true}
      />
    );

    expect(Link).toBeRenderedWithProps(
      expect.objectContaining({
        className: "toggled",
      })
    );
  });
});
