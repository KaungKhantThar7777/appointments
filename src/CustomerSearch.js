import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

const CustomerRow = ({
  customer: { firstName, lastName, phoneNumber },
}) => {
  return (
    <tr>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{phoneNumber}</td>
      <td></td>
    </tr>
  );
};

const SearchButtons = ({
  handleNext,
  handlePrevious,
}) => {
  return (
    <menu>
      <li>
        <button onClick={handlePrevious}>
          Previous
        </button>
      </li>
      <li>
        <button onClick={handleNext}>Next</button>
      </li>
    </menu>
  );
};

const searchParams = (obj = {}) => {
  const queries = Object.entries(obj)
    .filter(
      ([key, value]) =>
        value !== undefined &&
        value !== null &&
        value !== ""
    )
    .map(([key, value]) => `${key}=${value}`);

  if (queries.length > 0) {
    return "?" + queries.join("&");
  }
  return "";
};
export const CustomerSearch = () => {
  const [customers, setCustomers] = useState([]);
  const [customerIds, setCustomerIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      const after =
        customerIds[customerIds.length - 1];

      let queryString = searchParams({
        searchTerm,
        after,
      });

      const url = `/customers${queryString}`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const customers = await response.json();

      setCustomers(customers);
    };
    fetchCustomers();
  }, [customerIds, searchTerm]);

  const handleNext = useCallback(() => {
    const customerId =
      customers[customers.length - 1].id;

    setCustomerIds([...customerIds, customerId]);
  }, [customers]);

  const handlePrevious = useCallback(() => {
    setCustomerIds(customerIds.slice(0, -1));
  }, [customerIds]);

  const handleSearchTermChanged = ({
    target: { name, value },
  }) => setSearchTerm(value);

  return (
    <>
      <input
        placeholder="Enter filter text"
        value={searchTerm}
        onChange={handleSearchTermChanged}
      />
      <SearchButtons
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
      <table>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <CustomerRow
              key={customer.id}
              customer={customer}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};
