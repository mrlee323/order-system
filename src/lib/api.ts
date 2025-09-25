import { MenuResponse } from "./types/menu";
import { ResponseItemBase, ResponseListBase } from "./types/common";
import { Store } from "./types/store";

const API_CONFIG = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = API_CONFIG.timeout
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchWithRetry(url: string, options: RequestInit = {}) {
  let lastError: Error;

  for (let attempt = 1; attempt <= API_CONFIG.retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      if (attempt < API_CONFIG.retries) {
        const delay = API_CONFIG.retryDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

export async function fetchMenu(storeId: string): Promise<MenuResponse> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/menu`;

    const res = await fetchWithRetry(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    const data: ResponseListBase<MenuResponse> = await res.json();

    if (data.code !== 200) {
      throw new Error("유효하지 않은 메뉴 데이터 형식입니다.");
    }

    return data.items;
  } catch (error) {
    console.error("메뉴 데이터 로딩 실패:", error);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          "메뉴 데이터 로딩 시간 초과 - 네트워크를 확인해주세요."
        );
      }
      throw new Error(`메뉴 데이터를 불러올 수 없습니다: ${error.message}`);
    }

    throw new Error("메뉴 데이터를 불러올 수 없습니다.");
  }
}

export async function fetchStore(storeId: string): Promise<Store> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/store/${storeId}  `;

    const res = await fetchWithRetry(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    const data: ResponseItemBase<Store> = await res.json();

    return data.item;
  } catch (error) {
    console.error("스토어 데이터 로딩 실패:", error);

    throw new Error("스토어 데이터를 불러올 수 없습니다.");
  }
}
