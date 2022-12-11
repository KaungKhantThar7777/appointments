import {
  fetchResponseOk,
  fetchResponseError,
} from "./builders/fetch";
import {
  performFetch,
  buildEnvironment,
  getEnvironment,
} from "../src/relayEnvironment";
import {
  Environment,
  Network,
  Store,
  RecordSource,
} from "relay-runtime";
jest.mock("relay-runtime");
describe("performFetch", () => {
  let response = { data: { id: 123 } };
  const text = "test";
  const variables = { a: 123 };

  beforeEach(() => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(fetchResponseOk(response));
  });

  it("sends HTTP request to POST /graphql", () => {
    performFetch({ text }, variables);

    expect(global.fetch).toBeCalledWith(
      "/graphql",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("calls fetch with the correct configuration", () => {
    performFetch({ text }, variables);

    expect(global.fetch).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });

  it("calls fetch with query and variables as request body", () => {
    performFetch({ text }, variables);

    expect(global.fetch).toBeCalledWith(
      "/graphql",
      expect.objectContaining({
        body: JSON.stringify({
          query: text,
          variables,
        }),
      })
    );
  });

  it("returns the request data", async () => {
    const result = await performFetch(
      { text },
      variables
    );

    expect(result).toEqual(response);
  });

  it("rejects when the request fails", () => {
    global.fetch.mockResolvedValue(
      fetchResponseError(500)
    );

    expect(
      performFetch({ text }, variables)
    ).rejects.toEqual(new Error(500));
  });
});

describe("buildEnvironment", () => {
  const environment = { a: 123 };
  const network = { b: 456 };
  const store = { c: 789 };
  const recordSource = { d: 556 };

  beforeEach(() => {
    Environment.mockImplementation(() => environment);
    Network.create.mockReturnValue(network);
    Store.mockImplementation(() => store);
    RecordSource.mockImplementation(
      () => recordSource
    );
  });

  afterAll(() => {
    Environment.mockClear();
  });

  it("returns environment", () => {
    expect(buildEnvironment()).toEqual(environment);
  });

  it("calls Environment with network and store", () => {
    expect(Environment).toBeCalledWith({
      network,
      store,
    });
  });

  it("calls Network.create with performEach", () => {
    expect(Network.create).toBeCalledWith(
      performFetch
    );
  });

  it("calls Store with RecordStore", () => {
    expect(Store).toBeCalledWith(recordSource);
  });
});

describe("getEnvironment", () => {
  it("constructs the object only once", () => {
    getEnvironment();
    getEnvironment();
    console.log(Environment.mock.calls);
    expect(Environment.mock.calls.length).toEqual(1);
  });
});
