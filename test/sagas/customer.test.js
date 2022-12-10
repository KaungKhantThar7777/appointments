import { storeSpy, expectRedux } from "expect-redux";
import { appHistory } from "../../src/history";
import { configureStore } from "../../src/store";
import {
  fetchResponseError,
  fetchResponseOk,
} from "../builders/fetch";

describe("addCustomer", () => {
  let store;
  const customer = { id: 123 };
  beforeEach(() => {
    jest
      .spyOn(global, "fetch")
      .mockReturnValue(fetchResponseOk(customer));
    store = configureStore([storeSpy]);
  });

  const addCustomerRequest = (customer) => ({
    type: "ADD_CUSTOMER_REQUEST",
    payload: customer,
  });

  it("sets current status to submitting", () => {
    store.dispatch(addCustomerRequest());

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({ type: "ADD_CUSTOMER_SUBMITTING" });
  });

  const inputCustomer = { firstName: "Ashley" };
  it("sends HTTP request to POST /customers", async () => {
    store.dispatch(addCustomerRequest(inputCustomer));

    expect(global.fetch).toBeCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("calls fetch with correct configuration", async () => {
    store.dispatch(addCustomerRequest(inputCustomer));

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

  it("calls fetch with customer as a request body", async () => {
    store.dispatch(addCustomerRequest(inputCustomer));
    expect(global.fetch).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: JSON.stringify(inputCustomer),
      })
    );
  });

  it("dispatches ADD_CUSTOMER_SUCCESSFUL on success", () => {
    store.dispatch(addCustomerRequest());

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: "ADD_CUSTOMER_SUCCESSFUL",
        payload: customer,
      });
  });

  it("dispatches ADD_CUSTOMER_FAILED on non-specific error", () => {
    global.fetch.mockReturnValue(
      fetchResponseError()
    );
    store.dispatch(addCustomerRequest());

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: "ADD_CUSTOMER_FAILED",
      });
  });

  it("dispatches ADD_CUSTOMER_VALIDATION_FAILED if validation errors were returned", () => {
    const errors = {
      field: "error",
      description: "error text",
    };

    global.fetch.mockReturnValue(
      fetchResponseError(422, { errors })
    );

    store.dispatch(addCustomerRequest());

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: "ADD_CUSTOMER_VALIDATION_FAILED",
        payload: errors,
      });
  });

  it("navigates to /addAppointment on success", () => {
    store.dispatch(addCustomerRequest());
    expect(appHistory.location.pathname).toEqual(
      "/addAppointment"
    );
  });

  it("includes the customer id in the query string when navigating to /addAppointment", () => {
    store.dispatch(addCustomerRequest());

    expect(appHistory.location.search).toEqual(
      "?customer=123"
    );
  });
});
