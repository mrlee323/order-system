import { MenuItem, OptionChoice } from "@/lib/types/menu";
import { SelectedOption } from "@/lib/types/cart";
import { useCallback, useMemo, useState, useEffect } from "react";
import { calculateTotalPrice } from "@/lib/utils/priceCalculator";
import { useCartStore } from "@/lib/stores/cartStore";

export default function useMenu({
  item,
  isOpen,
}: {
  item: MenuItem | null;
  isOpen: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const { addItem } = useCartStore();

  const basePrice = useMemo(() => {
    return (
      item?.price ||
      item?.options?.required?.[0]?.default ||
      item?.options?.required?.[0]?.choices[0].price ||
      0
    );
  }, [item]);

  const groupOptions = useMemo(() => {
    if (!item) return [];
    return [
      ...(item.options?.required || []),
      ...(item.options?.optional || []),
      ...(item.options?.extras || []),
    ];
  }, [item]);

  const totalPrice = useMemo(() => {
    if (!item) return 0;
    return calculateTotalPrice(item, selectedOptions, quantity);
  }, [item, selectedOptions, quantity]);

  const getQuantityValue = (groupId: number, choiceId: number): number => {
    const option = selectedOptions.find(
      (opt) => opt.groupId === groupId && opt.choiceId === choiceId
    );
    return option?.quantity || 0;
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleOptionChange = (
    groupId: number,
    choice: OptionChoice,
    isMulti: boolean
  ) => {
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
  };

  const handleOptionQuntityChange = (
    groupId: number,
    choice: OptionChoice,
    newQuantity: number
  ) => {
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
  };

  const handleAddToCart = () => {
    if (!item) return;
    addItem({
      menuItem: item,
      selectedOptions,
      quantity,
      totalPrice,
    });
  };

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

  return {
    basePrice,
    totalPrice,
    groupOptions,
    quantity,
    getQuantityValue,
    handleOptionChange,
    handleOptionQuntityChange,
    handleQuantityChange,
    handleAddToCart,
  };
}
