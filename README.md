# 📌 POS & QR Ordering System (Frontend Project)

## 📖 개요

이 프로젝트는 **매장 단말 POS 모드**와 **테이블 QR 모드**를 지원하는 **주문/결제 시스템**입니다.

- **POS 모드 (PWA)**: 매장 내 단말기(PWA 설치)에서 메뉴 선택 + 결제
- **QR 모드**: 고객이 테이블 QR로 진입해 메뉴 선택 + 결제
- 공통 컴포넌트를 사용하되 **반응형 레이아웃**으로 UI 최적화

**주요 차별점**

- POS 모드: 오프라인 모드 지원 (IndexedDB pending 주문 저장 → 복구 시 동기화)
- QR 모드: 항상 온라인 전제, 모바일 UX 최적화

---

## 🚀 주요 기능

- **메뉴 선택 & 장바구니**: 상품 담기/삭제/수량 변경
- **쿠폰 & 프로모션 적용**: 할인 로직 반영
- **결제 플로우**
  - POS: 네트워크 상태 감지 → 온라인/오프라인 분기
  - QR: 온라인 결제 플로우
  - 실패 케이스 고려 (승인 실패, 네트워크 끊김 등)
- **오프라인 모드 (POS)**
  - 메뉴 캐싱 (Service Worker)
  - 주문 pending 상태 저장 (IndexedDB)
  - 복구 시 자동 동기화

---

## 🛠️ 기술 스택

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Data Fetching**: React Query
- **UI**: TailwindCSS + shadcn/ui
- **PWA**: next-pwa + Service Worker
- **Local DB**: IndexedDB (idb)
- **Testing**: Vitest + React Testing Library + jest-dom

---

## ⚙️ 설치 및 실행

```bash
# 프로젝트 생성
npx create-next-app@latest pos-qr-system --typescript --eslint
cd pos-qr-system

# 의존성 설치
npm install zustand @tanstack/react-query next-pwa idb lucide-react recharts
npm install -D tailwindcss postcss autoprefixer vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest
npx tailwindcss init -p
npx shadcn-ui@latest init

# 개발 서버 실행
npm run dev

# 테스트 실행
npm run test
```
