import React, { useCallback } from "react";
import { RouterButton } from "./RouterButton";
import { ToggleRouterButton } from "./ToggleRouterButton";

export const SearchButtons = ({
  lastRowIds = [],
  customers,
  limit = 10,
  searchTerm,
}) => {
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

  const limitPageParams = useCallback(
    (newLimit) => {
      return {
        limit: newLimit,
        searchTerm,
        lastRowIds,
      };
    },
    [searchTerm, lastRowIds]
  );

  const hasPrevious = lastRowIds.length > 0;
  const hasNext = customers.length === limit;

  return (
    <menu>
      {[10, 20, 30, 50].map((limitSize) => (
        <li key={limitSize}>
          <ToggleRouterButton
            toggled={limitSize === limit}
            id={`limit-${limitSize}`}
            queryParams={limitPageParams(limitSize)}
          >
            {limitSize}
          </ToggleRouterButton>
        </li>
      ))}

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
        <RouterButton
          id="next-page"
          queryParams={nextPageParams()}
          disabled={!hasNext}
        >
          Next
        </RouterButton>
      </li>
    </menu>
  );
};
