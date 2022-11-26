export const toBeRendered = (mockedComponent) => {
  const pass =
    !!mockedComponent &&
    !!mockedComponent.mock &&
    mockedComponent.mock.calls.length > 0;

  const passMessage = () =>
    `expect(mockedComponent).not.toBeRendered()`;
  const failMessage = () =>
    `expect(mockedComponent).toBeRendered()`;
  return {
    pass,
    message: pass ? passMessage : failMessage,
  };
};
