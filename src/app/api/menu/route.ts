import { NextResponse } from "next/server";
import menuData from "../../../../public/data/menu.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");

  return NextResponse.json({
    code: 200,
    status: "success",
    items: menuData.items,
  });
}
