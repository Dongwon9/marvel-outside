import { Link, useParams } from "react-router-dom";

import MarkdownRenderer from "../components/MarkdownRenderer";

export default function PostView() {
  const { id } = useParams();

  // Mock post data
  const post = {
    title: "첫 번째 게시글",
    content:
      "Marvel Outside에 오신 것을 환영합니다! 이것은 데모 게시글입니다. 실제 데이터는 API 연동 후 표시됩니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    contentFormat: "markdown", // 추가
    author: "김철수",
    authorId: "user123",
    createdAt: "2026-01-20 14:30",
    views: 234,
    likes: 45,
    dislikes: 3,
    board: "자유 게시판",
    boardId: "board1",
  };

  const comments = [
    {
      id: "1",
      author: "이영희",
      content: "좋은 글 감사합니다!",
      createdAt: "1시간 전",
      likes: 5,
    },
    {
      id: "2",
      author: "박민수",
      content: "정말 유익한 정보네요. 많은 도움이 되었습니다.",
      createdAt: "2시간 전",
      likes: 3,
    },
  ];

  return (
    <section className="space-y-4 md:space-y-6">
      {/* Back Button */}
      <Link
        to="/post"
        className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 md:text-base"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
        목록으로
      </Link>

      {/* Post Content */}
      <article className="overflow-hidden rounded-lg bg-white shadow-md md:rounded-xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 md:p-6 lg:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="flex-1 text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">
              {post.title}
            </h1>
            <button className="text-gray-400 transition-colors hover:text-gray-600">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 md:gap-4 md:text-sm">
            <Link
              to={`/board/${post.boardId}`}
              className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-700 transition-colors hover:bg-blue-200"
            >
              {post.board}
            </Link>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <Link
                to={`/user/${post.authorId}`}
                className="font-medium transition-colors hover:text-blue-600"
              >
                {post.author}
              </Link>
            </span>
            <span>·</span>
            <span>{post.createdAt}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              {post.views}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
            {post.contentFormat === "markdown" ? (
              <MarkdownRenderer content={post.content} />
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700 md:text-base">
                {post.content}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <button className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-blue-600 transition-colors hover:bg-blue-100 md:gap-2 md:px-4 md:py-2.5">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="text-sm font-medium md:text-base">
                  {post.likes}
                </span>
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 md:gap-2 md:px-4 md:py-2.5">
                <svg
                  className="h-5 w-5 rotate-180"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="text-sm font-medium md:text-base">
                  {post.dislikes}
                </span>
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 md:gap-2 md:px-4 md:py-2.5">
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="hidden text-sm sm:inline md:text-base">
                공유
              </span>
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md md:rounded-xl">
        <div className="border-b border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-bold md:text-xl">
            댓글 {comments.length}
          </h2>
        </div>

        {/* Comment Form */}
        <div className="border-b border-gray-200 bg-gray-50 p-4 md:p-6">
          <textarea
            placeholder="댓글을 입력하세요..."
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:py-3 md:text-base"
          />
          <div className="mt-3 flex justify-end">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 md:px-6 md:py-2.5 md:text-base">
              댓글 작성
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="divide-y divide-gray-200">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 transition-colors hover:bg-gray-50 md:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200 md:h-10 md:w-10" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 md:text-base">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 md:text-sm">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-700 md:text-base">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <button className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-blue-600 md:text-sm">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {comment.likes}
                    </button>
                    <button className="text-xs text-gray-500 transition-colors hover:text-blue-600 md:text-sm">
                      답글
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post ID Badge (for development) */}
      <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-600 md:text-sm">
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
        게시글 ID: {id}
      </div>
    </section>
  );
}
