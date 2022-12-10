const defaultState = {
  customer: {},
  status: undefined,
  validationErrors: {},
  error: false,
};

export const reducer = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case "ADD_CUSTOMER_SUBMITTING":
      return { ...state, status: "SUBMITTING" };
    case "ADD_CUSTOMER_SUCCESSFUL":
      return {
        ...state,
        customer: action.payload,
        status: "SUCCESSFUL",
      };
    case "ADD_CUSTOMER_FAILED":
      return {
        ...state,
        error: true,
        status: "FAILED",
      };
    case "ADD_CUSTOMER_VALIDATION_FAILED":
      return {
        ...state,
        validationErrors: action.payload,
        status: "VALIDATION_FAILED",
      };
    default:
      return state;
  }
};
