import { MenuResponse } from "./types";

export async function fetchMenu(): Promise<MenuResponse> {
  const res = await fetch("/data/menu.json");
  if (!res.ok) {
    throw new Error("메뉴 데이터를 불러올 수 없습니다.");
  }
  return res.json();
}
