import { Link, useParams } from "react-router-dom";

export default function BoardView() {
  const { id } = useParams();

  // Mock board data
  const boardData = {
    name: "자유 게시판",
    description: "자유롭게 이야기를 나누는 공간입니다",
    postCount: 128,
    memberCount: 256,
  };

  const mockPosts = [
    {
      id: "1",
      title: "보드에 오신 것을 환영합니다",
      author: "관리자",
      createdAt: "2026-01-20",
      views: 145,
      likes: 23,
      comments: 12,
    },
    {
      id: "2",
      title: "자유 게시판 이용 안내",
      author: "운영자",
      createdAt: "2026-01-19",
      views: 98,
      likes: 15,
      comments: 8,
    },
  ];

  return (
    <section className="space-y-4 md:space-y-6">
      {/* Board Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg md:rounded-xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {boardData.name}
            </h1>
            <p className="text-sm md:text-base text-purple-50 mb-4 md:mb-0">
              {boardData.description}
            </p>
          </div>
          <Link
            to="/post/new"
            className="px-4 py-2.5 md:px-6 md:py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors text-center whitespace-nowrap"
          >
            + 글쓰기
          </Link>
        </div>
        <div className="flex items-center gap-4 md:gap-6 mt-4 pt-4 border-t border-purple-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm md:text-base">
              게시글 {boardData.postCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span className="text-sm md:text-base">
              멤버 {boardData.memberCount}
            </span>
          </div>
        </div>
      </div>

      {/* Board ID Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
        보드 ID: {id}
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-600">
                  제목
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-600">
                  작성자
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-600">
                  작성일
                </th>
                <th className="px-4 py-3 text-center text-xs md:text-sm font-medium text-gray-600">
                  조회
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-center text-xs md:text-sm font-medium text-gray-600">
                  좋아요
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <Link
                      to={`/post/${post.id}`}
                      className="text-sm md:text-base text-gray-900 hover:text-blue-600 font-medium line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 sm:hidden">
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-4 py-4 text-sm text-gray-600">
                    {post.author}
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 text-sm text-gray-600">
                    {post.createdAt}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 text-center">
                    {post.views}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-4 text-sm text-gray-600 text-center">
                    {post.likes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button className="px-3 py-2 text-sm md:text-base text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          이전
        </button>
        <button className="px-3 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg">
          1
        </button>
        <button className="px-3 py-2 text-sm md:text-base text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          2
        </button>
        <button className="px-3 py-2 text-sm md:text-base text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          3
        </button>
        <button className="px-3 py-2 text-sm md:text-base text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          다음
        </button>
      </div>
    </section>
  );
}
