import { AccessMode } from "@/lib/types/menu";
import MenuPage from "@/components/menu/MenuPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  return {
    title: `메뉴 - 매장 ${storeId}`,
    description: "매장 메뉴 보기",
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ storeId: string }>;
  searchParams: Promise<{ access?: string }>;
}) {
  const { storeId } = await params;
  const { access } = await searchParams;

  return (
    <MenuPage
      storeId={storeId}
      accessMode={(access || "tablet") as AccessMode}
    />
  );
}
