import { NextResponse } from "next/server";
import storeData from "../../../../public/data/store.json";

export async function GET() {
  return NextResponse.json({
    code: 200,
    status: "success",
    items: storeData,
  });
}
