"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/lib/types";

interface Props {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  allImagesLoaded: boolean;
}

export default function MenuCard({ item, onClick, allImagesLoaded }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 가격 계산 (새로운 옵션 구조에 맞게 동적으로)
  const getBasePrice = () => {
    if (!item.options) return item.price || 0;

    // required 옵션에서 첫 번째 선택지의 가격을 기본 가격으로 사용
    if (item.options.required && item.options.required.length > 0) {
      const firstRequired = item.options.required[0];
      if (firstRequired.choices && firstRequired.choices.length > 0) {
        return firstRequired.choices[0].price;
      }
    }

    return item.price || 0;
  };

  const price = getBasePrice();

  // 옵션 개수 계산 (새로운 구조에 맞게 동적으로)
  const getOptionCount = () => {
    if (!item.options) return 0;

    let count = 0;

    // required 옵션 개수
    if (item.options.required) {
      count += item.options.required.length;
    }

    // optional 옵션 개수
    if (item.options.optional) {
      count += item.options.optional.length;
    }

    // additions 옵션 개수
    if (item.options.additions) {
      count += item.options.additions.length;
    }

    return count;
  };

  const optionCount = getOptionCount();

  return (
    <div
      onClick={() => onClick(item)}
      className={`group relative bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-2xl ${
        !allImagesLoaded ? "animate-pulse bg-gray-200" : ""
      }`}
    >
      {/* 이미지 컨테이너 */}
      <div className="relative h-56 w-full overflow-hidden">
        {allImagesLoaded ? (
          <>
            {!imageError ? (
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setIsLoaded(true);
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
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-6xl opacity-20">🍽️</div>
          </div>
        )}

        {/* 가격 오버레이 */}
        {allImagesLoaded && isLoaded && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg">
            <div className="flex items-center space-x-1">
              <span className="text-lg font-bold text-blue-600">
                {price?.toLocaleString()}원
              </span>
              {optionCount > 0 && (
                <span className="text-xs text-gray-500 font-medium">부터</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 내용 */}
      {allImagesLoaded && isLoaded && (
        <div className="p-5 flex flex-col flex-1">
          {/* 제목 */}
          <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
            {item.title}
          </h3>

          {/* 설명 */}
          <p className="text-sm text-gray-600 flex-1 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>

          {/* 선택 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(item);
            }}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-md"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🛒</span>
              <span>선택하기</span>
            </span>
          </button>
        </div>
      )}

      {/* 로딩 상태 */}
      {!allImagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 font-medium">로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
