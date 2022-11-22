import {
  printExpected,
  printReceived,
  matcherHint,
} from "jest-matcher-utils";
import { equals } from "@jest/expect-utils";

export const toBeRenderWithProps = (
  mockedComponent,
  expectProps
) => {
  const mockedCall =
    mockedComponent.mock.calls[
      mockedComponent.mock.calls.length - 1
    ];

  const actualProps = mockedCall
    ? mockedCall[0]
    : null;
  const pass = equals(actualProps, expectProps);

  const sourceHint = () =>
    matcherHint(
      "toBeRenderWithProps",
      "element",
      printExpected(expectProps),
      {
        isNot: pass,
      }
    );

  const actualHint = () =>
    `Actual props: ${printReceived(actualProps)}`;
  const message = () =>
    [sourceHint(), actualHint()].join("\n\n");

  return {
    pass,
    message,
  };
};
