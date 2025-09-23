"use client";

import { useState, useMemo } from "react";
import { MenuItem, CategoryType, MenuResponse } from "@/lib/types/menu";
import useImagePreloader from "@/hooks/useImagePreloader";

import MenuCard from "./MenuCard";
import MenuDetailModal from "./MenuDetailModal";
import { AccessMode } from "@/lib/types/menu";

interface MenuListProps {
  data: MenuResponse | undefined;
  accessMode: AccessMode;
}

export default function MenuList({ data, accessMode }: MenuListProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );

  const categories = useMemo(() => {
    return [
      {
        type: "all",
        title: "전체",
      },
      ...(data?.categories.map((c) => ({
        type: c.type,
        title: c.title,
      })) || []),
    ];
  }, [data]);

  const subCategories = useMemo(() => {
    if (selectedCategory === "all")
      return data?.categories.flatMap((c) => c.subcategories) || [];
    return (
      data?.categories.find((c) => c.type === selectedCategory)
        ?.subcategories || []
    );
  }, [data, selectedCategory]);

  const manuList = useMemo(() => {
    return (
      subCategories.find((s) => s.type === selectedSubCategory) ??
      subCategories[0]
    );
  }, [subCategories, selectedSubCategory]);

  const { allLoaded } = useImagePreloader(
    manuList?.items.map((item) => item.thumbnail) || []
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

        {/* 카테고리 버튼 리스트 */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category.type}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                  selectedCategory === category.type
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-200"
                }`}
                onClick={() => {
                  setSelectedCategory(category.type as CategoryType);
                  setSelectedSubCategory(null);
                }}
              >
                {category.title}
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
              {subCategories.map((sub) => (
                <button
                  key={sub.id}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedSubCategory === sub.type ||
                    (!selectedSubCategory && sub.id === subCategories[0].id)
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                  onClick={() => {
                    setSelectedSubCategory(sub.type);
                  }}
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
            {manuList?.items.map((item) => {
              return (
                <MenuCard
                  key={item.id}
                  item={item}
                  onClick={(item) => setSelectedMenuItem(item)}
                  allImagesLoaded={allLoaded}
                />
              );
            })}
          </div>
        </div>
      </div>
      <MenuDetailModal
        isOpen={!!selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        item={selectedMenuItem}
      />
    </div>
  );
}
