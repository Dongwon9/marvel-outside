import {
  EllipsisVertical,
  MessageCircle,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import type { PostResponse } from "@/api/posts";
import { formatRelativeTime } from "@/utils/time";

interface PostCardProps extends PostResponse {
  variant?: "card" | "feed";
}

export default function PostCard({
  id,
  title,
  content,
  authorName,
  authorAvatar,
  boardName,
  createdAt,
  updatedAt,
  likes,
  variant = "card",
}: PostCardProps) {
  const displayAvatar = useMemo(() => authorAvatar || "👤", [authorAvatar]);

  const displayTime = useMemo(() => {
    if (variant === "feed" && updatedAt) {
      return formatRelativeTime(updatedAt);
    }
    return formatRelativeTime(createdAt);
  }, [variant, updatedAt, createdAt]);

  const authorSection = (
    <div className="author-section">
      <div className="author-avatar">{displayAvatar}</div>
      <div className="author-info">
        <h3 className="author-name">{authorName}</h3>
        {variant === "feed" && <p className="author-meta">{boardName}</p>}
        <p className="author-meta">{displayTime}</p>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <EllipsisVertical className="h-5 w-5 md:h-6 md:w-6" />
      </button>
    </div>
  );

  const contentSection = (
    <>
      <h4 className="mb-2 text-base font-semibold md:text-lg">{title}</h4>
      <p className="text-tertiary mb-4 md:text-base">{content}</p>
    </>
  );

  const actionSection = (
    <div className="border-top-light flex items-center gap-4 pt-4 md:gap-6">
      <button className="action-icon-button">
        <ThumbsUp className="h-5 w-5" />
        <span>{likes}</span>
      </button>
      <button className="action-icon-button">
        <MessageCircle className="h-5 w-5" />
      </button>
      <button className="action-icon-button ml-auto">
        <Share2 className="lucide-share-2 h-5 w-5" />
        <span className="hidden sm:inline">공유</span>
      </button>
    </div>
  );

  return (
    <Link to={`/post/${id}`} className="block hover:underline">
      <article className="card-elevated card-padding-md">
        {authorSection}
        {contentSection}
        {actionSection}
      </article>
    </Link>
  );
}
