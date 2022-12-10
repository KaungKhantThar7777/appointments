import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { searchParams } from "../../searchParams";
import { RouterButton } from "./RouterButton";
import { SearchButtons } from "./SearchButtons";

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

export const CustomerSearch = ({
  renderCustomerActions,
  lastRowIds,
  searchTerm,
  limit,
  navigate,
}) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const after =
        lastRowIds?.[lastRowIds?.length - 1];

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
  }, [lastRowIds, searchTerm, limit]);

  const handleSearchTermChanged = ({
    target: { name, value },
  }) => {
    const params = { limit, searchTerm: value };
    navigate(searchParams(params));
  };

  return (
    <>
      <input
        placeholder="Enter filter text"
        value={searchTerm}
        onChange={handleSearchTermChanged}
      />
      <SearchButtons
        lastRowIds={lastRowIds}
        customers={customers}
        limit={limit}
        searchTerm={searchTerm}
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
