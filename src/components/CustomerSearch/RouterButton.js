import React from "react";
import { Link } from "react-router-dom";
import { searchParams } from "../../searchParams";

export const RouterButton = ({
  queryParams,
  children,
  toggled,
  disabled,
}) => {
  return (
    <Link
      className={
        disabled
          ? "disabled"
          : toggled
          ? "toggled"
          : ""
      }
      role="button"
      to={{
        search: searchParams(queryParams),
      }}
    >
      {children}
    </Link>
  );
};
