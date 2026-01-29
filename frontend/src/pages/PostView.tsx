import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  MoreVertical,
  User,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Share2,
  FileText,
} from "lucide-react";

import MarkdownRenderer from "../components/MarkdownRenderer";

export default function PostView() {
  const { id } = useParams();

  // Mock post data
  const post = {
    title: "첫 번째 게시글",
    content:
      "Marvel Outside에 오신 것을 환영합니다! 이것은 데모 게시글입니다. 실제 데이터는 API 연동 후 표시됩니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
        <ChevronLeft className="h-5 w-5" />
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
              <MoreVertical className="h-6 w-6" />
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
              <User className="h-4 w-4" />
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
              <Eye className="h-4 w-4" />
              {post.views}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <button className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-blue-600 transition-colors hover:bg-blue-100 md:gap-2 md:px-4 md:py-2.5">
                <ThumbsUp className="h-5 w-5" />
                <span className="text-sm font-medium md:text-base">
                  {post.likes}
                </span>
              </button>
              <button className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 md:gap-2 md:px-4 md:py-2.5">
                <ThumbsDown className="h-5 w-5" />
                <span className="text-sm font-medium md:text-base">
                  {post.dislikes}
                </span>
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 md:gap-2 md:px-4 md:py-2.5">
              <Share2 className="h-5 w-5" />
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
                      <ThumbsUp className="h-4 w-4" />
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
        <FileText className="h-4 w-4" />
        게시글 ID: {id}
      </div>
    </section>
  );
}
