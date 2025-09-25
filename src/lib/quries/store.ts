import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Store } from "../types/store";
import { fetchStore } from "../api";

export const useStoreQuery = (
  storeId: string
): UseQueryResult<Store, Error> => {
  return useQuery({
    queryKey: ["store", storeId],
    queryFn: () => fetchStore(storeId),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
