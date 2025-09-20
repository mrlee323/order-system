"use client";

import { useEffect, useState } from "react";

interface ErrorComponentProps {
  error?: Error;
  onRetry?: () => void;
  showDetails?: boolean;
}

export default function ErrorComponent({
  error,
  onRetry,
  showDetails = false,
}: ErrorComponentProps = {}) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (isRetrying) return;

    setIsRetrying(true);

    try {
      if (onRetry) {
        await onRetry();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("재시도 실패:", err);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    if (error) {
      console.error("POS 시스템 에러:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  }, [error]);

  const getErrorMessage = () => {
    if (error?.message.includes("시간 초과")) {
      return "네트워크 연결이 불안정합니다. 인터넷 연결을 확인해주세요.";
    }
    if (error?.message.includes("HTTP 404")) {
      return "메뉴 데이터를 찾을 수 없습니다. 관리자에게 문의하세요.";
    }
    if (error?.message.includes("HTTP 500")) {
      return "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
    return "시스템 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-8xl mb-6">⚠️</div>

        <h1 className="text-3xl font-bold text-red-800 mb-4">시스템 오류</h1>

        <p className="text-red-600 mb-6 text-lg leading-relaxed">
          {getErrorMessage()}
        </p>

        {showDetails && error && (
          <details className="mb-6 text-left bg-gray-100 p-4 rounded-lg">
            <summary className="cursor-pointer font-medium text-gray-700">
              에러 상세 정보
            </summary>
            <pre className="mt-2 text-xs text-gray-600 overflow-auto">
              {error.stack || error.message}
            </pre>
          </details>
        )}

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`w-full px-8 py-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
              isRetrying
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700 shadow-lg"
            }`}
          >
            {isRetrying ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                재시도 중...
              </span>
            ) : (
              "다시 시도"
            )}
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>

        <div className="mt-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>긴급 상황시:</strong> 관리자에게 연락하거나 시스템을
            재시작하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
