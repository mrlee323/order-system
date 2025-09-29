import { NextResponse } from "next/server";
import menuItemsData from "../../../../../public/data/menuItems.json";
import { MenuItem } from "@/lib/types/menu";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ menuId: string }> }
) {
  const { menuId } = await params;

  const menuList = menuItemsData.items as MenuItem[];

  const menu = menuList.find((item: MenuItem) => item.id === Number(menuId));

  if (!menu) {
    return NextResponse.json(
      {
        code: 404,
        status: "error",
        message: "메뉴를 찾을 수 없습니다.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    code: 200,
    status: "success",
    item: menu,
  });
}
