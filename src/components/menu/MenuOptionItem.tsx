"use client";

import { OptionGroup, OptionChoice } from "@/lib/types/menu";

interface MenuOptionItemProps {
  group: OptionGroup;
  choice: OptionChoice;
  onOptionChange: (
    groupId: number,
    choice: OptionChoice,
    isMulti: boolean
  ) => void;
  onQuantityChange: (
    groupId: number,
    choice: OptionChoice,
    newQuantity: number
  ) => void;
  getQuantityValue: (groupId: number, choiceId: number) => number;
}

export default function MenuOptionItem({
  choice,
  group,
  onOptionChange,
  onQuantityChange,
  getQuantityValue,
}: MenuOptionItemProps) {
  const isQuantityChoice = choice.maxQuantity !== undefined;
  const quantityValue = getQuantityValue(group.id, choice.id);
  const isSelected = quantityValue > 0;
  const isDisabled = choice.available === false;

  // 수량 옵션 일 경우
  if (isQuantityChoice) {
    return (
      <QuantityChoice
        choice={choice}
        group={group}
        isSelected={isSelected}
        quantityValue={quantityValue}
        onQuantityChange={onQuantityChange}
      />
    );
  }

  // 일반 옵션 일 경우
  return (
    <RegularChoice
      choice={choice}
      group={group}
      isSelected={isSelected}
      isDisabled={isDisabled}
      onOptionChange={onOptionChange}
    />
  );
}

interface QuantityChoiceProps {
  choice: OptionChoice;
  group: OptionGroup;
  isSelected: boolean;
  quantityValue: number;
  onQuantityChange: (
    groupId: number,
    choice: OptionChoice,
    newQuantity: number
  ) => void;
}

function QuantityChoice({
  choice,
  group,
  isSelected,
  quantityValue,
  onQuantityChange,
}: QuantityChoiceProps) {
  const maxQuantity = choice.maxQuantity || 5;
  const totalPrice = choice.price * quantityValue;

  return (
    <div
      className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center">
          <span className="font-medium text-sm sm:text-base xl:text-lg text-gray-800 mr-4">
            {choice.title}
          </span>
          <span className="text-xs sm:text-sm xl:text-base text-gray-500">
            (최대 {maxQuantity}개)
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`font-semibold text-sm sm:text-base xl:text-lg ${
              isSelected ? "text-blue-600" : "text-gray-400"
            }`}
          >
            +{totalPrice.toLocaleString()}원
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                onQuantityChange(
                  group.id,
                  choice,
                  Math.max(0, quantityValue - 1)
                )
              }
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-50"
              disabled={quantityValue <= 0}
            >
              -
            </button>
            <span className="w-4 sm:w-8 text-sm sm:text-base xl:text-lg text-center font-medium">
              {quantityValue}
            </span>
            <button
              onClick={() =>
                onQuantityChange(
                  group.id,
                  choice,
                  Math.min(maxQuantity, quantityValue + 1)
                )
              }
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-50"
              disabled={quantityValue >= maxQuantity}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RegularChoiceProps {
  choice: OptionChoice;
  group: OptionGroup;
  isDisabled: boolean;
  isSelected: boolean;
  onOptionChange: (
    groupId: number,
    choice: OptionChoice,
    isMulti: boolean
  ) => void;
}

function RegularChoice({
  choice,
  group,
  isDisabled,
  isSelected,
  onOptionChange,
}: RegularChoiceProps) {
  return (
    <label
      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : isDisabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center">
        <input
          type={group.allowMultiple ? "checkbox" : "radio"}
          name={group.id.toString()}
          value={choice.id.toString()}
          checked={isSelected}
          disabled={isDisabled}
          onChange={() => onOptionChange(group.id, choice, group.allowMultiple)}
          className="mr-3"
        />
        <span className="font-medium text-sm sm:text-base xl:text-lg text-gray-800">
          {choice.title}
        </span>
      </div>
      {choice.price > 0 && (
        <span
          className={`font-semibold ${
            isSelected ? "text-blue-600" : "text-gray-600"
          }`}
        >
          +{choice.price.toLocaleString()}원
        </span>
      )}
    </label>
  );
}
