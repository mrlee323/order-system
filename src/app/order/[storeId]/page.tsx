import { Suspense } from "react";

import { fetchMenu } from "@/lib/api";
import ErrorComponent from "@/components/common/ErrorComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import MenuPageClient from "@/components/menu/MenuPageClient";
import { AccessMode } from "@/lib/types/menu";

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
  try {
    const { storeId } = await params;
    const { access } = await searchParams;
    const [initialData] = await Promise.all([fetchMenu()]);

    return (
      <main className="h-screen">
        <Suspense fallback={<LoadingComponent />}>
          <MenuPageClient
            initialData={initialData}
            storeId={storeId}
            accessMode={(access || "tablet") as AccessMode}
          />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error("페이지 초기화 실패:", error);
    return <ErrorComponent />;
  }
}
