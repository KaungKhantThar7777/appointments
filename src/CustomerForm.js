import React, { useState } from "react";

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

const required = (description) => (value) =>
  !value || value.trim() === ""
    ? description
    : undefined;

const match = (re, description) => (value) =>
  value.match(re) ? undefined : description;

const list =
  (...validators) =>
  (value) =>
    validators.reduce(
      (result, validator) =>
        result || validator(value),
      undefined
    );

export const CustomerForm = ({
  original,
  onSave,
}) => {
  const [customer, setCustomer] = useState(original);
  const [hasError, setHasError] = useState(false);
  const [validationErrors, setValidationErrors] =
    useState({});

  const handleBlur = ({ target }) => {
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
    const result = validators[target.name](
      target.value
    );
    setValidationErrors({
      ...validationErrors,
      [target.name]: result,
    });
  };

  const hasFieldError = (fieldName) =>
    validationErrors[fieldName] !== undefined;

  const handleChange = ({
    target: { name, value },
  }) => {
    setCustomer((customer) => ({
      ...customer,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await global.fetch(
        "/customers",
        {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        }
      );

      if (result.ok) {
        const customerWithId = await result.json();
        onSave(customerWithId);
        setHasError(false);
      } else {
        setHasError(true);
      }
    } catch (error) {
      setHasError(true);
    }
  };

  const renderError = (fieldName) => (
    <span id={`${fieldName}Error`} role="alert">
      {hasFieldError(fieldName)
        ? validationErrors[fieldName]
        : ""}
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

      <input type="submit" value="Add" />
    </form>
  );
};
