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

const spy = () => {
  let receivedArguments;
  let returnValue;
  return {
    fn: (...arg) => {
      receivedArguments = arg;
      return returnValue;
    },
    receivedArgument: (n) => receivedArguments[n],
    receivedArguments: () => receivedArguments,
    stubReturnValue: (value) => (returnValue = value),
  };
};

const fetchResponseOk = (body) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body),
  });
};

const fetchResponseError = () =>
  Promise.resolve({ ok: false });
describe("CustomerForm", () => {
  const originalFetch = global.fetch;
  let fetchSpy;

  const blankCustomer = {
    firstName: "",
  };

  const bodyOfLastFetchRequest = () =>
    JSON.parse(fetchSpy.receivedArgument(1).body);

  beforeEach(() => {
    initializeReactContainer();
    fetchSpy = spy();
    global.fetch = fetchSpy.fn;
    fetchSpy.stubReturnValue(fetchResponseOk({}));
  });
  afterEach(() => {
    global.fetch = originalFetch;
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

    expect(fetchSpy).toBeCalledWith(
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
    expect(fetchSpy).toBeCalledWith(
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
    fetchSpy.stubReturnValue(
      fetchResponseOk(customer)
    );

    const saveSpy = spy();

    render(
      <CustomerForm
        original={blankCustomer}
        onSave={saveSpy.fn}
      />
    );

    await clickAndWait(submitButton());
    expect(saveSpy).toBeCalledWith(customer);
  });

  describe("when POST request return an error", () => {
    beforeEach(() => {
      fetchSpy.stubReturnValue(fetchResponseError());
    });
    it("does not notify onSave", async () => {
      const saveSpy = spy();

      render(
        <CustomerForm
          original={blankCustomer}
          onSave={saveSpy.fn}
        />
      );

      await clickAndWait(submitButton());

      expect(saveSpy).not.toBeCalledWith();
    });

    it("renders error message", async () => {
      render(
        <CustomerForm original={blankCustomer} />
      );

      await clickAndWait(submitButton());

      expect(element("[role=alert]")).toContainText(
        "error occurred"
      );
    });
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
});
