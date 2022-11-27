import React from "react";
import {
  today,
  todayAt,
  tomorrowAt,
} from "../test/builders/time";
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
  clickAndWait,
} from "./reactTestExtensions";
import { AppointmentForm } from "../src/AppointmentForm";

describe("AppointmentForm", () => {
  let saveFn;

  beforeEach(() => {
    initializeReactContainer();
    saveFn = jest.fn();
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 201,
    });
  });

  const availableTimeSlots = [
    {
      startsAt: todayAt(9),
      stylists: ["Aslhey", "Joe"],
    },
    {
      startsAt: todayAt(9, 30),
      stylists: ["Ashley"],
    },
  ];
  const selectableServices = ["Cut", "Blow-dry"];
  const selectableStylists = ["Sam", "Jo"];
  const testProps = {
    today,
    selectableServices,
    selectableStylists,
    serviceStylists: {
      Cut: ["Sam", "Jo"],
      "Blow-dry": ["Jo"],
    },
    availableTimeSlots,
  };
  const labelsOfAllOptions = (element) =>
    Array.from(
      element.childNodes,
      (node) => node.textContent
    );

  it("renders a form", () => {
    render(<AppointmentForm {...testProps} />);
    expect(form()).not.toBeNull();
  });

  it("renders a submit button", () => {
    render(<AppointmentForm {...testProps} />);
    expect(submitButton()).not.toBeNull();
  });

  it("save existing value when submitted", async () => {
    const appointment = {
      startsAt: availableTimeSlots[1].startsAt,
    };

    render(
      <AppointmentForm
        {...testProps}
        original={appointment}
        onSave={saveFn}
      />
    );

    await clickAndWait(submitButton());
    expect(saveFn).toHaveBeenCalledWith(appointment);
  });

  it("saves new value when submitted", async () => {
    const appointment = {
      startsAt: availableTimeSlots[0].startsAt,
    };

    render(
      <AppointmentForm
        {...testProps}
        original={appointment}
        onSave={saveFn}
      />
    );
    click(startsAtField(1));
    await clickAndWait(submitButton());

    expect(saveFn).toHaveBeenCalledWith({
      startsAt: availableTimeSlots[1].startsAt,
    });
  });

  it("call a POST request to /appointments", () => {
    render(
      <AppointmentForm
        {...testProps}
        onSave={saveFn}
      />
    );

    click(submitButton());
    expect(fetch).toHaveBeenCalledWith(
      "/appointments",
      {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  });

  it.only("call with the payload body", async () => {
    const selectableServices = ["1", "2"];
    const selectableStylists = ["A", "B", "C"];
    const serviceStylists = {
      1: ["A", "B"],
    };
    const appointment = {
      service: "1",
      customer: "123",
    };
    render(
      <AppointmentForm
        {...testProps}
        original={appointment}
        onSave={saveFn}
        selectableServices={selectableServices}
        selectableStylists={selectableStylists}
        serviceStylists={serviceStylists}
      />
    );

    await clickAndWait(submitButton());

    expect(fetch).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: JSON.stringify(appointment),
      })
    );
  });

  it("responds 201 status", async () => {
    const selectableServices = ["1", "2"];
    const selectableStylists = ["A", "B", "C"];
    const serviceStylists = {
      1: ["A", "B"],
    };
    const appointment = { service: "1" };
    render(
      <AppointmentForm
        {...testProps}
        original={appointment}
        onSave={saveFn}
        selectableServices={selectableServices}
        selectableStylists={selectableStylists}
        serviceStylists={serviceStylists}
      />
    );

    await clickAndWait(submitButton());

    expect(fetch).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: JSON.stringify(appointment),
      })
    );
  });
  const findOption = (selectBox, textContent) => {
    const options = Array.from(selectBox.childNodes);
    return options.find(
      (option) => option.textContent === textContent
    );
  };

  const itRendersAsASelectBox = (fieldName) => {
    it("renders as a select box", () => {
      render(<AppointmentForm {...testProps} />);
      expect(field(fieldName)).toBeElementWithTag(
        "select"
      );
    });
  };

  const itRendersALabel = (fieldName, text) => {
    it("renders a label", () => {
      render(<AppointmentForm {...testProps} />);
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it("assign an id that match label id", () => {
      render(<AppointmentForm {...testProps} />);

      expect(field(fieldName).id).toBe(fieldName);
    });
    it(`render ${text} as label content`, () => {
      render(<AppointmentForm {...testProps} />);
      expect(labelFor(fieldName)).toContainText(text);
    });
  };
  const itSaveExistingValueWhenSubmitted = (
    fieldName,
    existingValue
  ) => {
    it("save existing value when submitted", async () => {
      render(
        <AppointmentForm
          {...testProps}
          original={{ [fieldName]: existingValue }}
          onSave={saveFn}
        />
      );

      await clickAndWait(submitButton());
      expect(saveFn).toHaveBeenCalledWith({
        [fieldName]: existingValue,
      });
    });
  };

  const itSubmitsNewValue = (fieldName, value) => {
    it("save new value when submitted", async () => {
      render(
        <AppointmentForm
          {...testProps}
          onSave={saveFn}
        />
      );
      change(field(fieldName), value);
      await clickAndWait(submitButton());
      expect(saveFn).toHaveBeenCalledWith({
        [fieldName]: value,
      });
    });
  };

  const itListsAllOptionsValue = (
    fieldName,
    options
  ) => {
    it(`lists all ${fieldName}s`, () => {
      render(<AppointmentForm {...testProps} />);

      expect(
        labelsOfAllOptions(field(fieldName))
      ).toEqual(expect.arrayContaining(options));
    });
  };

  const itHasBlankValueForFirstOption = (
    fieldName
  ) => {
    it("has a blank value as the first value", () => {
      render(<AppointmentForm {...testProps} />);
      const firstOption =
        field(fieldName).childNodes[0];
      expect(firstOption.value).toBe("");
    });
  };

  const itPreseletExistingValue = (
    fieldName,
    existingValue
  ) => {
    it("pre-selects the existing value", () => {
      const appointment = {
        [fieldName]: existingValue,
      };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
        />
      );

      const option = findOption(
        field(fieldName),
        existingValue
      );
      expect(option.selected).toBe(true);
    });
  };
  describe("service field", () => {
    itRendersAsASelectBox("service");
    itRendersALabel("service", "Salon service");
    itSaveExistingValueWhenSubmitted(
      "serivce",
      "Cut"
    );
    itSubmitsNewValue("service", "Blow-dry");
    itListsAllOptionsValue(
      "service",
      selectableServices
    );
    itHasBlankValueForFirstOption("service");
    itPreseletExistingValue("service", "Cut");
  });

  describe("stylist field", () => {
    itRendersAsASelectBox("stylist");
    itRendersALabel("stylist", "Stylist");
    itHasBlankValueForFirstOption("stylist");
    itListsAllOptionsValue(
      "stylist",
      selectableStylists
    );
    itSaveExistingValueWhenSubmitted(
      "stylist",
      "Sam"
    );
    itSubmitsNewValue("stylist", "Jo");

    it("lists only stylists that can perform the selected services", () => {
      const selectableServices = ["1", "2"];
      const selectableStylists = ["A", "B", "C"];
      const serviceStylists = {
        1: ["A", "B"],
      };

      const appointment = { service: "1" };
      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
          selectableServices={selectableServices}
          selectableStylists={selectableStylists}
          serviceStylists={serviceStylists}
        />
      );

      expect(
        labelsOfAllOptions(field("stylist"))
      ).toEqual(["", "A", "B"]);
    });
  });

  const startsAtField = (index) =>
    elements('input[name="startsAt"]')[index];

  describe("time slot table", () => {
    it("renders a table for time slots with an id", () => {
      render(<AppointmentForm {...testProps} />);

      expect(
        element("table#time-slots")
      ).not.toBeNull();
    });

    it("renders a time slot for every half an hour between open and close times", () => {
      render(
        <AppointmentForm
          {...testProps}
          salonOpensAt={9}
          salonClosesAt={11}
        />
      );
      const timesOfDayHeadings =
        elements("tbody >* th");

      expect(timesOfDayHeadings[0]).toContainText(
        "09:00"
      );
      expect(timesOfDayHeadings[1]).toContainText(
        "09:30"
      );
      expect(timesOfDayHeadings[3]).toContainText(
        "10:30"
      );
    });

    it("renders an empty cell at the start of the header row", () => {
      render(<AppointmentForm {...testProps} />);
      const headerRow = element("thead > tr");
      expect(headerRow.firstChild).toContainText("");
    });

    it("renders a week of available dates", () => {
      const specificDate = new Date(2022, 10, 13);

      render(
        <AppointmentForm
          {...testProps}
          today={specificDate}
        />
      );
      const dates = elements(
        "thead >* th:not(:first-child)"
      );
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

      expect(cellsWithRadioButton()).toEqual([
        0, 7, 8,
      ]);
    });

    it("does not render radio buttons for unavailable timeslots", () => {
      render(
        <AppointmentForm availableTimeSlots={[]} />
      );

      expect(
        elements('input[type="radio"]')
      ).toHaveLength(0);
    });

    it("sets radio button value to the startsAt value of the corresponding appointment", () => {
      render(<AppointmentForm {...testProps} />);

      const allRadiosValues = elements(
        'input[type="radio"]'
      ).map(({ value }) => parseInt(value));

      const allSlotsTimes = availableTimeSlots.map(
        ({ startsAt }) => startsAt
      );

      expect(allRadiosValues).toEqual(allSlotsTimes);
    });

    it("pre-select the existing value", () => {
      const appointment = {
        startsAt: availableTimeSlots[1].startsAt,
      };

      render(
        <AppointmentForm
          {...testProps}
          original={appointment}
        />
      );

      expect(startsAtField(1).checked).toEqual(true);
    });

    it("filters appointments by selected stylist", () => {
      const availableTimeSlots = [
        {
          startsAt: todayAt(9),
          stylists: ["Ashley"],
        },
        {
          startsAt: todayAt(9, 30),
          stylists: ["Jo"],
        },
      ];

      render(
        <AppointmentForm
          {...testProps}
          availableTimeSlots={availableTimeSlots}
        />
      );

      change(field("stylist"), "Jo");
      expect(cellsWithRadioButton()).toEqual([7]);
    });
  });
});
