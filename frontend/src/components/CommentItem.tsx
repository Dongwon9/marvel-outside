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
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="font-medium text-gray-900">{comment.author.name}</p>
          <p className="text-sm text-gray-500">{createdAt}</p>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isDeleting}
              className="text-sm text-blue-500 hover:text-blue-700 disabled:opacity-50"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        )}
      </div>

      {error && <div className="mb-2 text-sm text-red-500">{error}</div>}

      <p className="text-gray-700">{comment.content}</p>
    </div>
  );
}
