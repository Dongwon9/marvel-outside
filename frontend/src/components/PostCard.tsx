import { Link } from "react-router-dom";
import { MoreVertical, ThumbsUp, MessageCircle, Share2 } from "lucide-react";

import type { PostResponse } from "../api/posts";
import { formatRelativeTime } from "../utils/time";

interface PostCardProps extends PostResponse {
  variant?: "card" | "feed";
}

export default function PostCard({ variant = "card", ...item }: PostCardProps) {
  const {
    id,
    title,
    content,
    authorAvatar,
    createdAt,
    updatedAt,
    authorName,
    likes,
    boardName,
  } = item;

  const relativeUpdatedAt = formatRelativeTime(updatedAt || createdAt);
  const relativeCreatedAt = formatRelativeTime(createdAt);

  // comments는 PostResponse에 없으므로 임시값 사용

  if (variant === "feed") {
    return (
      <article className="card-elevated card-padding-md">
        {/* Author Info */}
        <div className="author-section">
          <div className="author-avatar">{authorAvatar || "👤"}</div>
          <div className="author-info">
            <h3 className="author-name">{authorName}</h3>
            <p className="author-meta">
              {boardName}, {relativeUpdatedAt}
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
        <p className="text-tertiary mb-4 md:text-base">{item.content}</p>

        {/* Actions */}
        <div className="border-top-light flex items-center gap-4 pt-4 md:gap-6">
          <button className="action-icon-button">
            <ThumbsUp className="h-5 w-5" />
            <span>{item.likes}</span>
          </button>
          <button className="action-icon-button">
            <MessageCircle className="h-5 w-5" />
          </button>
          <button className="action-icon-button ml-auto">
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
      className="card-elevated card-padding-md block transition-all hover:-translate-y-1"
    >
      <h2 className="text-primary mb-2 line-clamp-1 text-lg font-semibold md:text-xl">
        {title}
      </h2>
      <p className="text-tertiary mb-4 line-clamp-2 md:text-base">{content}</p>
      <div className="text-muted flex items-center justify-between text-xs md:text-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-secondary font-medium">{authorName}</span>
          <span>·</span>
          <span>{relativeCreatedAt}</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
