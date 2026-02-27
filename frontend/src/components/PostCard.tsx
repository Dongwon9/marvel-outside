import {
  EllipsisVertical,
  MessageCircle,
  Pencil,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { PostResponse } from "@/api/posts";
import { useAuth } from "@/hooks/useAuth";
import { formatRelativeTime } from "@/utils/time";

interface PostCardProps extends PostResponse {
  variant?: "card" | "feed";
}

export default function PostCard({
  id,
  title,
  authorId,
  authorName,
  boardName,
  createdAt,
  updatedAt,
  likeCount,
  dislikeCount,
  hasDraft,
  variant = "card",
}: PostCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isAuthor = user?.id === authorId;

  const displayTime = useMemo(() => {
    if (variant === "feed" && updatedAt) {
      return formatRelativeTime(updatedAt);
    }
    return formatRelativeTime(createdAt);
  }, [variant, updatedAt, createdAt]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    void navigate(`/post/${id}/edit`);
  };

  const authorSection = (
    <div className="author-section">
      <div className="author-info">
        <h3 className="author-name">{authorName}</h3>
        <p className="author-meta">{boardName}</p>
        <p className="author-meta">{displayTime}</p>
      </div>
      {isAuthor ? (
        <div ref={menuRef} className="relative">
          <button
            onClick={handleMenuToggle}
            className="text-gray-400 hover:text-gray-600"
          >
            <EllipsisVertical className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-32 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button
                onClick={handleEdit}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Pencil className="h-4 w-4" />
                수정
              </button>
            </div>
          )}
        </div>
      ) : (
        <button className="text-gray-400 hover:text-gray-600">
          <EllipsisVertical className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}
    </div>
  );

  const contentSection = (
    <>
      <div className="mb-2 flex items-center gap-2">
        <h4 className="text-base font-semibold md:text-lg">{title}</h4>
        {isAuthor && hasDraft && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            수정본
          </span>
        )}
      </div>
    </>
  );

  const actionSection = (
    <div className="border-top-light flex items-center gap-4 pt-4 md:gap-6">
      <button className="action-icon-button">
        <ThumbsUp className="h-5 w-5" />
        <span>{likeCount}</span>
      </button>
      <button className="action-icon-button">
        <ThumbsDown className="h-5 w-5" />
        <span>{dislikeCount}</span>
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
        {contentSection}
        {authorSection}
        {actionSection}
      </article>
    </Link>
  );
}
