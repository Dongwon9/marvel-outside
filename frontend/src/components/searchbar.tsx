export default function SearchBar() {
  return (
    <div className="flex w-full gap-2">
      <input
        type="text"
        placeholder="게시글, 사용자 검색..."
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:py-2.5 md:text-base"
      />
      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-700 active:bg-blue-800 md:px-6 md:py-2.5 md:text-base">
        검색
      </button>
    </div>
  );
}
