export const bodyOfLastFetchRequest = () => {
  const allCalls = fetch.mock.calls;
  const lastCall = allCalls[allCalls.length - 1];

  return JSON.parse(lastCall[1].body);
};
