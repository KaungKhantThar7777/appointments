import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

import { App } from "./App";
import { configureStore } from "./store";
import { appHistory } from "./history";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <Provider store={configureStore()}>
    <HistoryRouter history={appHistory}>
      <App />
    </HistoryRouter>
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
