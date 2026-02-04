import { useState } from "react";
import { deleteComment, type CommentResponse } from "../api/comments";
import CommentForm from "./CommentForm";
import { useAuth } from "../context/AuthContextDef";

interface CommentItemProps {
  comment: CommentResponse;
  onCommentUpdated: () => void;
}

export default function CommentItem({
  comment,
  onCommentUpdated,
}: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const isOwner = user?.id === comment.authorId;
  const createdAt = new Date(comment.createdAt).toLocaleDateString("ko-KR");

  const handleDelete = () => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    setError("");

    deleteComment(comment.postId)
      .then(() => {
        onCommentUpdated();
      })
      .catch((err) => {
        const message =
          err instanceof Error ? err.message : "댓글 삭제에 실패했습니다.";
        setError(message);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  if (isEditing) {
    return (
      <CommentForm
        postId={comment.postId}
        initialContent={comment.content}
        isEdit
        onSuccess={() => {
          setIsEditing(false);
          onCommentUpdated();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="card-default card-padding-md border-light">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-primary font-medium">{comment.author.name}</p>
          <p className="author-meta">{createdAt}</p>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isDeleting}
              className="action-link-primary"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="action-link-danger"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        )}
      </div>

      {error && <div className="mb-2 text-sm text-red-500">{error}</div>}

      <p className="text-secondary">{comment.content}</p>
    </div>
  );
}
