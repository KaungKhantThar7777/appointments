import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
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
