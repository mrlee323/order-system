"use client";

import { useCartStore } from "@/lib/stores/cartStore";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { CartItem as CartItemType } from "@/lib/types/cart";
import CartItem from "@/components/cart/CartItem";
import { useUI } from "@/hooks/useUI";
import { Alert, Prompt } from "@/components/ui";
import { showSuccessToast, showErrorToast } from "@/components/ui";
import { ChevronLeft, Share2 } from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCartStore();

  const { isOnline } = useOnlineStatus();
  const { alert, prompt, showAlert, closeAlert, showPrompt, closePrompt } =
    useUI();

  const handleClearCart = () => {
    showPrompt(
      "장바구니 비우기",
      "장바구니의 모든 상품을 삭제하시겠습니까?",
      "취소",
      "비우기"
    );
  };

  const handleOrder = () => {
    if (!isOnline) {
      showAlert("오프라인 상태", "주문을 완료하려면 인터넷 연결이 필요합니다.");
      return;
    }

    showAlert(
      "주문 완료",
      `총 ${getTotalItems()}개 상품, ${getTotalPrice().toLocaleString()}원 주문이 완료되었습니다.`,
      "확인"
    );
  };

  const handlePromptConfirm = () => {
    clearCart();
    closePrompt();
    showSuccessToast("장바구니가 비워졌습니다.");
  };

  const handleAlertConfirm = () => {
    closeAlert();
    showSuccessToast("주문이 완료되었습니다!");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            장바구니가 비어있습니다
          </h1>
          <p className="text-gray-600 mb-6">
            맛있는 메뉴를 선택해서 장바구니에 담아보세요!
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
          >
            메뉴 보러가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <div className="sticky top-0 left-0 right-0 z-100 bg-white px-4 py-2">
        <button
          onClick={() => window.history.back()}
          className="w-8 h-8  flex items-center justify-center hover:bg-gray-200 transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="bg-white px-4 py-2">
        <h2 className="text-2xl font-bold">장바구니</h2>
      </div>

      {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200 flex-shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">장바구니</h1>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* 주문 목록 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              주문 상품
              <span className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            </h2>
            <div className="space-y-4">
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
          </div>
        </div>

        {/* 오프라인 상태 */}
        {!isOnline && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span className="text-sm font-medium">
                오프라인 상태입니다. 주문을 완료하려면 인터넷 연결이 필요합니다.
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-100 bg-white p-4 flex flex-col md:flex-row gap-3 md:gap-4 border-t-2 border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-3 border border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-md sm:text-lg font-semibold text-gray-700">
                총 금액
              </span>
              <span className="text-lg sm:text-2xl font-bold text-gray-900">
                {getTotalPrice().toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>주문 상품</span>
              <span className="font-medium">{getTotalItems()}개</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleOrder}
          disabled={!isOnline}
          className={`flex-1  px-6 py-2 md:py-4 rounded-2xl font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
            isOnline
              ? "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {isOnline ? "주문하기" : "🔴 오프라인"}
        </button>
      </div>

      {/* Alert 컴포넌트 */}
      <Alert
        isOpen={alert.isOpen}
        title={alert.title}
        description={alert.description}
        buttonText={alert.buttonText}
        onClose={closeAlert}
        onConfirm={handleAlertConfirm}
      />

      {/* Prompt 컴포넌트 */}
      <Prompt
        isOpen={prompt.isOpen}
        title={prompt.title}
        description={prompt.description}
        cancelText={prompt.cancelText}
        confirmText={prompt.confirmText}
        onClose={closePrompt}
        onCancel={closePrompt}
        onConfirm={handlePromptConfirm}
      />
    </div>
  );
}
