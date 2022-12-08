import React, { useCallback } from "react";
import { RouterButton } from "./RouterButton";

export const SearchButtons = ({
  lastRowIds,
  customers,
  limit,
  searchTerm,
}) => {
  console.log("props", {
    lastRowIds,
    customers,
    limit,
    searchTerm,
  });
  const previousPageParams = useCallback(() => {
    return {
      limit,
      searchTerm,
      lastRowIds: lastRowIds.slice(0, -1),
    };
  }, [searchTerm, lastRowIds, limit]);

  const nextPageParams = useCallback(() => {
    let newLastRowIds =
      customers.length > 1
        ? [
            ...lastRowIds,
            customers[customers.length - 1].id,
          ]
        : lastRowIds;

    return {
      limit,
      searchTerm,
      lastRowIds: newLastRowIds,
    };
  }, [searchTerm, lastRowIds, limit, customers]);

  const hasPrevious = lastRowIds.length > 0;
  return (
    <menu>
      {/* {[10, 20, 30, 50].map((limitSize) => (
        <li key={limitSize}>
          <ToggleButton
            value={limitSize}
            limit={limit}
            onClick={handleLimit}
          />
        </li>
      ))} */}

      <li>
        <RouterButton
          id="previous-page"
          queryParams={previousPageParams()}
          disabled={!hasPrevious}
        >
          Previous
        </RouterButton>
      </li>
      <li>
        <RouterButton queryParams={nextPageParams()}>
          Next
        </RouterButton>
      </li>
    </menu>
  );
};
