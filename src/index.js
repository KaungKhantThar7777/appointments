import React from "react";
import ReactDOM from "react-dom/client";
import { AppointmentsDayView } from "./AppointmentsDayView";
import { CustomForm } from "./CustomForm";
import { sampleAppointments } from "./sampleData";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CustomForm
    original={{
      firstName: "Kaung",
      lastName: "Khant Thar",
    }}
    onSubmit={(customer) => {
      console.log("adding", customer);
    }}
  />
);

// <AppointmentsDayView appointments={sampleAppointments} />
