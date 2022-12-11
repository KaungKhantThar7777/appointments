import React, { useCallback, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { CustomerForm } from "./components/CustomerForm";
import { AppointmentFormPage } from "./pages/AppointmentFormPage";
import { CustomerHistoryPage } from "./pages/CustomerHistoryPage";
import { HomePage } from "./pages/HomePage";
import { SearchCustomersPage } from "./pages/SearchCustomersPage";

export const App = () => {
  const navigate = useNavigate();

  const transitionToAppointmentsDayView =
    useCallback(() => {
      navigate("/");
    }, []);

  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  const searchActions = (customer) => {
    return (
      <>
        <Link
          to={`/addAppointment?customer=${customer?.id}`}
        >
          Create Appointment
        </Link>

        <Link
          to={`/viewHistory?customer=${customer.id}`}
        >
          View history
        </Link>
      </>
    );
  };
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/addCustomer"
        element={
          <CustomerForm original={blankCustomer} />
        }
      />
      <Route
        path="/addAppointment"
        element={
          <AppointmentFormPage
            onSave={transitionToAppointmentsDayView}
          />
        }
      />
      <Route
        path="/searchCustomers"
        element={
          <SearchCustomersPage
            renderCustomerActions={searchActions}
          />
        }
      />
      <Route
        path="/viewHistory"
        element={<CustomerHistoryPage />}
      />
    </Routes>
  );
};
