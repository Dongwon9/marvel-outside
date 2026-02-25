import { Link } from "react-router-dom";

import { formatRelativeTime } from "@/utils/time";
import { Card } from "@/components/ui";

interface Post {
  id: string;
  title: string;
  boardName: string;
  createdAt: string;
  views: number;
  comments: number;
}

interface LikedPostsListProps {
  posts: Post[];
  isLoading?: boolean;
}

export default function LikedPostsList({
  posts,
  isLoading,
}: LikedPostsListProps) {
  if (isLoading) {
    return (
      <Card variant="default" padding="md">
        <p className="text-muted text-center">로딩 중...</p>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card variant="default" padding="md">
        <p className="text-muted py-8 text-center">
          좋아요한 게시글이 없습니다.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {posts.map((post) => (
        <Card
          key={post.id}
          variant="outlined"
          padding="sm"
          className="transition-shadow hover:shadow-md"
        >
          <Link
            to={`/post/${post.id}`}
            className="block space-y-2 md:space-y-3"
          >
            <h3 className="text-primary text-base font-semibold transition-colors hover:text-blue-600 md:text-lg">
              {post.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
              <span className="text-muted">{post.boardName}</span>
              <span className="text-muted">·</span>
              <span className="text-muted">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>
            <div className="text-tertiary flex flex-wrap items-center gap-3 text-xs md:text-sm">
              <span>조회 {post.views}</span>
              <span>댓글 {post.comments}</span>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}
