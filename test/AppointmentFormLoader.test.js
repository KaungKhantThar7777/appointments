import React from "react";
import {
  initializeReactContainer,
  renderAndWait,
} from "./reactTestExtensions";
import { fetchResponseOk } from "./builders/fetch";
import { AppointmentFormLoader } from "../src/components/AppointmentFormLoader";
import { AppointmentForm } from "../src/components/AppointmentForm";
import { todayAt } from "./builders/time";

jest.mock(
  "../src/components/AppointmentForm",
  () => ({
    AppointmentForm: jest.fn(() => (
      <div id="AppointmentForm"></div>
    )),
  })
);

describe("AppointmentFormLoader", () => {
  beforeEach(() => {
    initializeReactContainer();

    jest
      .spyOn(global, "fetch")
      .mockResolvedValue(
        fetchResponseOk(availableTimeSlots)
      );
  });
  const availableTimeSlots = [
    {
      startsAt: todayAt(9),
    },
  ];

  it("fetch data when component mounted", async () => {
    await renderAndWait(<AppointmentFormLoader />);

    expect(global.fetch).toBeCalledWith(
      "/availableTimeSlots",
      expect.objectContaining({
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });

  it("render AppointmentForm ", async () => {
    await renderAndWait(<AppointmentFormLoader />);

    expect(AppointmentForm).toBeRendered();
  });
  it("render AppointmentForm with initial empty availableTimeSlots", async () => {
    await renderAndWait(<AppointmentFormLoader />);
    expect(
      AppointmentForm
    ).toBeFirstRenderedWithProps({
      availableTimeSlots: [],
    });
  });

  it("render AppointmentForm with availableTimeSlots from server api", async () => {
    await renderAndWait(<AppointmentFormLoader />);

    expect(AppointmentForm).toBeRenderedWithProps({
      availableTimeSlots,
    });
  });

  it("pass props through to the children", async () => {
    await renderAndWait(
      <AppointmentFormLoader testProps={123} />
    );

    expect(AppointmentForm).toBeRenderedWithProps(
      expect.objectContaining({
        testProps: 123,
      })
    );
  });
});
