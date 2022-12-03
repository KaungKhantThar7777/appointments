import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { searchParams } from "./searchParams";

const CustomerRow = ({
  customer,
  renderCustomerActions,
}) => {
  const { firstName, lastName, phoneNumber } =
    customer;
  return (
    <tr>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{phoneNumber}</td>
      <td>{renderCustomerActions(customer)}</td>
    </tr>
  );
};

const ToggleButton = ({ onClick, value, limit }) => (
  <button
    onClick={() => onClick(value)}
    className={value === limit ? "toggled" : ""}
  >
    {value}
  </button>
);

const SearchButtons = ({
  handleNext,
  handlePrevious,
  customerIds,
  customers,
  limit,
  handleLimit,
}) => {
  return (
    <menu>
      {[10, 20, 30, 50].map((limitSize) => (
        <li key={limitSize}>
          <ToggleButton
            value={limitSize}
            limit={limit}
            onClick={handleLimit}
          />
        </li>
      ))}

      <li>
        <button
          onClick={handlePrevious}
          disabled={customerIds.length === 0}
        >
          Previous
        </button>
      </li>
      <li>
        <button
          onClick={handleNext}
          disabled={customers.length < 10}
        >
          Next
        </button>
      </li>
    </menu>
  );
};

export const CustomerSearch = ({
  renderCustomerActions,
}) => {
  const [customers, setCustomers] = useState([]);
  const [customerIds, setCustomerIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchCustomers = async () => {
      const after =
        customerIds[customerIds.length - 1];

      let queryString = searchParams({
        searchTerm,
        after,
        limit: limit === 10 ? "" : limit,
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
  }, [customerIds, searchTerm, limit]);

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
        customerIds={customerIds}
        customers={customers}
        limit={limit}
        handleLimit={setLimit}
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
              renderCustomerActions={
                renderCustomerActions
              }
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

CustomerSearch.defaultProps = {
  renderCustomerActions: () => {},
};
