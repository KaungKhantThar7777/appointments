export const fetchResponseOk = (body) => {
  return {
    ok: true,
    json: () => Promise.resolve(body),
  };
};

export const fetchResponseError = () => ({
  ok: false,
});
