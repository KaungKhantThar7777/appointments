import React from "react";
import { ToggleRouterButton } from "../../src/components/CustomerSearch/ToggleRouterButton";
import {
  container,
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

describe("ToggleRouterButton", () => {
  const queryParams = { a: 123, b: 234 };

  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a Link", () => {
    render(
      <ToggleRouterButton queryParams={queryParams} />
    );
    expect(container.firstChild).toEqual(
      element("#Link")
    );

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
      <ToggleRouterButton queryParams={queryParams}>
        Children
      </ToggleRouterButton>
    );

    expect(element("#Link")).toContainText(
      "Children"
    );
  });

  it("adds toggled class if toggled props is true", () => {
    render(
      <ToggleRouterButton
        queryParams={queryParams}
        toggled={true}
      >
        Child text
      </ToggleRouterButton>
    );

    expect(Link).toBeRenderedWithProps(
      expect.objectContaining({
        className: "toggled",
      })
    );
  });
});
