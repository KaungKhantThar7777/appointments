export const searchParams = (obj = {}) => {
  const queries = Object.entries(obj)
    .filter(
      ([key, value]) =>
        value !== undefined &&
        value !== null &&
        value !== ""
    )
    .map(
      ([key, value]) =>
        `${key}=${encodeURIComponent(value)}`
    );

  if (queries.length > 0) {
    return "?" + queries.join("&");
  }
  return "";
};
