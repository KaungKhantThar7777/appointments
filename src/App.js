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
  const [view, setView] = useState("dayView");
  const [customer, setCustomer] = useState();

  const navigate = useNavigate();

  const transitionToAddCustomer = useCallback(() => {
    setView("addCustomer");
  }, []);

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

  const transitionTod = useCallback(() => {
    setView("searchCustomers");
  }, []);
  const blankCustomer = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  };

  const blankAppointment = {
    service: "",
    stylist: "",
    startsAt: null,
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
          <CustomerForm
            original={blankCustomer}
            onSave={transitionToAddAppointment}
          />
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
