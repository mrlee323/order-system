import { CartItem as CartItemType } from "@/lib/types/cart";

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const getOptionText = () => {
    const options: string[] = [];
    item.selectedOptions.forEach((option) => {
      options.push(
        option.choice.title +
          (option.quantity > 1 ? `(${option.quantity})` : "")
      );
    });
    return options.join(", ");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight flex-1 pr-2">
            {item.menuItem.title}
          </h3>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 hover:bg-red-50 rounded-full flex-shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 옵션 정보 */}
        {getOptionText() && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              {getOptionText()}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* 수량 조절 */}
          <div className="flex items-center">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 text-xl hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              -
            </button>
            <span className="px-3 py-1 text-base font-semibold text-gray-900 min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 text-xl hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              +
            </button>
          </div>

          {/* 가격 */}
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {item.totalPrice.toLocaleString()}원
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
