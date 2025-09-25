# 📌 Order System (Frontend Project)

## 📖 개요

이 프로젝트는 **태블릿 키오스크**와 **모바일 주문**을 지원하는 **통합 주문 시스템**입니다.

- **태블릿 주문**: 테이블에 놓인 태블릿으로 고객이 직접 주문
- **모바일 주문**: 고객이 QR 스캔해서 자신의 모바일로 주문
- 공통 컴포넌트를 사용하되 **반응형 레이아웃**으로 UI 최적화

**주요 차별점**

- 태블릿 주문: 큰 화면, 터치 친화적 인터페이스
- 모바일 주문: 작은 화면, 모바일 UX 최적화

## 🌐 배포 주소

**실제 서비스**: [https://order-system-lovat.vercel.app/](https://order-system-lovat.vercel.app/)

- 태블릿과 모바일에서 모두 사용 가능
- QR 코드 스캔을 통한 모바일 주문 지원

---

## 🚀 주요 기능

- **메뉴 선택 & 장바구니**: 상품 담기/삭제/수량 변경
- **쿠폰 & 프로모션 적용**: 할인 로직 반영
- **결제 플로우**
  - 태블릿: 카드 결제, 현금 결제
  - 모바일: 앱카드, 간편결제
  - 실패 케이스 고려 (승인 실패, 네트워크 끊김 등)
- **오프라인 모드**
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
npx create-next-app@latest order-system --typescript --eslint
cd order-system

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
