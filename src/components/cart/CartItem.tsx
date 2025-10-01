import { CartItem as CartItemType } from "@/lib/types/cart";
import Image from "next/image";

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
    <div className="bg-white p-3 transition-all duration-300 overflow-hidden group">
      <div className="flex items-center justify-end">
        <button onClick={onRemove} className="text-gray-400 flex-shrink-0">
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
      <div className="flex gap-4 items-start">
        {/* 이미지 섹션 */}
        <div className="flex-shrink-0">
          <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-full overflow-hidden bg-gray-100">
            <Image
              src={item.menuItem.thumbnail || "/images/placeholder-food.jpg"}
              alt={item.menuItem.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          </div>
        </div>

        {/* 텍스트 섹션 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-gray-800 text-xs sm:text-base leading-tight flex-1 pr-2">
              {item.menuItem.title}
            </h3>
          </div>

          {/* 옵션 정보 */}
          {getOptionText() && (
            <div className="mb-1 sm:mb-3">
              <p className="text-xs sm:text-sm text-gray-400 font-normal  ">
                {getOptionText()}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            {/* 수량 조절 */}
            <div className="flex items-center bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => onUpdateQuantity(item.quantity - 1)}
                className="w-4 sm:w-8 h-4 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white rounded-md transition-all duration-200 font-bold"
              >
                −
              </button>
              <span className="px-3 sm:py-1 text-sm sm:text-base font-semibold text-gray-900 min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="w-4 sm:w-8 h-4 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white rounded-md transition-all duration-200 font-bold"
              >
                +
              </button>
            </div>

            {/* 가격 */}
            <div className="text-right">
              <div className="text-sm  sm:text-base font-semibold text-gray-900">
                {item.totalPrice.toLocaleString()}원
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
