import React from "react";
import { Link } from "react-router-dom";
import { searchParams } from "../../searchParams";

export const ToggleRouterButton = ({
  queryParams,
  children,
  toggled,
}) => {
  return (
    <Link
      className={toggled ? "toggled" : ""}
      role="button"
      to={{
        search: searchParams(queryParams),
      }}
    >
      {children}
    </Link>
  );
};
