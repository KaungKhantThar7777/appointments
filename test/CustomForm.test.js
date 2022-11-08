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

  it("renders the first name field as a text box", () => {
    render(<CustomForm original={blankCustomer} />);

    expect(field("firstName")).not.toBeNull();

    expect(field("firstName").tagName).toEqual("INPUT");

    expect(field("firstName").type).toEqual("text");
  });

  it("includes the existing value for the first name", () => {
    const customer = { firstName: "Ashley" };

    render(<CustomForm original={customer} />);

    expect(field("firstName").value).toEqual("Ashley");
  });

  it("renders a label for the first name field", () => {
    render(<CustomForm original={blankCustomer} />);

    const label = element('label[for="firstName"]');
    expect(label).not.toBeNull();
  });

  it("renders 'First name' as the first name label content", () => {
    render(<CustomForm original={blankCustomer} />);

    const label = element('label[for="firstName"]');

    expect(label.textContent).toEqual("First name");
  });

  it("assigns an id that matches the label id to the first name field", () => {
    render(<CustomForm original={blankCustomer} />);

    expect(field("firstName").id).toEqual("firstName");
  });

  it("renders a submit button", () => {
    render(<CustomForm original={blankCustomer} />);

    expect(submitButton()).not.toBeNull();
  });

  it("saves existing first name when submitted", () => {
    expect.hasAssertions();

    const customer = { firstName: "Ashley" };
    render(<CustomForm original={customer} onSubmit={() => {}} />);

    const event = submit(form());

    expect(event.defaultPrevented).toBe(true);
  });

  it("saves new first name when submitted", () => {
    expect.hasAssertions();

    const customer = { firstName: "Ashley" };
    render(
      <CustomForm
        original={customer}
        onSubmit={({ firstName }) => {
          expect(firstName).toBe("Jasmine");
        }}
      />
    );
    change(field("firstName"), "Jasmine");
    click(submitButton());
  });
});
