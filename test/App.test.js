import React from "react";
import { act } from "react-dom/test-utils";
import {
  click,
  element,
  initializeReactContainer,
  render,
  renderAndWait,
  propsOf,
  renderAdditional,
} from "./reactTestExtensions";

import { App } from "../src/App";
import { AppointmentsDayViewLoader } from "../src/AppointmentsDayViewLoader";
import { CustomerForm } from "../src/CustomerForm";
import { AppointmentFormLoader } from "../src/AppointmentFormLoader";
import { blankCustomer } from "./builders/customer";
import { blankAppointment } from "./builders/appointment";
import { CustomerSearch } from "../src/CustomerSearch";

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

jest.mock("../src/CustomerSearch", () => ({
  CustomerSearch: jest.fn(() => (
    <div id="CustomerSearch"> </div>
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

  describe("CustomerSearch", () => {
    it("has a button to search customers", () => {
      render(<App />);
      const secondButton = element(
        "menu li:nth-of-type(2) button"
      );

      expect(secondButton).not.toBeNull();
      expect(secondButton).toContainText(
        "Search customers"
      );
    });

    const navigateToSearchCustomers = () =>
      click(element("menu li:nth-of-type(2) button"));

    const searchFor = (customer) =>
      propsOf(CustomerSearch).renderCustomerActions(
        customer
      );

    it("displays CustomerSearch when button is clicked", () => {
      render(<App />);

      navigateToSearchCustomers();

      expect(CustomerSearch).toBeRendered();
    });

    it("passses a button to the CustomerSearch name Create Appointment", () => {
      render(<App />);
      navigateToSearchCustomers();

      const buttonContainer = renderAdditional(
        searchFor()
      );

      expect(
        buttonContainer.firstChild
      ).toBeElementWithTag("button");
      expect(
        buttonContainer.firstChild
      ).toContainText("Create Appointment");
    });

    it("clicking appointment button shows the appointment form for that customer", async () => {
      const customer = { id: 123 };

      render(<App />);

      navigateToSearchCustomers();
      const buttonContainer = renderAdditional(
        searchFor(customer)
      );

      click(buttonContainer.firstChild);

      expect(
        element("#AppointmentFormLoader")
      ).not.toBeNull();

      expect(
        propsOf(AppointmentFormLoader).original
      ).toMatchObject({ customer: 123 });
    });
  });
});
