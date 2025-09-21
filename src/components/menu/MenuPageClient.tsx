"use client";

import { useEffect, useState } from "react";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useMenuQuery } from "@/lib/quries/menu";
import { MenuResponse } from "@/lib/types/menu";
import MenuList from "@/components/menu/MenuList";

interface MenuPageClientProps {
  initialData: MenuResponse;
  storeId: string;
}

export default function MenuPageClient({
  initialData,
  storeId,
}: MenuPageClientProps) {
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { isOnline } = useOnlineStatus();
  const { data, isLoading, error, refetch } = useMenuQuery(storeId, {
    initialData,
  });

  useEffect(() => {
    setLastSync(new Date());
  }, [data]);

  const displayData = error ? initialData : data;

  return (
    <main className="h-screen relative">
      <div className="absolute top-4 right-4 z-10 flex flex-wrap gap-2">
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isOnline ? "🟢 온라인" : "🔴 오프라인"}
        </div>

        {isLoading && (
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            🔄 동기화 중...
          </div>
        )}

        <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
          마지막 동기화:{" "}
          {lastSync ? (
            lastSync.toLocaleTimeString("ko-KR")
          ) : (
            <span className="mx-[35px]">-</span>
          )}
        </div>
      </div>

      {/* 메인 메뉴 */}
      <MenuList data={displayData} />

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
