"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";

import { MenuItem, OptionChoice } from "@/lib/types/menu";
import { SelectedOption } from "@/lib/types/cart";
import { useCartStore } from "@/lib/stores/cartStore";
import { calculateTotalPrice } from "@/lib/utils/priceCalculator";
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
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const { addItem } = useCartStore();
  const basePrice =
    item?.price ||
    item?.options?.required?.[0]?.default ||
    item?.options?.required?.[0]?.choices[0].price ||
    0;

  const allOptionGroups = useMemo(() => {
    if (!item) return [];
    return [
      ...(item.options?.required || []),
      ...(item.options?.optional || []),
      ...(item.options?.extras || []),
    ];
  }, [item]);

  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setSelectedOptions([]);

      const initialOptions: SelectedOption[] = [];

      const optionGroups = [
        ...(item.options?.required || []),
        ...(item.options?.optional || []),
      ];

      optionGroups.forEach((group) => {
        if (group.required || group.default) {
          const choiceId = group.required
            ? group.choices[0].id
            : (group.default as number);

          const choice = group.choices.find((c) => c.id === choiceId);

          if (choice) {
            initialOptions.push({
              groupId: group.id,
              choiceId: choiceId,
              quantity: 1,
              choice,
            });
          }
        }
      });

      setSelectedOptions(initialOptions);
    }
  }, [isOpen, item]);

  const getQuantityValue = useCallback(
    (groupId: number, choiceId: number): number => {
      const option = selectedOptions.find(
        (opt) => opt.groupId === groupId && opt.choiceId === choiceId
      );
      return option?.quantity || 0;
    },
    [selectedOptions]
  );

  const totalPrice = useMemo(() => {
    if (!item) return 0;
    return calculateTotalPrice(item, selectedOptions, quantity);
  }, [item, selectedOptions, quantity]);

  const handleOptionChange = useCallback(
    (groupId: number, choice: OptionChoice, isMulti: boolean) => {
      setSelectedOptions((prev) => {
        const existingIndex = prev.findIndex(
          (opt) => opt.groupId === groupId && opt.choiceId === choice.id
        );

        if (isMulti) {
          if (existingIndex >= 0) {
            return prev.filter((_, index) => index !== existingIndex);
          } else {
            return [
              ...prev,
              { groupId, choiceId: choice.id, quantity: 1, choice },
            ];
          }
        } else {
          return [
            ...prev.filter((opt) => opt.groupId !== groupId),
            { groupId, choiceId: choice.id, quantity: 1, choice },
          ];
        }
      });
    },
    []
  );

  const handleQuantityChange = useCallback(
    (groupId: number, choice: OptionChoice, newQuantity: number) => {
      setSelectedOptions((prev) => {
        if (newQuantity === 0) {
          return prev.filter(
            (opt) => !(opt.groupId === groupId && opt.choiceId === choice.id)
          );
        }

        const existingOption = prev.find(
          (opt) => opt.groupId === groupId && opt.choiceId === choice.id
        );

        if (existingOption) {
          return prev.map((opt) =>
            opt.groupId === groupId && opt.choiceId === choice.id
              ? { ...opt, quantity: newQuantity }
              : opt
          );
        } else {
          return [
            ...prev,
            { groupId, choiceId: choice.id, quantity: newQuantity, choice },
          ];
        }
      });
    },
    []
  );

  const handleAddToCart = () => {
    if (!item) return;

    addItem({
      menuItem: item,
      selectedOptions,
      quantity,
      totalPrice,
    });

    onClose();
  };

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

          {allOptionGroups.map((group) => (
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
                    onQuantityChange={handleQuantityChange}
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
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <span className="w-10 sm:w-20 text-center font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
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
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-2xl font-bold text-sm sm:text-base xl:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            장바구니에 추가
          </button>
        </div>
      </div>
    </div>
  );
}
