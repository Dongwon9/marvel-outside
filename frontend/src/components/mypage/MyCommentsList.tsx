import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { formatRelativeTime } from "@/utils/time";
import { Card, IconButton } from "@/components/ui";

interface Comment {
  id: string;
  content: string;
  postTitle: string;
  postId: string;
  createdAt: string;
}

interface MyCommentsListProps {
  comments: Comment[];
  isLoading?: boolean;
  onDeleteComment?: (commentId: string) => void;
}

export default function MyCommentsList({
  comments,
  isLoading,
  onDeleteComment,
}: MyCommentsListProps) {
  if (isLoading) {
    return (
      <Card variant="default" padding="md">
        <p className="text-muted text-center">로딩 중...</p>
      </Card>
    );
  }

  if (comments.length === 0) {
    return (
      <Card variant="default" padding="md">
        <p className="text-muted text-center py-8">
          작성한 댓글이 없습니다.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {comments.map((comment) => (
        <Card
          key={comment.id}
          variant="outlined"
          padding="sm"
          className="hover:shadow-md transition-shadow"
        >
          <div className="space-y-2 md:space-y-3">
            <p className="text-tertiary text-sm md:text-base line-clamp-2">
              {comment.content}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
              <Link
                to={`/post/${comment.postId}`}
                className="text-secondary hover:text-blue-600 transition-colors"
              >
                {comment.postTitle}
              </Link>
              <span className="text-muted">·</span>
              <span className="text-muted">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>
            {onDeleteComment && (
              <div className="flex justify-end pt-2">
                <IconButton
                  icon={Trash2}
                  onClick={() => onDeleteComment(comment.id)}
                  className="text-red-500 hover:bg-red-50"
                  title="댓글 삭제"
                />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
