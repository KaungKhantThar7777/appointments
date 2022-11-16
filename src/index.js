import React from "react";
import ReactDOM from "react-dom/client";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomForm } from "./CustomForm";
import { sampleAppointments, sampleAvailableTimeSlots } from "./sampleData";

const today = new Date();

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppointmentForm availableTimeSlots={sampleAvailableTimeSlots} />
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
