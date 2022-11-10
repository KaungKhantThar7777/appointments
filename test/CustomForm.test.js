import React from "react";
import {
  change,
  click,
  element,
  field,
  form,
  initializeReactContainer,
  render,
  submit,
  submitButton,
} from "./reactTestExtensions";
import { CustomForm } from "../src/CustomForm";

describe("CustomForm", () => {
  const blankCustomer = {
    firstName: "",
  };
  beforeEach(() => {
    initializeReactContainer();
  });

  it("renders a form", () => {
    render(<CustomForm original={blankCustomer} />);

    expect(form()).not.toBeNull();
  });

  const itRendersAsATextBox = (fieldName) => {
    const blankCustomer = {
      firstName: "",
      lastName: "",
      phoneNo: "",
    };
    it("renders as a text box", () => {
      render(<CustomForm original={blankCustomer} />);

      expect(field(fieldName)).not.toBeNull();

      expect(field(fieldName).tagName).toEqual("INPUT");

      expect(field(fieldName).type).toEqual("text");
    });
  };

  const itRendersAsATelBox = (fieldName) => {
    const blankCustomer = {
      firstName: "",
      lastName: "",
      phoneNo: "",
    };
    it("renders as a text box", () => {
      render(<CustomForm original={blankCustomer} />);

      expect(field(fieldName)).not.toBeNull();

      expect(field(fieldName).tagName).toEqual("INPUT");

      expect(field(fieldName).type).toEqual("tel");
    });
  };

  const itIncludesTheExistingValue = (fieldName, existingValue) => {
    it("includes the existing value", () => {
      const customer = { [fieldName]: existingValue };

      render(<CustomForm original={customer} />);

      expect(field(fieldName).value).toEqual(existingValue);
    });
  };

  const itRendersALabel = (fieldName, text) => {
    it("renders a label ", () => {
      render(<CustomForm original={blankCustomer} />);
      const label = element(`label[for="${fieldName}"]`);
      expect(label).not.toBeNull();
    });

    it(`render '${text}' as the label content`, () => {
      render(<CustomForm original={blankCustomer} />);

      const label = element(`label[for="${fieldName}"]`);
      expect(label).toContainText(text);
    });
  };

  const itAssignAnIdThatMatchTheLabelId = (fieldName) => {
    it("assigns an id that matches the label id", () => {
      render(<CustomForm original={blankCustomer} />);

      expect(field(fieldName).id).toEqual(fieldName);
    });
  };

  const itSubmitExistingValue = (fieldName, existingValue) => {
    it("submit existing value when submitted", () => {
      expect.hasAssertions();

      const customer = { [fieldName]: existingValue };
      render(
        <CustomForm
          original={customer}
          onSubmit={({ firstName }) => {
            expect(firstName).toBe(existingValue);
          }}
        />
      );

      submit(form());
    });
  };
  const itSubmitNewValue = (fieldName, existingValue) => {
    it("submit new value", () => {
      // expect.hasAssertions();

      const customer = {
        firstName: "Ashley",
        lastName: "Jame",
        phoneNo: "1111",
      };
      render(
        <CustomForm
          original={customer}
          onSubmit={(customer) => {
            expect(customer[fieldName]).toBe(existingValue);
          }}
        />
      );
      change(field(fieldName), existingValue);
      click(submitButton());
    });
  };
  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itIncludesTheExistingValue("firstName", "Kaung");
    itRendersALabel("firstName", "First name");
    itAssignAnIdThatMatchTheLabelId("firstName");
    itSubmitExistingValue("firstName");
    itSubmitNewValue("firstName", "Kaung");
  });

  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itIncludesTheExistingValue("lastName", "Khant Thar");
    itRendersALabel("lastName", "Last name");
    itAssignAnIdThatMatchTheLabelId("lastName");
    itSubmitExistingValue("lastName");
    itSubmitNewValue("lastName", "Khant Thar");
  });

  describe("phone number field", () => {
    itRendersAsATelBox("phoneNo");
    itIncludesTheExistingValue("phoneNo", "234234");
    itRendersALabel("phoneNo", "Phone number");
    itAssignAnIdThatMatchTheLabelId("phoneNo");
    itSubmitExistingValue("phoneNo");
    itSubmitNewValue("phoneNo", "5555");
  });
});
