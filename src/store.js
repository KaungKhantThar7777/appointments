import {
  legacy_createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from "redux";
import createSagaMiddleware from "redux-saga";
import { takeLatest } from "redux-saga/effects";
import { reducer as customerReducer } from "./reducers/customer";
import { addCustomer } from "./sagas/customer";

function* rootSaga() {
  yield takeLatest(
    "ADD_CUSTOMER_REQUEST",
    addCustomer
  );
}

export const configureStore = (
  storeEnhancers = []
) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = legacy_createStore(
    combineReducers({ customer: customerReducer }),
    compose(
      applyMiddleware(sagaMiddleware),
      ...storeEnhancers
    )
  );

  sagaMiddleware.run(rootSaga);
  return store;
};
