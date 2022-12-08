import React from "react";
import { RouterButton } from "../../src/components/CustomerSearch/RouterButton";
import { SearchButtons } from "../../src/components/CustomerSearch/SearchButtons";
import { ToggleRouterButton } from "../../src/components/CustomerSearch/ToggleRouterButton";
import {
  element,
  initializeReactContainer,
  propsMatching,
  render,
} from "../reactTestExtensions";

const tenCustomers = Array.from(
  "0123456789",
  (id) => ({ id })
);

jest.mock(
  "../../src/components/CustomerSearch/RouterButton",
  () => ({
    RouterButton: jest.fn(({ id, children }) => (
      <div id={id}>{children}</div>
    )),
  })
);

jest.mock(
  "../../src/components/CustomerSearch/ToggleRouterButton",
  () => ({
    ToggleRouterButton: jest.fn(
      ({ id, children }) => (
        <div id={id}>{children}</div>
      )
    ),
  })
);
describe("SearchButtons", () => {
  beforeEach(() => {
    initializeReactContainer();
  });
  const testProps = {
    lastRowIds: ["123"],
    searchTerm: "term",
    customers: tenCustomers,
  };
  describe("previous button", () => {
    const previousPageButtonProps = () =>
      propsMatching(RouterButton, {
        id: "previous-page",
      });

    it("renders", () => {
      render(<SearchButtons {...testProps} />);

      expect(previousPageButtonProps()).toMatchObject(
        {
          disabled: false,
        }
      );

      expect(element("#previous-page")).toContainText(
        "Previous"
      );
    });

    it("removes last append row ID from lastRowIds in queryParams props", () => {
      render(
        <SearchButtons
          {...testProps}
          lastRowIds={["123", "234"]}
        />
      );

      expect(previousPageButtonProps()).toMatchObject(
        {
          queryParams: expect.objectContaining({
            lastRowIds: ["123"],
          }),
        }
      );
    });

    it("includes limit and search term in queryParams prop", () => {
      render(
        <SearchButtons
          {...testProps}
          limit={20}
          searchTerm="name"
        />
      );

      expect(previousPageButtonProps()).toMatchObject(
        {
          queryParams: {
            limit: 20,
            searchTerm: "name",
          },
        }
      );
    });

    it("is disabled if no lastRowIds", () => {
      render(
        <SearchButtons
          {...testProps}
          lastRowIds={[]}
        />
      );

      expect(previousPageButtonProps()).toMatchObject(
        {
          disabled: true,
        }
      );
    });
  });

  describe("next button", () => {
    const nextPageButtonProps = () =>
      propsMatching(RouterButton, {
        id: "next-page",
      });

    it("renders", () => {
      render(<SearchButtons {...testProps} />);

      expect(nextPageButtonProps()).toMatchObject({
        disabled: false,
      });
    });

    it("appends new next row id to lastRowIds in queryParams props", () => {
      render(<SearchButtons {...testProps} />);

      expect(nextPageButtonProps()).toMatchObject({
        queryParams: {
          lastRowIds: ["123", "9"],
        },
      });
    });

    it("includes limit and search term in queryParams props", () => {
      render(
        <SearchButtons
          {...testProps}
          limit={20}
          searchTerm="term"
        />
      );

      expect(nextPageButtonProps()).toMatchObject({
        queryParams: expect.objectContaining({
          limit: 20,
          searchTerm: "term",
        }),
      });
    });

    it("is disabled if there are fewer records than the page limit shown", () => {
      render(
        <SearchButtons
          {...testProps}
          customers={[]}
        />
      );

      expect(nextPageButtonProps()).toMatchObject({
        disabled: true,
      });
    });
  });

  describe("limit toggle buttons", () => {
    it("has a button with a label of 10 that is initially toggled", () => {
      render(<SearchButtons {...testProps} />);
      const buttonProps = propsMatching(
        ToggleRouterButton,
        { id: "limit-10" }
      );

      expect(buttonProps).toMatchObject({
        toggled: true,
        children: 10,
        queryParams: {
          limit: 10,
          lastRowIds: ["123"],
          searchTerm: "term",
        },
      });

      expect(element("#limit-10")).toContainText(
        `10`
      );
    });

    [20, 30, 50].map((limitSize) => {
      it(`has a button with a label of ${limitSize} that is initially not toggled`, () => {
        render(<SearchButtons {...testProps} />);
        const buttonProps = propsMatching(
          ToggleRouterButton,
          { id: `limit-${limitSize}` }
        );

        expect(buttonProps).toMatchObject({
          toggled: false,
          queryParams: {
            limit: limitSize,
            lastRowIds: ["123"],
            searchTerm: "term",
          },
        });

        expect(
          element(`#limit-${limitSize}`)
        ).toContainText(`${limitSize}`);
      });

      it(`toggled when the limitSize is ${limitSize}`, () => {
        render(
          <SearchButtons
            {...testProps}
            limit={limitSize}
          />
        );

        const buttonProps = propsMatching(
          ToggleRouterButton,
          { id: `limit-${limitSize}` }
        );

        expect(buttonProps).toMatchObject({
          toggled: true,
        });
      });
    });
  });
});
