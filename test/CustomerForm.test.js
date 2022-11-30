import React from "react";
import {
  change,
  clickAndWait,
  element,
  elements,
  field,
  form,
  initializeReactContainer,
  labelFor,
  render,
  submit,
  submitButton,
  textOf,
  withFocus,
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";

import { bodyOfLastFetchRequest } from "./spyHelpers";
import {
  fetchResponseError,
  fetchResponseOk,
} from "./builders/fetch";
import {
  blankCustomer,
  validCustomer,
} from "./builders/customer";

describe("CustomerForm", () => {
  beforeEach(() => {
    initializeReactContainer();

    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(fetchResponseOk());
  });

  it("renders a form", () => {
    render(
      <CustomerForm
        original={blankCustomer}
        onSave={() => {}}
      />
    );

    expect(form()).not.toBeNull();
  });

  const itRendersAsATextBox = (fieldName) => {
    it("renders as a text box", () => {
      render(
        <CustomerForm
          original={blankCustomer}
          onSave={() => {}}
        />
      );
      expect(field(fieldName)).toBeInputFieldOfType(
        "text"
      );
    });
  };

  const itIncludesTheExistingValue = (
    fieldName,
    existingValue
  ) => {
    it("includes the existing value", () => {
      const customer = { [fieldName]: existingValue };

      render(
        <CustomerForm
          original={customer}
          onSave={() => {}}
        />
      );

      expect(field(fieldName).value).toEqual(
        existingValue
      );
    });
  };

  const itRendersALabel = (fieldName, text) => {
    it("renders a label ", () => {
      render(
        <CustomerForm
          original={blankCustomer}
          onSave={() => {}}
        />
      );

      expect(labelFor(fieldName)).not.toBeNull();
    });

    it(`render '${text}' as the label content`, () => {
      render(
        <CustomerForm
          original={blankCustomer}
          onSave={() => {}}
        />
      );

      expect(labelFor(fieldName)).toContainText(text);
    });
  };

  const itAssignAnIdThatMatchTheLabelId = (
    fieldName
  ) => {
    it("assigns an id that matches the label id", () => {
      render(
        <CustomerForm
          original={blankCustomer}
          onSave={() => {}}
        />
      );

      expect(field(fieldName).id).toEqual(fieldName);
    });
  };

  const itSubmitExistingValue = (
    fieldName,
    existingValue
  ) => {
    it("submit existing value when submitted", () => {
      const customer = {
        ...validCustomer,
        [fieldName]: existingValue,
      };

      render(
        <CustomerForm
          original={customer}
          x
          onSave={() => {}}
        />
      );

      submit(form());

      expect(bodyOfLastFetchRequest()).toMatchObject(
        customer
      );
    });
  };
  const itSubmitNewValue = (
    fieldName,
    existingValue
  ) => {
    it("submit new value", async () => {
      render(
        <CustomerForm
          original={validCustomer}
          onSave={() => {}}
        />
      );
      change(field(fieldName), existingValue);
      await clickAndWait(submitButton());
      expect(bodyOfLastFetchRequest()).toMatchObject({
        [fieldName]: existingValue,
      });
    });
  };
  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itIncludesTheExistingValue("firstName", "Kaung");
    itRendersALabel("firstName", "First name");
    itAssignAnIdThatMatchTheLabelId("firstName");
    itSubmitExistingValue("firstName", "Kaung");
    itSubmitNewValue("firstName", "Kaung");
  });

  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itIncludesTheExistingValue(
      "lastName",
      "Khant Thar"
    );
    itRendersALabel("lastName", "Last name");
    itAssignAnIdThatMatchTheLabelId("lastName");
    itSubmitExistingValue("lastName", "Khant");
    itSubmitNewValue("lastName", "Khant Thar");
  });

  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");
    itIncludesTheExistingValue(
      "phoneNumber",
      "234234"
    );
    itRendersALabel("phoneNumber", "Phone number");
    itAssignAnIdThatMatchTheLabelId("phoneNumber");
    itSubmitExistingValue("phoneNumber", "1234");
    itSubmitNewValue("phoneNumber", "5555");
  });

  it("sends POST request to /customers when submitting the form", async () => {
    render(
      <CustomerForm
        original={validCustomer}
        onSave={() => {}}
      />
    );

    await clickAndWait(submitButton());

    expect(fetch).toBeCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
      })
    );
  });

  it("calls fetch with the right configuration", async () => {
    render(
      <CustomerForm
        original={validCustomer}
        onSave={() => {}}
      />
    );

    await clickAndWait(submitButton());
    expect(fetch).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });

  it("notifies onSave when form is submitted", async () => {
    const customer = { id: 123 };
    fetch.mockResolvedValue(
      fetchResponseOk(customer)
    );

    const saveSpy = jest.fn();

    render(
      <CustomerForm
        original={validCustomer}
        onSave={saveSpy}
      />
    );

    await clickAndWait(submitButton());
    expect(saveSpy).toBeCalledWith(customer);
  });
  it("does not notify onSave", async () => {
    fetch.mockRejectedValue(fetchResponseError());
    const saveSpy = jest.fn();

    render(
      <CustomerForm
        original={blankCustomer}
        onSave={saveSpy}
      />
    );

    async () => await clickAndWait(submitButton());

    expect(saveSpy).not.toBeCalled();
  });

  it("renders error message", async () => {
    fetch.mockRejectedValue(fetchResponseError());

    render(<CustomerForm original={validCustomer} />);

    await clickAndWait(submitButton());

    expect(element("[role=alert]")).toContainText(
      "error occurred"
    );
  });

  it("renders an alert space", () => {
    render(<CustomerForm original={blankCustomer} />);

    expect(element("[role=alert]")).not.toBeNull();
  });

  it("has no text in alert space initially", () => {
    render(<CustomerForm original={blankCustomer} />);

    expect(element("[role=alert]")).not.toContainText(
      "error occurred"
    );
  });

  it("pass when second submitted time", async () => {
    fetch.mockRejectedValueOnce(fetchResponseError());

    const saveFn = jest.fn();
    render(
      <CustomerForm
        original={validCustomer}
        onSave={saveFn}
      />
    );

    await clickAndWait(submitButton());

    expect(element("[role=alert]")).toContainText(
      "error occurred"
    );

    // change field to valid

    await clickAndWait(submitButton());

    expect(element("[role=alert]")).not.toContainText(
      "error occurred"
    );
    expect(saveFn).toHaveBeenCalledTimes(1);
  });

  it("does not submit the form when there are validation errors", async () => {
    render(<CustomerForm original={blankCustomer} />);

    await clickAndWait(submitButton());

    expect(global.fetch).not.toBeCalled();
  });

  it("renders validation errors after submission fails", async () => {
    render(<CustomerForm original={blankCustomer} />);

    await clickAndWait(submitButton());

    expect(textOf(elements("[role=alert]"))).toEqual([
      " ",
      "First name is required",
      "Last name is required",
      "Phone number is required",
    ]);
  });

  describe("validation", () => {
    const errorFor = (fieldName) =>
      element(`#${fieldName}Error[role=alert]`);
    const itRendersAlertForFieldValidation = (
      fieldName
    ) => {
      it(`renders an alert space for the ${fieldName} validation errors`, () => {
        render(
          <CustomerForm original={blankCustomer} />
        );

        expect(errorFor(fieldName)).not.toBeNull();
      });
    };

    const itSetsAccessibleDescriptionForField = (
      fieldName
    ) => {
      it(`sets alert as the accessible description for the ${fieldName} field`, () => {
        render(
          <CustomerForm original={blankCustomer} />
        );

        expect(
          field(fieldName).getAttribute(
            "aria-describedby"
          )
        ).toEqual(`${fieldName}Error`);
      });
    };

    const itDisplaysErrorAfterBlur = (
      fieldName,
      value,
      description
    ) => {
      it(`displays error after blur when ${fieldName} is blank`, () => {
        render(
          <CustomerForm original={blankCustomer} />
        );

        withFocus(field(fieldName), () => {
          change(field(fieldName), value);
        });

        expect(
          element(`#${fieldName}Error[role=alert]`)
        ).toContainText(description);
      });
    };

    const itInitiallyHasNoError = (fieldName) => {
      it(`initially has no text in the ${fieldName} field alert space`, () => {
        render(
          <CustomerForm original={blankCustomer} />
        );

        expect(
          element(`#${fieldName}Error[role=alert]`)
            .textContent
        ).toEqual("");
      });
    };
    describe("firstName", () => {
      itRendersAlertForFieldValidation("firstName");
      itSetsAccessibleDescriptionForField(
        "firstName"
      );
      itDisplaysErrorAfterBlur(
        "firstName",
        " ",
        "First name is required"
      );
      itInitiallyHasNoError("firstName");
    });

    describe("lastName", () => {
      itRendersAlertForFieldValidation("lastName");
      itSetsAccessibleDescriptionForField("lastName");
      itDisplaysErrorAfterBlur(
        "lastName",
        " ",
        "Last name is required"
      );
      itInitiallyHasNoError("lastName");
    });

    describe("phoneNumber", () => {
      itRendersAlertForFieldValidation("phoneNumber");
      itSetsAccessibleDescriptionForField(
        "phoneNumber"
      );
      itDisplaysErrorAfterBlur(
        "phoneNumber",
        " ",
        "Phone number is required"
      );
      itDisplaysErrorAfterBlur(
        "phoneNumber",
        "**701234-123(12)",
        "Only numbers, spaces and these symbols are allowed: ( ) + -"
      );

      it("accepts standards phone number characters when validating", () => {
        render(
          <CustomerForm original={blankCustomer} />
        );

        withFocus(field("phoneNumber"), () => {
          change(
            field("phoneNumber"),
            "0123456789 () - +  "
          );
        });

        expect(
          errorFor("phoneNumber")
        ).not.toContainText("Only numbers");
      });
    });
  });
});
