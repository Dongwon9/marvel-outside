export default function SearchBar() {
  return (
    <div className="w-full flex gap-2">
      <input
        type="text"
        placeholder="게시글, 사용자 검색..."
        className="flex-1 px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      <button className="px-4 py-2 md:px-6 md:py-2.5 bg-blue-600 text-white text-sm md:text-base font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors whitespace-nowrap">
        검색
      </button>
    </div>
  );
}
