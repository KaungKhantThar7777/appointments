import React from "react";
import ReactDOM from "react-dom/client";

import { act } from "react-dom/test-utils";
import { Appointment, AppointmentsDayView } from "../src/AppointmentsDayView";

describe("Appointment", () => {
  let container;

  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };
  const render = (component) =>
    act(() => ReactDOM.createRoot(container).render(component));

  beforeEach(() => {
    container = document.createElement("div");
    document.body.replaceChildren(container);
  });

  const appointmentTable = () =>
    document.querySelector("#appointmentView > table");

  it("render a table", () => {
    render(<Appointment customer={blankCustomer} />);

    expect(appointmentTable().textContent).not.toBeNull();
  });
  it("render the customer first name", () => {
    const customer = { firstName: "Ashley" };

    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toContain("Ashley");
  });

  it("render another customer first name", () => {
    const customer = { firstName: "Jordan" };

    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toContain("Jordan");
  });

  it("renders customer last name", () => {
    const customer = { lastName: "Smith" };

    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toContain("Smith");
  });

  it("renders customer phone number", () => {
    const customer = { phoneNumber: "1234567890" };
    render(<Appointment customer={customer} />);

    expect(appointmentTable().textContent).toContain("1234567890");
  });

  it("renders appointment stylist", () => {
    render(<Appointment customer={blankCustomer} stylist="Kaung Khant Thar" />);

    expect(appointmentTable().textContent).toContain("Kaung Khant Thar");
  });

  it("renders appointment service", () => {
    render(<Appointment customer={blankCustomer} service="Cut" />);

    expect(appointmentTable().textContent).toContain("Cut");
  });

  it("renders appointment notes", () => {
    render(
      <Appointment
        customer={blankCustomer}
        notes="This customer needs a cut every 3 weeks"
      />
    );

    expect(appointmentTable().textContent).toContain(
      "This customer needs a cut every 3 weeks"
    );
  });

  it("renders appointment time", () => {
    const today = new Date();

    const customer = { time: "12:00" };
    render(
      <Appointment customer={customer} startsAt={today.setHours(12, 0)} />
    );

    expect(document.body.textContent).toContain("12:00");
  });
});

describe("AppointmentsDayView", () => {
  let container;

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
    container = document.createElement("div");
    document.body.replaceChildren(container);
  });

  const render = (component) =>
    act(() => ReactDOM.createRoot(container).render(component));

  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);

    expect(document.querySelector("div#appointmentsDayView")).not.toBeNull();
  });

  it("renders an ol element to display appointments", () => {
    render(<AppointmentsDayView appointments={[]} />);
    const listElement = document.querySelector("ol");
    expect(listElement).not.toBeNull();
  });

  it("render an li for each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const listChildren = document.querySelectorAll("ol > li");

    expect(listChildren).toHaveLength(2);
  });

  it("renders the time of each appointment", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const listChildren = document.querySelectorAll("ol > li");
    expect(listChildren[0].textContent).toEqual("12:00");

    expect(listChildren[1].textContent).toEqual("13:00");
  });

  it("initially shows a message saying there are no appointments today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(document.body.textContent).toContain(
      "There are no appointments scheduled for today"
    );
  });

  it("select the first appointment by default", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    expect(document.body.textContent).toContain("Ashley");
  });

  it("has a button element in each li", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const buttons = document.querySelectorAll("li > button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0].type).toEqual("button");
  });

  it("renders another appointment when click", () => {
    render(<AppointmentsDayView appointments={twoAppointments} />);

    const button = document.querySelectorAll("li > button")[1];
    act(() => button.click());

    expect(document.body.textContent).toContain("Jordan");
  });
});
