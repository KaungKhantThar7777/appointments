import {
  required,
  match,
  anyErrors,
  hasFieldError,
  list,
  validateMany,
} from "../src/formValidation";

describe("formValidation", () => {
  test("required", () => {
    const validate = required(
      "First name is required"
    );

    expect(validate("")).toBe(
      "First name is required"
    );
    expect(validate("  ")).toBe(
      "First name is required"
    );
    expect(validate("John")).toBe(undefined);
  });

  test("match", () => {
    const validate = match(
      /^[0-9+() \-]+$/,
      "Only numbers, spaces and these symbols are allowed: ( ) + -"
    );

    expect(validate("")).toBe(
      "Only numbers, spaces and these symbols are allowed: ( ) + -"
    );

    expect(validate("123")).toBe(undefined);
    expect(validate("123-456-7890")).toBe(undefined);
    expect(validate("123-456-7890 ext 123")).toBe(
      "Only numbers, spaces and these symbols are allowed: ( ) + -"
    );
  });

  test("anyErrors", () => {
    expect(anyErrors({})).toBe(false);
    expect(anyErrors({ firstName: undefined })).toBe(
      false
    );
    expect(
      anyErrors({
        firstName: "First name is required",
      })
    ).toBe(true);
  });

  test("hasFieldError", () => {
    expect(hasFieldError({}, "firstName")).toBe(
      false
    );
    expect(
      hasFieldError(
        { firstName: undefined },
        "firstName"
      )
    ).toBe(false);
    expect(
      hasFieldError(
        { firstName: "First name is required" },
        "firstName"
      )
    ).toBe(true);
  });

  test("list", () => {
    const validate = list(
      required("Phone number is required"),
      match(
        /^[0-9+() \-]+$/,
        "Only numbers, spaces and these symbols are allowed: ( ) + -"
      )
    );

    expect(validate("")).toBe(
      "Phone number is required"
    );
    expect(validate("1234 5678")).toBe(undefined);
    expect(validate("1234 5678 **")).toBe(
      "Only numbers, spaces and these symbols are allowed: ( ) + -"
    );

    expect(validate("123")).toBe(undefined);
    expect(validate("123-456-7890")).toBe(undefined);
  });

  describe("validateMany", () => {
    const validators = {
      firstName: required("First name is required"),
      lastName: required("Last name is required"),
      phoneNumber: list(
        required("Phone number is required"),
        match(
          /^[0-9+() \-]+$/,
          "Only numbers, spaces and these symbols are allowed: ( ) + -"
        )
      ),
    };
    it("checks required fields", () => {
      const fields = {
        firstName: "",
        lastName: "",
        phoneNumber: "",
      };

      expect(
        validateMany(validators, fields)
      ).toEqual({
        firstName: "First name is required",
        lastName: "Last name is required",
        phoneNumber: "Phone number is required",
      });
    });

    it("checks mobile phone wrong pattern", () => {
      const fields = {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234 5678AA",
      };

      expect(
        validateMany(validators, fields)
      ).toEqual({
        phoneNumber:
          "Only numbers, spaces and these symbols are allowed: ( ) + -",
      });
    });

    it("passes validation", () => {
      const fields = {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234 5678",
      };

      expect(
        validateMany(validators, fields)
      ).toEqual({});
    });
  });
});
