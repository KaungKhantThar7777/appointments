import React from "react";
import { Link } from "react-router-dom";
import { AppointmentsDayViewLoader } from "../components/AppointmentsDayViewLoader";

export const HomePage = () => {
  return (
    <div>
      <menu>
        <li>
          <Link to="/addCustomer" role="button">
            Add customer and appointment
          </Link>
        </li>
        <li>
          <Link to="/searchCustomers" role="button">
            Search customers
          </Link>
        </li>
      </menu>
      <AppointmentsDayViewLoader />
    </div>
  );
};
