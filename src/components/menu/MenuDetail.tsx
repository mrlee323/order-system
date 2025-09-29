"use client";

import Image from "next/image";
import { ChevronLeft, Share2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useMenuItemQuery } from "@/lib/quries/menu";
import useMenu from "@/hooks/useMenu";
import MenuOptionItem from "./MenuOptionItem";

export default function MenuDetail({
  storeId,
  menuId,
}: {
  storeId: string;
  menuId: string;
}) {
  const menuInfoRef = useRef<HTMLDivElement>(null);
  const [isContentsPositionTop, setIsContentsPositionTop] = useState(false);
  const { data: menu, isLoading, error } = useMenuItemQuery(storeId, menuId);
  const {
    totalPrice,
    groupOptions,
    quantity,
    getQuantityValue,
    handleOptionChange,
    handleOptionQuntityChange,
    handleQuantityChange,
    handleAddToCart,
  } = useMenu({
    item: menu || null,
    isOpen: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (menuInfoRef.current) {
        const rect = menuInfoRef.current.getBoundingClientRect();
        setIsContentsPositionTop(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [menu]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">메뉴 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">메뉴 정보를 불러올 수 없습니다.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-300"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Sticky 헤더 - 스크롤 시 나타남 */}
      {isContentsPositionTop && (
        <div className="fixed top-0 left-0 right-0 z-100 bg-white px-4 py-2 shadow-md">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="w-8 h-8  flex items-center justify-center hover:bg-gray-200 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-md sm:text-lg font-semibold text-gray-800 truncate max-w-[200px]">
              {menu.title}
            </h1>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-all duration-300">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* 상단 이미지 섹션 */}
      <div className="sticky top-0 left-0 right-0 h-64 z-1">
        {/* 네비게이션 바 */}
        <div className="absolute top-0 left-0 right-0 z-2 p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 bg-gray-800/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-gray-800/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* 메뉴 이미지 */}
        <div className="w-full">
          <Image
            src={menu.thumbnail}
            alt={menu.title}
            fill
            className="object-cover "
            priority
          />
        </div>
      </div>

      {/* 메뉴 정보 섹션 */}
      <div
        ref={menuInfoRef}
        className={`absolute top-64 h-screen left-0 right-0 z-3 px-4 ${
          isContentsPositionTop ? "pt-20 pb-32 overflow-y-auto" : " py-4"
        } bg-white rounded-2xl `}
      >
        {/* 제목 */}
        <div className={`mb-5 ${isContentsPositionTop ? "hidden" : ""}`}>
          <h1 className="text-xl font-bold text-gray-800 mb-2">{menu.title}</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            {menu.description}
          </p>
        </div>

        {groupOptions.map((group) => (
          <div key={group.id} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm sm:text-base xl:text-lg font-semibold text-gray-800">
                {group.title}
                {group.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
            </div>

            <div className="space-y-2">
              {group.choices.map((choice) => (
                <MenuOptionItem
                  key={choice.id}
                  choice={choice}
                  group={group}
                  onOptionChange={handleOptionChange}
                  onQuantityChange={handleOptionQuntityChange}
                  getQuantityValue={getQuantityValue}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 액션 바 */}
      <div className="fixed z-4 bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100  p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="rounded-full border border-gray-400 w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-5 text-center text-sm ">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
              className="rounded-full border border-gray-400 w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="font-bold text-blue-600">
            {totalPrice.toLocaleString()}원
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:border-red-300 transition-all duration-300"
            onClick={() => handleAddToCart()}
          >
            <ShoppingCart className="w-6 h-6 text-gray-400" />
          </button>
          <button className="flex-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-base hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
            주문하기
          </button>
        </div>
      </div>
    </div>
  );
}
