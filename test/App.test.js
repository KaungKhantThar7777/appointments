import React from "react";
import {
  click,
  element,
  elements,
  history,
  initializeReactContainer,
  linkFor,
  propsOf,
  renderWithRouter,
} from "./reactTestExtensions";

import { App } from "../src/App";
import { AppointmentsDayViewLoader } from "../src/components/AppointmentsDayViewLoader";
import { CustomerForm } from "../src/components/CustomerForm";
import { blankCustomer } from "./builders/customer";

import { SearchCustomersPage } from "../src/pages/SearchCustomersPage";

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

jest.mock(
  "../src/components/CustomerSearch/CustomerSearch",
  () => ({
    CustomerSearch: jest.fn(() => (
      <div id="CustomerSearch" />
    )),
  })
);

jest.mock(
  "../src/components/AppointmentsDayViewLoader",
  () => ({
    AppointmentsDayViewLoader: jest.fn(() => (
      <div id="AppointmentsDayViewLoader"></div>
    )),
  })
);

jest.mock("../src/pages/CustomerHistoryPage", () => ({
  CustomerHistoryPage: jest.fn(({ children }) => (
    <div id="CustomerHistoryPage">{children}</div>
  )),
}));

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

  it("renders CustomerForm at the /addCustomer endpoint", () => {
    renderWithRouter(<App />, {
      location: "/addCustomer",
    });

    expect(element("#CustomerForm")).not.toBeNull();
  });

  it("renders CustomerHistory at the /viewHistory endpoint", () => {
    renderWithRouter(<App />, {
      location: "/viewHistory",
    });

    expect(
      element("#CustomerHistoryPage")
    ).not.toBeNull();
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

    it("has link for viewing history", async () => {
      const customer = { id: 123 };

      renderWithRouter(<App />);

      click(linkFor("/searchCustomers"));
      renderWithRouter(searchFor(customer));

      expect(
        linkFor("/viewHistory?customer=123")
      ).toBeDefined();
    });

    it("clicking viewing history render CustomerHistoryPage", async () => {
      const customer = { id: 123 };

      renderWithRouter(<App />);

      click(linkFor("/searchCustomers"));
      renderWithRouter(searchFor(customer));

      click(linkFor("/viewHistory?customer=123"));
      renderWithRouter(<App />);

      expect(
        element("#CustomerHistoryPage")
      ).not.toBeNull();
    });
  });
});
