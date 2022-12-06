import React, { useState } from "react";

const appointmentTimeOfDay = (startsAt) => {
  const [h, m] = new Date(startsAt).toTimeString().split(":");

  return `${h}:${m}`;
};
export const Appointment = ({
  startsAt,
  customer: { firstName, lastName, phoneNumber },
  stylist,
  service,
  notes,
}) => {
  return (
    <div id="appointmentView">
      <h3>Today appointment's at {appointmentTimeOfDay(startsAt)}</h3>
      <table>
        <tbody>
          <tr>
            <td>Customer</td>
            <td>
              {firstName} {lastName}
            </td>
          </tr>
          <tr>
            <td>Phone Number</td>
            <td>{phoneNumber}</td>
          </tr>
          <tr>
            <td>Stylist</td>
            <td>{stylist}</td>
          </tr>
          <tr>
            <td>Service</td>
            <td>{service}</td>
          </tr>
          <tr>
            <td>Notes</td>
            <td>{notes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const AppointmentsDayView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(0);

  return (
    <div id="appointmentsDayView">
      <ol>
        {appointments.map((appointment, i) => (
          <li key={appointment.startsAt}>
            <button
              type="button"
              onClick={() => setSelectedAppointment(i)}
              className={i === selectedAppointment ? "toggled" : ""}
            >
              {appointmentTimeOfDay(appointment.startsAt)}
            </button>
          </li>
        ))}
      </ol>
      {appointments.length === 0 ? (
        <p>There are no appointments scheduled for today.</p>
      ) : (
        <Appointment {...appointments[selectedAppointment]} />
      )}
    </div>
  );
};
