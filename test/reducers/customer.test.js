import { reducer } from "../../src/reducers/customer";
import {
  itMaintainsExistingState,
  itSetsStatus,
} from "./reducersGenerators";

describe("customer reducer", () => {
  it("returns a default state for undefined existing state", () => {
    expect(reducer(undefined, {})).toEqual({
      customer: {},
      status: undefined,
      validationErrors: {},
      error: false,
    });
  });

  describe("ADD_CUSTOMER_SUBMITTING Action", () => {
    const action = {
      type: "ADD_CUSTOMER_SUBMITTING",
    };

    itSetsStatus(reducer, action, "SUBMITTING");

    itMaintainsExistingState(reducer, action);
  });

  describe("ADD_CUSTOMER_SUCCESSFUL", () => {
    const customer = { id: 123 };

    const action = {
      type: "ADD_CUSTOMER_SUCCESSFUL",
      payload: customer,
    };
    itSetsStatus(reducer, action, "SUCCESSFUL");

    itMaintainsExistingState(reducer, action);

    it("sets customer to provided customer", () => {
      expect(
        reducer(undefined, action)
      ).toMatchObject({
        customer,
      });
    });
  });

  describe("ADD_CUSTOMER_FAILED action", () => {
    const action = { type: "ADD_CUSTOMER_FAILED" };
    itSetsStatus(reducer, action, "FAILED");

    itMaintainsExistingState(reducer, action);

    it("sets error to true", () => {
      expect(
        reducer({ a: 123 }, action)
      ).toMatchObject({
        error: true,
      });
    });
  });

  describe("ADD_CUSTOMER_VALIDATION_FAILED action", () => {
    const validationErrors = {
      field: "error text",
    };
    const action = {
      type: "ADD_CUSTOMER_VALIDATION_FAILED",
      payload: validationErrors,
    };

    itSetsStatus(
      reducer,
      action,
      "VALIDATION_FAILED"
    );

    itMaintainsExistingState(reducer, action);

    it("sets validation errors to provided errors", () => {
      expect(
        reducer(undefined, action)
      ).toMatchObject({
        validationErrors,
      });
    });
  });
});
