import React from "react";
import { useSearchParams } from "react-router-dom";
import { AppointmentFormLoader } from "../components/AppointmentFormLoader";

export const AppointmentFormPage = (props) => {
  const [params] = useSearchParams();
  const blankAppointment = {
    service: "",
    stylist: "",
    startsAt: null,
  };
  return (
    <AppointmentFormLoader
      {...props}
      original={{
        ...blankAppointment,
        customer: params.get("customer"),
      }}
    />
  );
};
