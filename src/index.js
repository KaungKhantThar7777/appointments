import React from "react";
import ReactDOM from "react-dom/client";
import { AppointmentFormLoader } from "./AppointmentFormLoader";

ReactDOM.createRoot(
  document.getElementById("root")
).render(<AppointmentFormLoader />);

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
