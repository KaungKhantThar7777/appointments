import React from "react";
import ReactDOM from "react-dom/client";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomForm } from "./CustomForm";
import { sampleAppointments } from "./sampleData";

const today = new Date();
const availableTimeSlots = [
  { startsAt: today.setHours(9, 0, 0, 0) },
  { startsAt: today.setHours(9, 30, 0, 0) },
];

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppointmentForm availableTimeSlots={availableTimeSlots} />
);

/* 
<CustomForm
    original={{
      firstName: "Kaung",
      lastName: "Khant Thar",
    }}
    onSubmit={(customer) => {
      console.log("adding", customer);
    }}
  />
  */

// <AppointmentsDayView appointments={sampleAppointments} />
