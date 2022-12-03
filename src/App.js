import React, { useCallback, useState } from "react";
import { AppointmentFormLoader } from "./AppointmentFormLoader";

import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";
import { CustomerForm } from "./CustomerForm";
import { CustomerSearch } from "./CustomerSearch";

export const App = () => {
  const [view, setView] = useState("dayView");
  const [customer, setCustomer] = useState();

  const transitionToAddCustomer = useCallback(() => {
    setView("addCustomer");
  }, []);

  const transitionToAddAppointment = useCallback(
    (customer) => {
      setCustomer(customer);
      setView("addAppointment");
    },
    []
  );

  const transitionToAppointmentsDayView =
    useCallback(() => {
      setView("dayView");
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

  const searchActions = (customer) => (
    <button
      onClick={() =>
        transitionToAddAppointment(customer)
      }
    >
      Create Appointment
    </button>
  );
  switch (view) {
    case "addCustomer":
      return (
        <CustomerForm
          original={blankCustomer}
          onSave={transitionToAddAppointment}
        />
      );
    case "addAppointment":
      return (
        <AppointmentFormLoader
          original={{
            ...blankAppointment,
            customer: customer.id,
          }}
          onSave={transitionToAppointmentsDayView}
        />
      );
    case "searchCustomers":
      return (
        <CustomerSearch
          renderCustomerActions={searchActions}
        />
      );
    default:
      return (
        <>
          <menu>
            <li>
              <button
                type="button"
                onClick={transitionToAddCustomer}
              >
                Add customer and appointment
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={transitionTod}
              >
                Search customers
              </button>
            </li>
          </menu>
          <AppointmentsDayViewLoader />
        </>
      );
  }
};
