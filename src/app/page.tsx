export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold mb-4">POS & QR Ordering System</h1>
      <p className="text-gray-600">
        매장 단말(POS)과 테이블 QR 주문 시스템을 위한 프론트엔드 프로젝트입니다.
      </p>

      <div className="mt-8 space-x-4">
        <a
          href="/order/pos/1"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          POS 모드
        </a>
        <a
          href="/order/qr/store123/1"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          QR 모드
        </a>
      </div>
    </main>
  );
}
