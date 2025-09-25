import { AccessMode } from "@/lib/types/menu";
import MenuPageClient from "@/components/menu/MenuPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;

  return {
    title: `주문 시스템 - 매장 ${storeId}`,
    description: "매장 주문 관리 시스템",
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
    <MenuPageClient
      storeId={storeId}
      accessMode={(access || "tablet") as AccessMode}
    />
  );
}
