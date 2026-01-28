import { Link } from "react-router-dom";
import { MoreVertical, ThumbsUp, MessageCircle, Share2 } from "lucide-react";

import type { PostResponse } from "../api/posts";

interface PostCardProps extends PostResponse {
  variant?: "card" | "feed";
}

export default function PostCard({ variant = "card", ...item }: PostCardProps) {
  const {
    id,
    title,
    content,
    authorId,
    authorAvatar,
    createdAt,
    updatedAt,
    likes,
  } = item;

  // comments는 PostResponse에 없으므로 임시값 사용
  const comments = 0;
  const author = authorId;

  if (variant === "feed") {
    return (
      <article className="rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-lg md:rounded-xl md:p-6">
        {/* Author Info */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg md:h-12 md:w-12 md:text-xl">
            {item.authorAvatar || "👤"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-gray-900 md:text-base">
              {item.authorId}
            </h3>
            <p className="text-xs text-gray-500 md:text-sm">
              {item.updatedAt || item.createdAt}
            </p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Content */}
        <h4 className="mb-2 text-base font-semibold md:text-lg">
          {item.title}
        </h4>
        <p className="mb-4 text-sm text-gray-600 md:text-base">
          {item.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4 border-t border-gray-100 pt-4 md:gap-6">
          <button className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-blue-600 md:gap-2 md:text-base">
            <ThumbsUp className="h-5 w-5" />
            <span>{item.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-blue-600 md:gap-2 md:text-base">
            <MessageCircle className="h-5 w-5" />
            <span>{comments}</span>
          </button>
          <button className="ml-auto flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-blue-600 md:gap-2 md:text-base">
            <Share2 className="h-5 w-5" />
            <span className="hidden sm:inline">공유</span>
          </button>
        </div>
      </article>
    );
  }

  return (
    <Link
      to={`/post/${id}`}
      className="block rounded-lg bg-white p-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl md:rounded-xl md:p-6"
    >
      <h2 className="mb-2 line-clamp-1 text-lg font-semibold text-gray-900 md:text-xl">
        {title}
      </h2>
      <p className="mb-4 line-clamp-2 text-sm text-gray-600 md:text-base">
        {content}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-500 md:text-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="font-medium text-gray-700">{author}</span>
          <span>·</span>
          <span>{createdAt}</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {comments}
          </span>
        </div>
      </div>
    </Link>
  );
}
