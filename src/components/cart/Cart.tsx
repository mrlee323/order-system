"use client";

import { useCartStore } from "@/lib/stores/cartStore";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { CartItem as CartItemType } from "@/lib/types/cart";
import CartItem from "./CartItem";
import { AccessMode } from "@/lib/types/menu";

interface CartProps {
  accessMode: AccessMode;
}

export default function Cart({ accessMode }: CartProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
    isModalOpen,
    openModal,
    closeModal,
  } = useCartStore();

  const { isOnline } = useOnlineStatus();

  if (items.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => openModal()}
          className="bg-gray-100 text-gray-600 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm">🛒</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-xs">장바구니</div>
              <div className="text-xs text-gray-500">0개</div>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 장바구니 버튼 */}
      <div
        className={`fixed bottom-4 z-40 transition-all duration-500 ease-in-out right-4`}
      >
        <button
          onClick={() => (isModalOpen ? closeModal() : openModal())}
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-white/75 rounded-full flex items-center justify-center">
              <span className="text-lg">🛒</span>
            </div>
            {getTotalItems() > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </div>
            )}
          </div>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
          isModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => closeModal()}
        />
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${
            isModalOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">주문내역</h2>
              </div>
              <button
                onClick={() => closeModal()}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
          </div>

          {/* 주문 목록 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.map((item: CartItemType) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onUpdateQuantity={(quantity: number) =>
                  updateQuantity(item.id, quantity)
                }
              />
            ))}
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 flex-shrink-0 border-t border-gray-200">
            {!isOnline && (
              <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span className="text-sm font-medium">
                    오프라인 상태입니다. 주문을 완료하려면 인터넷 연결이
                    필요합니다.
                  </span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-700">
                    총 금액
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {getTotalPrice().toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>주문 상품</span>
                  <span className="font-medium">{getTotalItems()}개</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={clearCart}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-2xl font-bold hover:from-gray-300 hover:to-gray-400 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                🗑️ 비우기
              </button>
              <button
                disabled={!isOnline}
                className={`flex-1 px-6 py-4 rounded-2xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
                  isOnline
                    ? "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {isOnline ? "💳 주문하기" : "🔴 오프라인"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
