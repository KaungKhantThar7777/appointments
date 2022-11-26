import {
  printExpected,
  printReceived,
  matcherHint,
} from "jest-matcher-utils";
import { equals } from "@jest/expect-utils";

const toBeRenderedSpecificCall = (
  matcherName,
  mockedComponent,
  mockedCall,
  expectedProps
) => {
  const actualProps = mockedCall
    ? mockedCall[0]
    : null;
  const pass = equals(actualProps, expectedProps);

  const sourceHint = () =>
    matcherHint(
      matcherName,
      "mockedComponent",
      printExpected(expectedProps),
      {
        isNot: pass,
      }
    );

  const actualHint = () => {
    if (!mockedComponent || !mockedComponent.mock) {
      return "mockedComponent is not a mock";
    }
    if (!mockedCall) {
      return "mockedComponent was never rendered";
    }
    return `Rendered with props: ${printReceived(
      actualProps
    )}`;
  };
  const message = () =>
    [sourceHint(), actualHint()].join("\n\n");

  return {
    pass,
    message,
  };
};
export const toBeRenderedWithProps = (
  mockedComponent,
  expectedProps
) => {
  const mockedCall =
    mockedComponent.mock.calls[
      mockedComponent.mock.calls.length - 1
    ];

  return toBeRenderedSpecificCall(
    "toBeRenderedWithProps",
    mockedComponent,
    mockedCall,
    expectedProps
  );
};

export const toBeFirstRenderedWithProps = (
  mockedComponent,
  expectedProps
) => {
  const mockedCall = mockedComponent?.mock?.calls[0];
  return toBeRenderedSpecificCall(
    "toBeFirstRenderedWithProps",
    mockedComponent,
    mockedCall,
    expectedProps
  );
};
