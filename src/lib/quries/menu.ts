import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { fetchMenu } from "../api";
import { MenuResponse } from "../types/menu";
import { ResponseListBase } from "../types/common";

const QUERY_KEY = {
  MENU: "menu",
};

const MENU_STALE_TIME_10_MIN = 10 * 60 * 1000;
const MENU_GC_TIME_30_MIN = 30 * 60 * 1000;
const MENU_RETRY_BASE_DELAY_1_SEC = 1000;
const MENU_RETRY_MAX_DELAY_30_SEC = 30000;

export const useMenuQuery = (
  storeId: string,
  options?: Omit<
    UseQueryOptions<ResponseListBase<MenuResponse>, Error>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<ResponseListBase<MenuResponse>, Error> => {
  return useQuery({
    ...options,
    queryKey: [QUERY_KEY.MENU, storeId],
    queryFn: fetchMenu,
    enabled: !!storeId,
    staleTime: MENU_STALE_TIME_10_MIN,
    gcTime: MENU_GC_TIME_30_MIN,
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(
        MENU_RETRY_BASE_DELAY_1_SEC * 2 ** attemptIndex,
        MENU_RETRY_MAX_DELAY_30_SEC
      ),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
