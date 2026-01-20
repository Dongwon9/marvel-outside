import { Link } from "react-router-dom";

export default function PostList() {
  // Mock data for demonstration
  const mockPosts = [
    {
      id: "1",
      title: "첫 번째 게시글",
      content: "Marvel Outside에 오신 것을 환영합니다!",
      author: "사용자1",
      createdAt: "2026-01-20",
      likes: 12,
      comments: 5,
    },
    {
      id: "2",
      title: "반응형 디자인 적용 완료",
      content: "모바일과 데스크톱에서 모두 잘 작동합니다.",
      author: "사용자2",
      createdAt: "2026-01-20",
      likes: 8,
      comments: 3,
    },
    {
      id: "3",
      title: "Tailwind CSS 활용하기",
      content: "유틸리티 클래스로 빠르게 UI를 구성할 수 있습니다.",
      author: "사용자3",
      createdAt: "2026-01-19",
      likes: 15,
      comments: 7,
    },
  ];

  return (
    <section className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">게시글 목록</h1>
        <Link
          to="/post/new"
          className="px-4 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white text-sm md:text-base font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-center shadow-md hover:shadow-lg"
        >
          + 새 게시글
        </Link>
      </div>

      {/* Filter/Sort Bar */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 p-3 md:p-4 bg-white rounded-lg shadow-sm">
        <button className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          최신순
        </button>
        <button className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          인기순
        </button>
        <button className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          댓글순
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {mockPosts.map((post) => (
          <Link
            key={post.id}
            to={`/post/${post.id}`}
            className="block bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 line-clamp-1">
              {post.title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2">
              {post.content}
            </p>
            <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="font-medium text-gray-700">{post.author}</span>
                <span>·</span>
                <span>{post.createdAt}</span>
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {post.comments}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {mockPosts.length === 0 && (
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
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">
            게시글이 없습니다
          </h3>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            첫 번째 게시글을 작성해보세요!
          </p>
          <Link
            to="/post/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            게시글 작성하기
          </Link>
        </div>
      )}
    </section>
  );
}
