import {
  legacy_createStore,
  combineReducers,
} from "redux";
import { reducer as customerReducer } from "./reducers/customer";

export const configureStore = (
  storeEnhancers = []
) => {
  return legacy_createStore(
    { customer: customerReducer },
    storeEnhancers
  );
};
