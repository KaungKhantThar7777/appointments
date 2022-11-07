import React from "react";

import { Appointment, AppointmentsDayView } from "../src/AppointmentsDayView";
import {
  click,
  initializeReactContainer,
  render,
  element,
  elements,
  typesOf,
  textOf,
} from "./reactTestExtensions";

describe("Appointment", () => {
  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  beforeEach(() => {
    initializeReactContainer();
  });

  const appointmentTable = () => element("#appointmentView > table");

  it("render a table", () => {
    render(<Appointment customer={blankCustomer} />);

    expect(appointmentTable().textContent).not.toBeNull();
  });
  it("render the customer first name", () => {
    const customer = { firstName: "Ashley" };

    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("Ashley");
  });

  it("render another customer first name", () => {
    const customer = { firstName: "Jordan" };

    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("Jordan");
  });

  it("renders customer last name", () => {
    const customer = { lastName: "Smith" };

    render(<Appointment customer={customer} />);
    expect(appointmentTable()).toContainText("Smith");
  });

  it("renders customer phone number", () => {
    const customer = { phoneNumber: "1234567890" };
    render(<Appointment customer={customer} />);

    expect(appointmentTable()).toContainText("1234567890");
  });

  it("renders appointment stylist", () => {
    render(<Appointment customer={blankCustomer} stylist="Kaung Khant Thar" />);

    expect(appointmentTable()).toContainText("Kaung Khant Thar");
  });

  it("renders appointment service", () => {
    render(<Appointment customer={blankCustomer} service="Cut" />);

    expect(appointmentTable()).toContainText("Cut");
  });

  it("renders appointment notes", () => {
    render(
      <Appointment
        customer={blankCustomer}
        notes="This customer needs a cut every 3 weeks"
      />
    );

    expect(appointmentTable()).toContainText(
      "This customer needs a cut every 3 weeks"
    );
  });

  it("renders appointment time", () => {
    const today = new Date();

    const customer = { time: "12:00" };
    render(
      <Appointment customer={customer} startsAt={today.setHours(12, 0)} />
    );

    expect(document.body).toContainText("12:00");
  });
});

describe("AppointmentsDayView", () => {
  const today = new Date();
  const twoAppointments = [
    {
      startsAt: today.setHours(12, 0),
      customer: {
        firstName: "Ashley",
      },
    },
    {
      startsAt: today.setHours(13, 0),
      customer: {
        firstName: "Jordan",
      },
    },
  ];
  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);

    expect(element("div#appointmentsDayView")).not.toBeNull();
  });

  it("renders an ol element to display appointments", () => {
    render(<AppointmentsDayView appointments={[]} />);

    expect(elements("ol")).not.toBeNull();
  });

  it("render an li for each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    expect(elements("ol > li")).toHaveLength(2);
  });

  it("renders the time of each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    expect(textOf(elements("ol > li"))).toEqual(["12:00", "13:00"]);
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(document.body).toContainText(
      "There are no appointments scheduled for today"
    );
  });

  it("select the first appointment by default", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    expect(document.body).toContainText("Ashley");
  });

  it("has a button element in each li", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    expect(typesOf(elements("li > button"))).toEqual(["button", "button"]);
  });

  it("renders another appointment when click", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const button = elements("li > button")[1];
    click(button);

    expect(document.body).toContainText("Jordan");
  });

  it("have toggle className when click", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const button = elements("li > button")[1];
    click(button);

    expect(button).toHaveClass("toggled");
  });
});
