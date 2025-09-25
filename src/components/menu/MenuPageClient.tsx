"use client";

import { useMenuQuery } from "@/lib/quries/menu";
import { AccessMode, MenuResponse } from "@/lib/types/menu";

import MenuList from "@/components/menu/MenuList";
import Cart from "@/components/cart/Cart";
import { useStoreQuery } from "@/lib/quries/store";
import ErrorComponent from "@/components/common/ErrorComponent";

interface MenuPageClientProps {
  storeId: string;
  accessMode: AccessMode;
}

export default function MenuPageClient({
  storeId,
  accessMode,
}: MenuPageClientProps) {
  const { data, isLoading, error, refetch } = useMenuQuery(storeId);
  const { data: storeData } = useStoreQuery(storeId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">메뉴를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorComponent error={error} onRetry={() => refetch()} />;
  }

  if (!data || data.length === 0) {
    return (
      <ErrorComponent
        error={new Error("메뉴 데이터를 불러올 수 없습니다.")}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <main
      className={`h-screen relative ${
        accessMode === "mobile" ? "mobile-layout" : "tablet-layout"
      }`}
    >
      {/* 메인 메뉴 */}
      <MenuList
        data={data}
        storeData={storeData}
        accessMode={accessMode}
        isLoading={isLoading}
      />

      {/* 장바구니 */}
      <Cart accessMode={accessMode} />
    </main>
  );
}
