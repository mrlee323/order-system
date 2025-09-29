import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { fetchMenu, fetchMenuItem } from "../api";
import { MenuItem, MenuResponse } from "../types/menu";

const QUERY_KEY = {
  MENU: "menu",
  MENU_ITEM: "menuItem",
};

const MENU_STALE_TIME_10_MIN = 10 * 60 * 1000;
const MENU_GC_TIME_30_MIN = 30 * 60 * 1000;
const MENU_RETRY_BASE_DELAY_1_SEC = 1000;
const MENU_RETRY_MAX_DELAY_30_SEC = 30000;

export const useMenuQuery = (
  storeId: string,
  options?: Omit<UseQueryOptions<MenuResponse, Error>, "queryKey" | "queryFn">
): UseQueryResult<MenuResponse, Error> => {
  return useQuery({
    ...options,
    queryKey: [QUERY_KEY.MENU, storeId],
    queryFn: () => fetchMenu(storeId),
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

export const useMenuItemQuery = (
  storeId: string,
  menuId: string,
  options?: Omit<UseQueryOptions<MenuItem, Error>, "queryKey" | "queryFn">
): UseQueryResult<MenuItem, Error> => {
  return useQuery({
    ...options,
    queryKey: [QUERY_KEY.MENU_ITEM, storeId, menuId],
    queryFn: () => fetchMenuItem(storeId, menuId),
  });
};
