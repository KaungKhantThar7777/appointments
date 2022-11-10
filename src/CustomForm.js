import React, { useState } from "react";

export const CustomForm = ({ original, onSubmit }) => {
  const [customer, setCustomer] = useState(original);

  const handleChange = ({ target: { name, value } }) => {
    setCustomer((customer) => ({
      ...customer,
      [name]: value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(customer);
  };
  return (
    <form onSubmit={handleSubmit}>
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
