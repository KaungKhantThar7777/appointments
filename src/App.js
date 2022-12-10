import React, { useCallback, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { CustomerForm } from "./components/CustomerForm";
import { AppointmentFormPage } from "./pages/AppointmentFormPage";
import { HomePage } from "./pages/HomePage";
import { SearchCustomersPage } from "./pages/SearchCustomersPage";

export const App = () => {
  const navigate = useNavigate();

  const transitionToAddAppointment = useCallback(
    (customer) => {
      navigate(
        `/addAppointment?customer=${customer.id}`
      );
    },
    []
  );

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
      <Link
        to={`/addAppointment?customer=${customer?.id}`}
      >
        Create Appointment
      </Link>
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
    </Routes>
  );
};
