import React from "react";
import { act } from "react-dom/test-utils";
import {
  click,
  element,
  initializeReactContainer,
  render,
  renderAndWait,
  propsOf,
} from "./reactTestExtensions";

import { App } from "../src/App";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";
import { CustomerForm } from "../src/CustomerForm";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader";
import { blankCustomer } from "./builders/customer";
import { blankAppointment } from "./builders/appointment";

jest.mock("../src/AppointmentsDayViewLoader", () => ({
  AppointmentsDayViewLoader: jest.fn(() => (
    <div id="AppointmentsDayViewLoader" />
  )),
}));

jest.mock("../src/CustomerForm", () => ({
  CustomerForm: jest.fn(() => (
    <div id="CustomerForm" />
  )),
}));

jest.mock("../src/AppointmentFormLoader", () => ({
  AppointmentFormLoader: jest.fn(() => (
    <div id="AppointmentFormLoader" />
  )),
}));

describe("App", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  it("initially shows the AppointmentsDayViewLoader", () => {
    render(<App />);

    expect(AppointmentsDayViewLoader).toBeRendered();
  });

  it("has menu bar", () => {
    render(<App />);

    expect(element("menu")).not.toBeNull();
  });

  it("has a button to initiate add customer and appointment", () => {
    render(<App />);
    const addCustomerAppointmentBtn = element(
      "menu > li > button:first-of-type"
    );

    expect(addCustomerAppointmentBtn).toContainText(
      "Add customer and appointment"
    );
  });

  const beginAddCustomerAppointment = () => {
    click(
      element("menu > li > button:first-of-type")
    );
  };

  it("displays the CustomerForm when button is clicked", () => {
    render(<App />);

    beginAddCustomerAppointment();
    expect(element("#CustomerForm")).not.toBeNull();
  });

  it("passes a blank original customer object to CustomerForm", () => {
    render(<App />);

    beginAddCustomerAppointment();

    expect(CustomerForm).toBeRenderedWithProps(
      expect.objectContaining({
        original: blankCustomer,
      })
    );
  });

  it("hides the AppointmentsDayViewLoader when button is clicked", () => {
    render(<App />);

    beginAddCustomerAppointment();

    expect(
      element("#AppointmentsDayViewLoader")
    ).toBeNull();
  });

  it("hides the button bar when button is clicked", () => {
    render(<App />);

    beginAddCustomerAppointment();
    expect(element("menu")).toBeNull();
  });

  const exampleCustomer = { id: 123 };

  const saveCustomer = (
    customer = exampleCustomer
  ) => {
    act(() => propsOf(CustomerForm).onSave(customer));
  };

  const saveAppointment = () =>
    act(() =>
      propsOf(AppointmentFormLoader).onSave()
    );
  it("displays the AppointmentFormLoader after the CustomerForm is submitted", async () => {
    render(<App />);
    beginAddCustomerAppointment();
    saveCustomer();

    expect(
      element("#AppointmentFormLoader")
    ).not.toBeNull();
  });

  it("passes a blank appointment object to the AppointmentFormLoader", async () => {
    render(<App />);
    beginAddCustomerAppointment();
    saveCustomer();

    expect(
      AppointmentFormLoader
    ).toBeRenderedWithProps({
      original: expect.objectContaining({
        ...blankAppointment,
      }),
      onSave: expect.anything(),
    });
  });

  it("passes the customer to the AppointmentForm", () => {
    const customer = { id: 123 };

    render(<App />);
    beginAddCustomerAppointment();
    saveCustomer(customer);

    expect(
      AppointmentFormLoader
    ).toBeRenderedWithProps(
      expect.objectContaining({
        original: {
          ...blankAppointment,
          customer: customer.id,
        },
        onSave: expect.anything(),
      })
    );
  });

  it("renders AppointmentsDayViewLoader after AppointmentForm is submitted", () => {
    render(<App />);
    beginAddCustomerAppointment();
    saveCustomer();
    saveAppointment();

    expect(AppointmentsDayViewLoader).toBeRendered();
  });
});
