import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Store } from "../types/store";
import { ResponseItemBase } from "../types/common";
import { fetchStore } from "../api";

export const useStoreQuery = (): UseQueryResult<
  ResponseItemBase<Store>,
  Error
> => {
  return useQuery({
    queryKey: ["store"],
    queryFn: fetchStore,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
