import { call, put } from "redux-saga/effects";
import { appHistory } from "../history";

const fetch = (url, data) => {
  return global.fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
export function* addCustomer({ payload }) {
  yield put({ type: "ADD_CUSTOMER_SUBMITTING" });
  const result = yield call(
    fetch,
    "/customers",
    payload
  );

  if (result.ok) {
    const customerWithId = yield call([
      result,
      "json",
    ]);

    yield put({
      type: "ADD_CUSTOMER_SUCCESSFUL",
      payload: customerWithId,
      error: false,
    });

    appHistory.push(
      `/addAppointment?customer=${customerWithId.id}`
    );
  } else if (result.status === 422) {
    const response = yield call([result, "json"]);
    yield put({
      type: "ADD_CUSTOMER_VALIDATION_FAILED",
      payload: response.errors,
    });
  } else {
    yield put({
      type: "ADD_CUSTOMER_FAILED",
    });
  }
}
