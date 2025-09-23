import { MenuItem } from "@/lib/types/menu";
import { SelectedOption } from "@/lib/types/cart";

export const calculateTotalPrice = (
  menuItem: MenuItem,
  selectedOptions: SelectedOption[],
  quantity: number
): number => {
  const basePrice = menuItem.price || 0;

  let optionalPrice = 0;
  let extrasPrice = 0;

  selectedOptions.forEach((option) => {
    const groupId = Number(option.groupId);
    const choicePrice = option.choice?.price || 0;
    const choiceQuantity = option.quantity || 0;

    const isOptional = [
      ...(menuItem.options?.optional || []),
      ...(menuItem.options?.required || []),
    ].some((opt) => opt.id === groupId);

    const isExtras = [...(menuItem.options?.extras || [])].some(
      (ext) => ext.id === groupId
    );

    if (isOptional) {
      optionalPrice += choicePrice * choiceQuantity;
    } else if (isExtras) {
      extrasPrice += choicePrice * choiceQuantity;
    }
  });

  return (basePrice + optionalPrice) * quantity + extrasPrice;
};
