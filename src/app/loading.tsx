export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 animate-pulse">
          M
        </div>
        <div className="text-gray-500">読み込み中...</div>
      </div>
    </div>
  );
}
