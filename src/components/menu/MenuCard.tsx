"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/lib/types/menu";

interface Props {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  allImagesLoaded: boolean;
}

export default function MenuCard({ item, onClick, allImagesLoaded }: Props) {
  const [imageError, setImageError] = useState(false);

  const getBasePrice = () => {
    if (!item.options) return item.price || 0;

    if (item.options.required && item.options.required.length > 0) {
      const firstRequired = item.options.required[0];
      if (firstRequired.choices && firstRequired.choices.length > 0) {
        return firstRequired.choices[0].price;
      }
    }

    return item.price || 0;
  };

  const price = getBasePrice();

  return (
    <div
      onClick={() => onClick(item)}
      className={`group relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-2xl`}
    >
      <div className="relative h-56 w-full overflow-hidden">
        {!allImagesLoaded && (
          <div className="rounded-t-3xl w-full h-56 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
            <div className="text-6xl opacity-50">🍽️</div>
          </div>
        )}
        {/* 이미지 */}
        {!imageError ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className={`${
              allImagesLoaded
                ? "object-cover transition-transform duration-500 group-hover:scale-110"
                : "invisible"
            }`}
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2 opacity-60">🍽️</div>
              <div className="text-sm text-gray-500 font-medium">
                이미지 준비중
              </div>
            </div>
          </div>
        )}
        {/* 가격 표시 */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg">
          <span className="text-lg font-bold text-blue-600">
            {price?.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 내용 */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
          {item.title}
        </h3>

        <p className="text-sm text-gray-600 flex-1 line-clamp-2 leading-relaxed mb-4 min-h-[48px]">
          {item.description}
        </p>

        <button
          type="button"
          aria-label={`${item.title} 선택`}
          onClick={(e) => {
            e.stopPropagation();
            onClick(item);
          }}
          className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-md"
        >
          <span>선택하기</span>
        </button>
      </div>
    </div>
  );
}
