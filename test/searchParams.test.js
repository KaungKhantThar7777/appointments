import { searchParams } from "../src/searchParams";

describe("searchParams", () => {
  it("returns correct query string", () => {
    const queryObj = {
      page: 5,
      searchTerm: "kaung khant thar",
    };

    expect(searchParams(queryObj)).toBe(
      "?page=5&searchTerm=kaung%20khant%20thar"
    );
  });

  it("returns empty string", () => {
    const queryObj = {
      page: null,
      searchTerm: undefined,
    };
    expect(searchParams(queryObj)).toBe("");
  });
});
