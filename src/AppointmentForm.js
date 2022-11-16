import React from "react";

const timeIncrements = (totalSlots, startTime, increment) => {
  return Array(totalSlots)
    .fill([startTime])
    .reduce((acc, _, i) => acc.concat([startTime + i * increment]));
};
const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;

  return timeIncrements(totalSlots, startTime, increment);
};

const weeklyDateValues = (startDate) => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;

  return timeIncrements(7, midnight, increment);
};
const toShortDate = (timeStamp) => {
  const [day, _, dayOfMonth] = new Date(timeStamp).toDateString().split(" ");
  return `${day} ${dayOfMonth}`;
};

const toTimeValue = (timestamp) => {
  const time = new Date(timestamp).toTimeString().substring(0, 5);
  return time;
};

const mergeDateAndTimeSlot = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};

const RadioButtonIfAvailable = ({
  availableTimeSlots,
  date,
  timeSlot,
  checkedTimeSlot,
  handleChange,
}) => {
  const startsAt = mergeDateAndTimeSlot(date, timeSlot);
  const isChecked = checkedTimeSlot === startsAt;

  if (
    availableTimeSlots.some(
      (availableTimeSlot) => availableTimeSlot.startsAt === startsAt
    )
  ) {
    return (
      <input
        type="radio"
        name="startsAt"
        value={startsAt}
        checked={isChecked}
        onChange={handleChange}
      />
    );
  }

  return null;
};
const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  checkedTimeSlot,
  handleChange,
}) => {
  const dates = weeklyDateValues(today);
  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map((d) => (
            <th key={d}>{toShortDate(d)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dailyTimeSlots(salonOpensAt, salonClosesAt).map((timeSlot) => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>

            {dates.map((date) => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  date={date}
                  timeSlot={timeSlot}
                  checkedTimeSlot={checkedTimeSlot}
                  handleChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AppointmentForm = ({
  selectableServices,
  selectableStylists,
  serviceStylists,
  original,
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  onSubmit,
}) => {
  const [appointment, setAppointment] = React.useState(original);

  const handleStartsAtChange = React.useCallback(({ target: { value } }) => {
    setAppointment((appointment) => ({
      ...appointment,
      startsAt: parseInt(value),
    }));
  }, []);

  const handleSelectBoxChange = ({ target: { name, value } }) => {
    setAppointment((appointment) => ({
      ...appointment,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(appointment);
  };

  const stylistsForService = appointment?.service
    ? serviceStylists[appointment.service]
    : selectableStylists;

  const timeSlotsForStylist = appointment?.stylist
    ? availableTimeSlots.filter((timeSlot) => {
        return timeSlot.stylists.includes(appointment.stylist);
      })
    : availableTimeSlots;
  return (
    <form id="appointment" onSubmit={handleSubmit}>
      <label htmlFor="service">Salon service</label>
      <select
        id="service"
        name="service"
        value={appointment?.service || ""}
        onChange={handleSelectBoxChange}
      >
        <option />
        {selectableServices.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <label htmlFor="stylist">Stylist</label>
      <select id="stylist" name="stylist" onChange={handleSelectBoxChange}>
        <option />
        {stylistsForService.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <TimeSlotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeSlots={timeSlotsForStylist}
        checkedTimeSlot={appointment?.startsAt}
        handleChange={handleStartsAtChange}
      />

      <input type="submit" value="Add" />
    </form>
  );
};

AppointmentForm.defaultProps = {
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
  selectableServices: [
    "Cut",
    "Blow-dry",
    "Cut & color",
    "Beard trim",
    "Cut & beard trim",
    "Extensions",
  ],
  selectableStylists: ["Sam", "Joe", "Jane", "Philis", "Aglena"],
  serviceStylists: {
    Cut: ["Ashley", "Jo", "Pat", "Sam"],
    "Blow-dry": ["Ashley", "Jo", "Pat", "Sam"],
    "Cut & color": ["Ashley", "Jo"],
    "Beard trim": ["Pat", "Sam"],
    "Cut & beard trim": ["Pat", "Sam"],
    Extensions: ["Ashley", "Pat"],
  },
};
