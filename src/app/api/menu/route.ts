import { NextResponse } from "next/server";
import menuData from "../../../../public/data/menu.json";

export async function GET() {
  return NextResponse.json({
    code: 200,
    status: "success",
    items: menuData.items,
  });
}
