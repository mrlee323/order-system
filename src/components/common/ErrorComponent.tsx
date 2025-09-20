const ErrorComponent = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg font-medium">
          데이터를 불러오는데 실패했습니다
        </p>
        <p className="text-red-500 text-sm mt-2">잠시 후 다시 시도해주세요</p>
      </div>
    </div>
  );
};

export default ErrorComponent;
