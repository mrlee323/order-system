"use client";

import { useMenuQuery } from "@/lib/quries/menu";
import { AccessMode, MenuResponse } from "@/lib/types/menu";

import MenuList from "@/components/menu/MenuList";
import Cart from "@/components/cart/Cart";
import { useStoreQuery } from "@/lib/quries/store";

interface MenuPageClientProps {
  initialData: MenuResponse;
  storeId: string;
  accessMode: AccessMode;
}

export default function MenuPageClient({
  initialData,
  storeId,
  accessMode,
}: MenuPageClientProps) {
  const { data, isLoading, error, refetch } = useMenuQuery(storeId, {
    initialData,
  });
  const { data: storeData } = useStoreQuery(storeId);

  const displayData = error ? initialData : data;
  return (
    <main
      className={`h-screen relative ${
        accessMode === "mobile" ? "mobile-layout" : "tablet-layout"
      }`}
    >
      {/* 메인 메뉴 */}
      <MenuList
        data={displayData}
        storeData={storeData}
        accessMode={accessMode}
        isLoading={isLoading}
      />

      {/* 장바구니 */}
      <Cart accessMode={accessMode} />

      {error && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>데이터 동기화 실패 - 오프라인 모드로 작동 중</span>
            <button
              onClick={() => refetch()}
              className="ml-2 px-2 py-1 bg-yellow-200 rounded text-sm hover:bg-yellow-300"
            >
              재시도
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
