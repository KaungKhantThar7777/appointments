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
export const CustomerSearch = () => {
  const [customers, setCustomers] = useState([]);
  const [queryStrings, setQueryStrings] = useState(
    []
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      const queryString =
        queryStrings[queryStrings.length - 1] || "";

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
  }, [queryStrings]);

  const handleNext = useCallback(() => {
    const after = customers[customers.length - 1].id;

    const queryString = `?after=${after}`;
    setQueryStrings([...queryStrings, queryString]);
  }, [customers]);

  const handlePrevious = useCallback(() => {
    setQueryStrings(queryStrings.slice(0, -1));
  }, [queryStrings]);
  return (
    <>
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
