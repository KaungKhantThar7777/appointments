import React, { useEffect, useState } from "react";
import { AppointmentsDayView } from "./AppointmentsDayView";

export const AppointmentsDayViewLoader = ({
  today,
}) => {
  const [appointments, setAppointments] = useState(
    []
  );
  useEffect(() => {
    const fetchAppointments = async () => {
      const from = today.setHours(0, 0, 0, 0);
      const to = today.setHours(23, 59, 59, 999);
      const res = await fetch(
        `/appointments/${from}-${to}`,
        {
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );
      const data = await res.json();
      setAppointments(data);
    };
    fetchAppointments();
  }, [today]);
  return (
    <AppointmentsDayView
      appointments={appointments}
    />
  );
};

AppointmentsDayViewLoader.defaultProps = {
  today: new Date(),
};
