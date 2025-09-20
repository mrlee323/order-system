import { useQuery } from "@tanstack/react-query";
import { fetchMenu } from "../api";

const QUERY_KEY = {
  MENU: "menu",
};

export const useMenuQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.MENU],
    queryFn: fetchMenu,
  });
};
