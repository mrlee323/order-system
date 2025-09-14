"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMenu } from "@/lib/api";
import { Category, MenuItem } from "@/lib/types";

import MenuCard from "./MenuCard";

type CategoryType = "all" | "beverages" | "food";

export default function MenuList() {
  const [category, setCategory] = useState<CategoryType>("all");
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu,
  });

  const categories: Category[] = data
    ? category === "all"
      ? data.categories
      : data.categories.filter((c) => c.type === category)
    : [];

  const subcategories = categories.flatMap((c) => c.subcategories);
  const currentSub =
    subcategories.find((s) => s.type === selectedSub) ?? subcategories[0];

  // 모든 이미지 로드 여부
  useEffect(() => {
    if (!currentSub) return;

    const images = currentSub.items.map((item) => item.thumbnail) || [];
    let loadedCount = 0;
    let errorCount = 0;

    // 이미지가 없는 경우 즉시 완료 처리
    if (images.length === 0) {
      setAllImagesLoaded(true);
      return;
    }

    images.forEach((src) => {
      const img = new Image();

      const timeout = setTimeout(() => {
        console.warn(`이미지 로드 타임아웃: ${src}`);
        loadedCount++;
        if (loadedCount + errorCount === images.length) {
          setAllImagesLoaded(true);
        }
      }, 10000);

      img.onload = () => {
        clearTimeout(timeout);
        loadedCount++;
        if (loadedCount + errorCount === images.length) {
          setAllImagesLoaded(true);
        }
      };

      img.onerror = () => {
        clearTimeout(timeout);
        console.warn(`이미지 로드 실패: ${src}`);
        errorCount++;
        if (loadedCount + errorCount === images.length) {
          setAllImagesLoaded(true);
        }
      };

      img.src = src;
    });
  }, [currentSub]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">메뉴를 불러오는 중...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg font-medium">
            메뉴를 불러오는데 실패했습니다
          </p>
          <p className="text-red-500 text-sm mt-2">잠시 후 다시 시도해주세요</p>
        </div>
      </div>
    );

  if (!data) return null;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 헤더 */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🍽️ 메뉴 선택
          </h1>
          <p className="text-gray-600">원하는 메뉴를 선택해주세요</p>
        </div>

        {/* 카테고리 버튼 */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
            {(["all", "beverages", "food"] as CategoryType[]).map((cat) => (
              <button
                key={cat}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                  category === cat
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-200"
                }`}
                onClick={() => {
                  setCategory(cat);
                  setSelectedSub(null);
                }}
              >
                {cat === "all"
                  ? "🍽️ 전체"
                  : cat === "beverages"
                  ? "🥤 음료"
                  : "🍕 푸드"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 서브카테고리 */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              카테고리
            </h3>
            <div className="space-y-1">
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedSub === sub.type ||
                    (!selectedSub && sub.id === subcategories[0].id)
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                  onClick={() => setSelectedSub(sub.type)}
                >
                  {sub.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 메뉴 리스트 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentSub?.items.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onClick={setSelectedItem}
                allImagesLoaded={allImagesLoaded}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
