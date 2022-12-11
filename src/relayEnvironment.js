import {
  Environment,
  Network,
  Store,
  RecordSource,
} from "relay-runtime";

let environment = null;

export const getEnvironment = () => {
  return (
    environment || (environment = buildEnvironment())
  );
};
export const verifyStatusOk = (result) => {
  if (!result.ok) {
    return Promise.reject(new Error(500));
  } else {
    return result;
  }
};

export const performFetch = (
  operation,
  variables
) => {
  return global
    .fetch("/graphql", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    })
    .then(verifyStatusOk)
    .then((res) => res.json());
};

export const buildEnvironment = () => {
  console.log("here in buildEnvironment");
  return new Environment({
    network: Network.create(performFetch),
    store: new Store(new RecordSource()),
  });
};
