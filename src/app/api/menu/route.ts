import { NextResponse } from "next/server";
import menuData from "../../../../public/data/menu.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  // storeId가 있으면 해당 매장의 메뉴만 필터링 (현재는 모든 메뉴 반환)
  // 실제 구현에서는 storeId에 따라 다른 메뉴 데이터를 반환할 수 있음
  return NextResponse.json({
    code: 200,
    status: "success",
    items: menuData.items,
  });
}
