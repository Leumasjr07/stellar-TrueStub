import { MOCK_LISTINGS, TicketListing } from "@/lib/mockData/listings";

interface UseTicketListingsOptions {
  limit: number;
  offset: number;
  search?: string;
}

interface UseTicketListingsResult {
  data: {
    apartments: TicketListing[];
    apartments_aggregate: { aggregate: { count: number } };
  };
  loading: boolean;
  error: undefined;
}

/**
 * Drop-in replacement for Apollo's useQuery(GET_APARTMENTS, ...)
 * Returns the SAME shape so components don't need to change.
 */
export function useApartments({
  limit,
  offset,
  search = "",
}: UseTicketListingsOptions): UseTicketListingsResult {
  const query = search.trim().toLowerCase();

  const filtered = query
    ? MOCK_LISTINGS.filter(
        (apartment) =>
          apartment.name.toLowerCase().includes(query) ||
          apartment.location.toLowerCase().includes(query),
      )
    : MOCK_LISTINGS;

  const paged = filtered.slice(offset, offset + limit);

  return {
    data: {
      apartments: paged,
      apartments_aggregate: {
        aggregate: { count: filtered.length },
      },
    },
    loading: false,
    error: undefined,
  };
}