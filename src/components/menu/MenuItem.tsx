"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuItem as MenuItemType } from "@/lib/types/menu";

interface MenuItemProps {
  item: MenuItemType;
  onClick: (item: MenuItemType) => void;
  allImagesLoaded: boolean;
}

export default function MenuItem({
  item,
  onClick,
  allImagesLoaded,
}: MenuItemProps) {
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
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-xl flex flex-row h-24"
    >
      {/* 이미지 영역 */}
      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
        {!allImagesLoaded && (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
            <div className="text-2xl opacity-50">🍽️</div>
          </div>
        )}
        {/* 이미지 */}
        {!imageError ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="96px"
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
              <div className="text-2xl mb-1 opacity-60">🍽️</div>
            </div>
          </div>
        )}
      </div>

      {/* 내용 영역 */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
            {item.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-blue-600">
            {price?.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
