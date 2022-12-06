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
  renderWithRouter,
  history,
  elements,
  linkFor,
} from "./reactTestExtensions";

import { App } from "../src/App";
import { AppointmentsDayViewLoader } from "../src/components/AppointmentsDayViewLoader";
import { CustomerForm } from "../src/components/CustomerForm";
import { AppointmentFormLoader } from "../src/components/AppointmentFormLoader";
import { blankCustomer } from "./builders/customer";
import { blankAppointment } from "./builders/appointment";

import { SearchCustomersPage } from "../src/pages/SearchCustomersPage";
import { AppointmentFormPage } from "../src/pages/AppointmentFormPage";

jest.mock("../src/pages/AppointmentFormPage", () => ({
  AppointmentFormPage: jest.fn(() => (
    <div id="AppointmentFormPage"></div>
  )),
}));

jest.mock("../src/pages/SearchCustomersPage", () => ({
  SearchCustomersPage: jest.fn(() => (
    <div id="SearchCustomersPage"></div>
  )),
}));

jest.mock("../src/components/CustomerForm", () => ({
  CustomerForm: jest.fn(() => (
    <div id="CustomerForm" />
  )),
}));

jest.mock("../src/components/CustomerSearch", () => ({
  CustomerSearch: jest.fn(() => (
    <div id="CustomerSearch" />
  )),
}));

jest.mock(
  "../src/components/AppointmentsDayViewLoader",
  () => ({
    AppointmentsDayViewLoader: jest.fn(() => (
      <div id="#AppointmentsDayViewLoader"></div>
    )),
  })
);

describe("App", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  it("initially shows the AppointmentsDayViewLoader", () => {
    renderWithRouter(<App />);

    expect(AppointmentsDayViewLoader).toBeRendered();
  });

  it("has menu bar", () => {
    renderWithRouter(<App />);

    expect(element("menu")).not.toBeNull();
  });

  it("has a link to initiate add customer and appointment", () => {
    renderWithRouter(<App />);
    const addCustomerAppointmentBtn = element(
      "menu > li > a:first-of-type"
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

  it("renders CustomerForm at the /addCustomer endpoint", () => {
    renderWithRouter(<App />, {
      location: "/addCustomer",
    });

    expect(element("#CustomerForm")).not.toBeNull();
  });

  it("passes a blank original customer object to CustomerForm", () => {
    renderWithRouter(<App />, {
      location: "/addCustomer",
    });

    expect(CustomerForm).toBeRenderedWithProps(
      expect.objectContaining({
        original: blankCustomer,
      })
    );
  });

  it("hides the button bar when button is clicked", () => {
    renderWithRouter(<App />, {
      location: "/addCustomer",
    });

    expect(element("menu")).toBeNull();
  });

  const exampleCustomer = { id: 123 };

  const saveCustomer = (
    customer = exampleCustomer
  ) => {
    act(() => propsOf(CustomerForm).onSave(customer));
  };

  const saveAppointment = () =>
    act(() => propsOf(AppointmentFormPage).onSave());
  it("displays the AppointmentFormPage after the CustomerForm is submitted", async () => {
    renderWithRouter(<App />, {
      location: "/addCustomer",
    });

    saveCustomer();

    expect(
      element("#AppointmentFormPage")
    ).not.toBeNull();
  });

  it("passes the customer to the AppointmentForm", () => {
    const customer = { id: 123 };

    renderWithRouter(<App />, {
      location: "/addCustomer",
    });

    saveCustomer(customer);

    expect(history.location.search).toEqual(
      "?customer=123"
    );
  });

  it("renders AppointmentFormPage after AppointmentForm is submitted", () => {
    renderWithRouter(<App />, {
      location: "/addCustomer",
    });

    saveCustomer();
    saveAppointment();

    expect(AppointmentFormPage).toBeRendered();
  });

  describe("CustomerSearch", () => {
    it("has a link to search customers", () => {
      renderWithRouter(<App />);
      const secondLink = element(
        "menu li:nth-of-type(2) a"
      );

      expect(secondLink).not.toBeNull();
      expect(secondLink).toContainText(
        "Search customers"
      );
    });

    const searchFor = (customer) =>
      propsOf(
        SearchCustomersPage
      ).renderCustomerActions(customer);

    it("has /searchCustomers link", () => {
      renderWithRouter(<App />);

      expect(
        linkFor("/searchCustomers")
      ).toBeDefined();
    });

    it("clicking appointment link pass customer id", async () => {
      const customer = { id: 123 };

      renderWithRouter(<App />);

      click(linkFor("/searchCustomers"));
      renderWithRouter(searchFor(customer));

      expect(
        linkFor("/addAppointment?customer=123")
      ).toBeDefined();
    });
  });
});
