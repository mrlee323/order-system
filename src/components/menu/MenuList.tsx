"use client";

import { useState, useMemo } from "react";
import {
  MenuItem,
  CategoryType,
  MenuResponse,
  AccessMode,
} from "@/lib/types/menu";
import { useStoreQuery } from "@/lib/quries/store";
import useImagePreloader from "@/hooks/useImagePreloader";
import MenuCard from "./MenuCard";
import MenuDetailModal from "./MenuDetailModal";
import Image from "next/image";

interface MenuListProps {
  data: MenuResponse | undefined;
  accessMode: AccessMode;
}

export default function MenuList({ data, accessMode }: MenuListProps) {
  const { data: storeData } = useStoreQuery();

  const store = storeData?.item;

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

  const menuList = useMemo(() => {
    return (
      subCategories.find((s) => s.type === selectedSubCategory) ??
      subCategories[0]
    );
  }, [subCategories, selectedSubCategory]);

  const { allLoaded } = useImagePreloader(
    menuList?.items.map((item) => item.thumbnail) || []
  );

  const handleCategorySelect = (categoryType: CategoryType) => {
    setSelectedCategory(categoryType);
    setSelectedSubCategory(null);
  };

  const handleSubCategorySelect = (subCategoryType: string) => {
    setSelectedSubCategory(subCategoryType);
  };

  const handleMenuItemSelect = (item: MenuItem) => {
    setSelectedMenuItem(item);
  };

  const closeModal = () => {
    setSelectedMenuItem(null);
  };

  if (!data) return null;

  return (
    <div className="flex portrait:flex-col landscape:flex-row h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex flex-col">
        {/* 스토어 헤더 */}
        {store && (
          <div className="flex landscape:flex-col portrait:flex-row items-center gap-2 p-4 bg-white">
            <Image
              src={store.logo || ""}
              alt={store.name || ""}
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
            <div className="text-lg font-medium text-gray-700">
              {store.name}
            </div>
          </div>
        )}

        {/* 카테고리 */}
        <div className="h-full flex gap-2 p-4 bg-white shadow-lg portrait:flex-row landscape:flex-col landscape:w-48 portrait:w-full portrait:border-y border-gray-100">
          {categories.map((category) => (
            <button
              key={category.type}
              type="button"
              aria-label={category.title + "카테고리 선택"}
              className={`landscape:w-full portrait:w-auto landscape:rounded-lg portrait:rounded-full text-left landscape:px-4 portrait:px-6 landscape:py-3 portrait:py-3 font-medium transition-all duration-200 ${
                selectedCategory === category.type
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform landscape:scale-105"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 portrait:shadow-md"
              }`}
              onClick={() =>
                handleCategorySelect(category.type as CategoryType)
              }
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* 서브카테고리 */}
        <div className="bg-white w-full py-3 shadow-md">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-6">
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                aria-label={sub.title + "서브카테고리 선택"}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedSubCategory === sub.type ||
                  (!selectedSubCategory && sub.id === subCategories[0].id)
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => handleSubCategorySelect(sub.type)}
              >
                {sub.title}
              </button>
            ))}
          </div>
        </div>
        {/* 메뉴 리스트 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuList?.items.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onClick={handleMenuItemSelect}
                allImagesLoaded={allLoaded}
              />
            ))}
          </div>
        </div>
      </div>

      <MenuDetailModal
        isOpen={!!selectedMenuItem}
        onClose={closeModal}
        item={selectedMenuItem}
      />
    </div>
  );
}
