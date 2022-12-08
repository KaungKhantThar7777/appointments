import React from "react";
import { RouterButton } from "../../src/components/CustomerSearch/RouterButton";
import { SearchButtons } from "../../src/components/CustomerSearch/SearchButtons";
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
describe("SearchButtons", () => {
  beforeEach(() => {
    initializeReactContainer();
  });
  const testProps = {
    lastRowIds: ["123"],
    searchItem: "term",
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
});
