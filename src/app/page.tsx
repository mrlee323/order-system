export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold mb-4">Order System</h1>
      <p className="text-gray-600">
        매장 주문 시스템입니다. 태블릿과 모바일에서 모두 사용할 수 있습니다.
      </p>

      <div className="mt-8 space-x-4">
        <a
          href="/order/1?access=tablet"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          테이블 태블릿 주문
        </a>
        {/* <a
          href="/order/1?access=mobile"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          모바일 주문
        </a> */}
      </div>
    </main>
  );
}
