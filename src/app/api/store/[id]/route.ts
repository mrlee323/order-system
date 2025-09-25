import { NextResponse } from "next/server";
import storeData from "../../../../../public/data/store.json";
import { Store } from "@/lib/types/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const store = storeData.items.find((item: Store) => item.id === id);

  if (!store) {
    return NextResponse.json(
      { code: 404, status: "error", message: "Store not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    code: 200,
    status: "success",
    item: store,
  });
}
