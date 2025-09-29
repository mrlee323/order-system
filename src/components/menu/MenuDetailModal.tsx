"use client";

import Image from "next/image";

import useMenu from "@/hooks/useMenu";
import { MenuItem } from "@/lib/types/menu";
import MenuOptionItem from "./MenuOptionItem";

interface MenuDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDetailModal({
  item,
  isOpen,
  onClose,
}: MenuDetailModalProps) {
  const {
    basePrice,
    totalPrice,
    groupOptions,
    quantity,
    getQuantityValue,
    handleOptionChange,
    handleOptionQuntityChange,
    handleQuantityChange,
    handleAddToCart,
  } = useMenu({
    item,
    isOpen,
  });

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl sm:rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[95vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-md sm:text-lg xl:text-xl font-bold text-gray-800 mb-2">
              {item.title}
            </h2>
            <p className="text-sm sm:text-base xl:text-lg text-gray-600 leading-relaxed">
              {item.description}
            </p>
            <p className="text-md sm:text-lg xl:text-xl font-bold text-blue-600 mt-2">
              {basePrice.toLocaleString()}원
            </p>
          </div>

          {groupOptions.map((group) => (
            <div key={group.id} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base xl:text-lg font-semibold text-gray-800">
                  {group.title}
                  {group.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
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

          {/* 수량 선택 */}
          <div className="mb-6 text-sm sm:text-base xl:text-lg">
            <h3 className="font-semibold text-gray-800 mb-3">수량</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    handleQuantityChange(Math.max(1, quantity - 1))
                  }
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <span className="w-10 sm:w-20 text-center font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="font-bold text-blue-600">
                총 {totalPrice.toLocaleString()}원
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-3 sm:p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={() => {
              handleAddToCart();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-2xl font-bold text-sm sm:text-base xl:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            장바구니에 추가
          </button>
        </div>
      </div>
    </div>
  );
}
