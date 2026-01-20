export default function Feed() {
  // Mock feed data
  const mockFeed = [
    {
      id: "1",
      author: "김철수",
      authorAvatar: "👤",
      title: "오늘의 일상",
      content: "오늘 날씨가 정말 좋네요! 산책하기 딱 좋은 날입니다.",
      timestamp: "2시간 전",
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      author: "이영희",
      authorAvatar: "👤",
      title: "새로운 프로젝트 시작",
      content: "드디어 새로운 프로젝트를 시작했습니다. 열심히 해보겠습니다!",
      timestamp: "5시간 전",
      likes: 18,
      comments: 5,
    },
  ];

  return (
    <section className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">피드</h1>
        <button className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
          새로고침
        </button>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {mockFeed.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg md:text-xl">
                {item.authorAvatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                  {item.author}
                </h3>
                <p className="text-xs md:text-sm text-gray-500">
                  {item.timestamp}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <h4 className="text-base md:text-lg font-semibold mb-2">
              {item.title}
            </h4>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              {item.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 md:gap-6 pt-4 border-t border-gray-100">
              <button className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base text-gray-600 hover:text-blue-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>{item.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base text-gray-600 hover:text-blue-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{item.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base text-gray-600 hover:text-blue-600 transition-colors ml-auto">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="hidden sm:inline">공유</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {mockFeed.length === 0 && (
        <div className="bg-white rounded-lg md:rounded-xl p-8 md:p-12 text-center shadow-md">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">
            피드가 비어있습니다
          </h3>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            다른 사용자를 팔로우하여 피드를 채워보세요!
          </p>
        </div>
      )}
    </section>
  );
}
