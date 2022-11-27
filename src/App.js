import React, { useCallback, useState } from "react";
import { AppointmentFormLoader } from "./AppointmentFormLoader";

import { AppointmentsDayViewLoader } from "./AppointmentsDayViewLoader";
import { CustomerForm } from "./CustomerForm";

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
          </menu>
          <AppointmentsDayViewLoader />
        </>
      );
  }
};
