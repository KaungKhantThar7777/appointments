import React, { useState } from "react";
import {
  anyErrors,
  hasFieldError,
  list,
  match,
  required,
  validateMany,
} from "./formValidation";

const Error = ({ hasError }) => {
  return (
    <p role="alert">
      {" "}
      {hasError
        ? "An error occurred during save."
        : ""}
    </p>
  );
};

export const CustomerForm = ({
  original,
  onSave,
}) => {
  const [customer, setCustomer] = useState(original);
  const [hasError, setHasError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] =
    useState({});

  const validators = {
    firstName: required("First name is required"),
    lastName: required("Last name is required"),
    phoneNumber: list(
      required("Phone number is required"),
      match(
        /^[0-9+() \-]*$/,
        "Only numbers, spaces and these symbols are allowed: ( ) + -"
      )
    ),
  };

  const validate = (name, value) => {
    const result = validators[name](value);

    setValidationErrors({
      ...validationErrors,
      [name]: result,
    });
  };
  const handleBlur = ({
    target: { name, value },
  }) => {
    validate(name, value);
  };

  const handleChange = ({
    target: { name, value },
  }) => {
    setCustomer((customer) => ({
      ...customer,
      [name]: value,
    }));

    validate(name, value);
  };

  const doSubmit = async () => {
    const result = await global.fetch("/customers", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    });

    if (result.ok) {
      const customerWithId = await result.json();
      setHasError(false);
      onSave(customerWithId);
    } else if (result.status === 422) {
      const response = await result.json();

      setValidationErrors(response.errors);
    } else {
      setHasError(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationResult = validateMany(
      validators,
      customer
    );

    if (!anyErrors(validationResult)) {
      setSubmitting(true);
      try {
        await doSubmit();
      } catch (error) {
        setHasError(true);
      }
      setSubmitting(false);
    } else {
      setValidationErrors(validationResult);
    }
    setSubmitting(false);
  };

  const renderError = (fieldName) => (
    <span id={`${fieldName}Error`} role="alert">
      {hasFieldError(validationErrors, fieldName)
        ? validationErrors[fieldName]
        : " "}
    </span>
  );
  return (
    <form onSubmit={handleSubmit}>
      <Error hasError={hasError} />
      <label htmlFor="firstName">First name</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={customer.firstName || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-describedby="firstNameError"
      />
      {renderError("firstName")}

      <label htmlFor="lastName">Last name</label>
      <input
        id="lastName"
        type="text"
        name="lastName"
        value={customer.lastName || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-describedby="lastNameError"
      />
      {renderError("lastName")}

      <label htmlFor="phoneNumber">
        Phone number
      </label>
      <input
        id="phoneNumber"
        type="text"
        name="phoneNumber"
        value={customer.phoneNumber || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-describedby="phoneNumberError"
      />
      {renderError("phoneNumber")}

      <input
        type="submit"
        value="Add"
        disabled={submitting}
      />
      {submitting && (
        <span className="submittingIndicator"></span>
      )}
    </form>
  );
};
