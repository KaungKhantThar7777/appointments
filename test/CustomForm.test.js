import React from "react";
import {
  change,
  clickAndWait,
  element,
  field,
  form,
  initializeReactContainer,
  labelFor,
  render,
  submit,
  submitButton,
} from "./reactTestExtensions";
import { CustomerForm } from "../src/CustomerForm";
import { AppointmentForm } from "../src/AppointmentForm";
import { bodyOfLastFetchRequest } from "./spyHelpers";
import {
  fetchResponseError,
  fetchResponseOk,
} from "./builders/fetch";

describe("CustomerForm", () => {
  const blankCustomer = {
    firstName: "",
  };

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
    const blankCustomer = {
      firstName: "",
      lastName: "",
      phoneNo: "",
    };
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
      const customer = { [fieldName]: existingValue };
      render(
        <CustomerForm
          original={customer}
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
      const customer = {
        firstName: "Ashley",
        lastName: "Jame",
        phoneNo: "1111",
      };
      render(
        <CustomerForm
          original={customer}
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
    itRendersAsATextBox("phoneNo");
    itIncludesTheExistingValue("phoneNo", "234234");
    itRendersALabel("phoneNo", "Phone number");
    itAssignAnIdThatMatchTheLabelId("phoneNo");
    itSubmitExistingValue("phoneNo", 1234);
    itSubmitNewValue("phoneNo", "5555");
  });

  it("sends POST request to /customers when submitting the form", async () => {
    render(
      <CustomerForm
        original={blankCustomer}
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
        original={blankCustomer}
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
        original={blankCustomer}
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

    render(<CustomerForm original={blankCustomer} />);

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
        original={blankCustomer}
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
});
