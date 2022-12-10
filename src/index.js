import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { configureStore } from "./store";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <Provider store={configureStore()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
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
