"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";

import {
  MenuItem,
  OptionChoice,
  OptionGroup,
  SelectedOptions,
} from "@/lib/types/menu";
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
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
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

  const initializeGroup = (
    group: OptionGroup
  ): { [choiceId: number]: number } => {
    if (group.required || group.default) {
      const choiceId = group.required
        ? group.choices[0].id
        : (group.default as number);
      return { [choiceId]: 1 };
    }

    return {};
  };

  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setSelectedOptions({});

      const initialOptions: SelectedOptions = {};

      const optionGroups = [
        ...(item.options?.required || []),
        ...(item.options?.optional || []),
      ];

      optionGroups.forEach((group) => {
        const groupOptions = initializeGroup(group);
        if (Object.keys(groupOptions).length > 0) {
          initialOptions[group.id] = groupOptions;
        }
      });

      setSelectedOptions(initialOptions);
    }
  }, [isOpen, item]);

  const findChoiceById = (
    groupId: number,
    choiceId: number
  ): OptionChoice | null => {
    if (!allOptionGroups) return null;

    const group = allOptionGroups.find((g) => g.id === groupId);
    if (!group) return null;

    const choice = group.choices.find((c) => c.id === choiceId);
    return choice ?? null;
  };

  const getQuantityValue = useCallback(
    (groupId: number, choiceId: number): number => {
      const groupOptions = selectedOptions[groupId];
      return groupOptions?.[choiceId] || 0;
    },
    [selectedOptions]
  );

  const totalPrice = useMemo(() => {
    if (!item) return 0;

    let basePrice = item.price || 0;
    let optionalPrice = 0;
    let extrasPrice = 0;

    Object.entries(selectedOptions).forEach(([groupId, groupOptions]) => {
      const groupIdNum = Number(groupId);

      const isOptional = [
        ...(item.options?.optional || []),
        ...(item.options?.required || []),
      ].some((opt) => opt.id === groupIdNum);

      const isExtras = [...(item.options?.extras || [])].some(
        (ext) => ext.id === groupIdNum
      );

      Object.entries(groupOptions).forEach(([choiceId, choiceQuantity]) => {
        if ((choiceQuantity as number) > 0) {
          const choice = findChoiceById(groupIdNum, Number(choiceId));
          const choicePrice = (choice?.price || 0) * (choiceQuantity as number);
          if (isOptional) {
            optionalPrice += choicePrice;
          } else if (isExtras) {
            extrasPrice += choicePrice;
          }
        }
      });
    });

    return (basePrice + optionalPrice) * quantity + extrasPrice;
  }, [item, selectedOptions, quantity]);

  const handleOptionChange = useCallback(
    (groupId: number, choiceId: number, isMulti: boolean) => {
      setSelectedOptions((prev) => {
        const current = prev[groupId] || {};

        if (isMulti) {
          const newQuantity = current[choiceId] > 0 ? 0 : 1;
          return {
            ...prev,
            [groupId]: {
              ...current,
              [choiceId]: newQuantity,
            },
          };
        } else {
          return {
            ...prev,
            [groupId]: { [choiceId]: 1 },
          };
        }
      });
    },
    []
  );

  const handleQuantityChange = useCallback(
    (groupId: number, choiceId: number, newQuantity: number) => {
      setSelectedOptions((prev) => {
        const current = prev[groupId] || {};

        if (newQuantity === 0) {
          const newGroupOptions = { ...current };
          delete newGroupOptions[choiceId];
          return {
            ...prev,
            [groupId]: newGroupOptions,
          };
        } else {
          return {
            ...prev,
            [groupId]: {
              ...current,
              [choiceId]: newQuantity,
            },
          };
        }
      });
    },
    []
  );

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[95vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {item.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
            <p className="text-xl font-bold text-blue-600 mt-2">
              {basePrice.toLocaleString()}원
            </p>
          </div>

          {allOptionGroups.map((group) => (
            <div key={group.id} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
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
                    selectedOptions={selectedOptions}
                    onOptionChange={handleOptionChange}
                    onQuantityChange={handleQuantityChange}
                    getQuantityValue={getQuantityValue}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* 수량 선택 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">수량</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-3 font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="text-xl font-bold text-blue-600">
                총 {totalPrice.toLocaleString()}원
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={() => console.log("add to cart")}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            장바구니에 추가
          </button>
        </div>
      </div>
    </div>
  );
}
