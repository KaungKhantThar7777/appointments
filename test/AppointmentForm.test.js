import React from "react";
import { today, todayAt, tomorrow, tomorrowAt } from "../test/builders/time";
import {
  initializeReactContainer,
  render,
  field,
  form,
  element,
  elements,
  submitButton,
  click,
  labelFor,
  submit,
  change,
} from "./reactTestExtensions";
import { AppointmentForm } from "../src/AppointmentForm";

describe("AppointmentForm", () => {
  beforeEach(() => {
    initializeReactContainer();
  });

  const availableTimeSlots = [
    { startsAt: todayAt(9) },
    { startsAt: todayAt(9, 30) },
  ];
  const selectableServices = ["Cut", "Blow-dry"];

  const testProps = {
    today,
    selectableServices,
    availableTimeSlots,
  };
  const labelsOfAllOptions = (element) =>
    Array.from(element.childNodes, (node) => node.textContent);

  it("renders a form", () => {
    render(<AppointmentForm {...testProps} />);
    expect(form()).not.toBeNull();
  });

  it("renders a submit button", () => {
    render(<AppointmentForm {...testProps} />);
    expect(submitButton()).not.toBeNull();
  });

  it("save existing value when submitted", () => {
    expect.hasAssertions();

    const appointment = {
      startsAt: availableTimeSlots[1].startsAt,
    };

    render(
      <AppointmentForm
        {...testProps}
        original={appointment}
        onSubmit={({ startsAt }) => {
          expect(startsAt).toEqual(appointment.startsAt);
        }}
      />
    );

    click(submitButton());
  });

  it("saves new value when submitter", () => {
    expect.hasAssertions();
    const appointment = {
      startsAt: availableTimeSlots[0].startsAt,
    };

    render(
      <AppointmentForm
        {...testProps}
        original={appointment}
        onSubmit={({ startsAt }) => {
          expect(startsAt).toEqual(availableTimeSlots[1].startsAt);
        }}
      />
    );
    click(startsAtField(1));
    click(submitButton());
  });

  const findOption = (selectBox, textContent) => {
    const options = Array.from(selectBox.childNodes);
    return options.find((option) => option.textContent === textContent);
  };

  describe("service field", () => {
    it("renders as a select box", () => {
      render(<AppointmentForm {...testProps} />);
      expect(field("service")).toBeElementWithTag("select");
    });

    it("renders a label", () => {
      render(<AppointmentForm {...testProps} />);
      expect(labelFor("service")).not.toBeNull();
    });

    it("assign an id that match label id", () => {
      render(<AppointmentForm {...testProps} />);

      expect(field("service").id).toBe("service");
    });

    it("save existing value when submitted", () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          {...testProps}
          original={{ service: "Cut" }}
          onSubmit={({ service }) => {
            expect(service).toBe("Cut");
          }}
        />
      );

      click(submitButton());
    });

    it("save new value when submitted", () => {
      const newValue = "Blow-dry";
      expect.hasAssertions();
      render(
        <AppointmentForm
          {...testProps}
          onSubmit={({ service }) => {
            expect(service).toBe(newValue);
          }}
        />
      );
      change(field("service"), newValue);
      click(submitButton());
    });

    it("lists all salon services", () => {
      render(<AppointmentForm {...testProps} />);

      expect(labelsOfAllOptions(field("service"))).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });

    it("has a blank value as the first value", () => {
      render(<AppointmentForm {...testProps} />);
      const firstOption = field("service").childNodes[0];
      expect(firstOption.value).toBe("");
    });

    it("pre-selects the existing value", () => {
      const appointment = { service: "Blow-dry" };
      render(<AppointmentForm {...testProps} original={appointment} />);

      const option = findOption(field("service"), "Blow-dry");
      expect(option.selected).toBe(true);
    });
  });

  const startsAtField = (index) => elements('input[name="startsAt"]')[index];

  describe("time slot table", () => {
    it("renders a table for time slots with an id", () => {
      render(<AppointmentForm {...testProps} />);

      expect(element("table#time-slots")).not.toBeNull();
    });

    it("renders a time slot for every half an hour between open and close times", () => {
      render(
        <AppointmentForm {...testProps} salonOpensAt={9} salonClosesAt={11} />
      );
      const timesOfDayHeadings = elements("tbody >* th");

      expect(timesOfDayHeadings[0]).toContainText("09:00");
      expect(timesOfDayHeadings[1]).toContainText("09:30");
      expect(timesOfDayHeadings[3]).toContainText("10:30");
    });

    it("renders an empty cell at the start of the header row", () => {
      render(<AppointmentForm {...testProps} />);
      const headerRow = element("thead > tr");
      expect(headerRow.firstChild).toContainText("");
    });

    it("renders a week of available dates", () => {
      const specificDate = new Date(2022, 10, 13);

      render(<AppointmentForm {...testProps} today={specificDate} />);
      const dates = elements("thead >* th:not(:first-child)");
      expect(dates).toHaveLength(7);
      expect(dates[0]).toContainText("Sun 13");
      expect(dates[1]).toContainText("Mon 14");
      expect(dates[2]).toContainText("Tue 15");
    });

    const cellsWithRadioButton = () =>
      elements("input[type='radio']").map((el) => {
        const td = elements("td");
        return td.indexOf(el.parentElement);
      });
    it("renders radio buttons in the correct table cell positions", () => {
      const availableTimeSlots = [
        {
          startsAt: todayAt(9, 0),
        },
        {
          startsAt: todayAt(9, 30),
        },
        {
          startsAt: tomorrowAt(9, 30),
        },
      ];

      render(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={availableTimeSlots}
        />
      );

      expect(cellsWithRadioButton()).toEqual([0, 7, 8]);
    });

    it("does not render radio buttons for unavailable timeslots", () => {
      render(<AppointmentForm availableTimeSlots={[]} />);

      expect(elements('input[type="radio"]')).toHaveLength(0);
    });

    it("sets radio button value to the startsAt value of the corresponding appointment", () => {
      render(<AppointmentForm {...testProps} />);

      const allRadiosValues = elements('input[type="radio"]').map(({ value }) =>
        parseInt(value)
      );

      const allSlotsTimes = availableTimeSlots.map(({ startsAt }) => startsAt);

      expect(allRadiosValues).toEqual(allSlotsTimes);
    });

    it("pre-select the existing value", () => {
      const appointment = {
        startsAt: availableTimeSlots[1].startsAt,
      };

      render(<AppointmentForm {...testProps} original={appointment} />);

      expect(startsAtField(1).checked).toEqual(true);
    });
  });
});
