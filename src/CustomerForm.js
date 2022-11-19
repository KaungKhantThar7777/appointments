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
export const CustomerForm = ({
  original,
  onSave,
}) => {
  const [customer, setCustomer] = useState(original);
  const [hasError, setHasError] = useState(false);

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
      />

      <label htmlFor="lastName">Last name</label>
      <input
        id="lastName"
        type="text"
        name="lastName"
        value={customer.lastName || ""}
        onChange={handleChange}
      />

      <label htmlFor="phoneNo">Phone number</label>
      <input
        id="phoneNo"
        type="text"
        name="phoneNo"
        value={customer.phoneNo || ""}
        onChange={handleChange}
      />
      <input type="submit" value="Add" />
    </form>
  );
};
