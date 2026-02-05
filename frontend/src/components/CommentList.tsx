import { useEffect, useState } from "react";

import {
  getCommentsByPost,
  getMyComment,
  type CommentResponse,
} from "../api/comments";
import { useAuth } from "../context/AuthContextDef";

import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [myComment, setMyComment] = useState<CommentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComments = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [allComments, userComment] = await Promise.all([
        getCommentsByPost(postId),
        user ? getMyComment(postId) : Promise.resolve(null),
      ]);
      const filteredComments = allComments.filter(
        (comment) => comment.authorId !== user?.id,
      );
      setComments(filteredComments);
      setMyComment(userComment);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "댓글을 불러올 수 없습니다.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, user?.id]);

  const handleCommentCreated = () => {
    void loadComments();
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">댓글 로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">
        댓글 ({comments.length + (myComment ? 1 : 0)})
      </h2>

      {error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {user && !myComment && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-700">댓글 작성</h3>
          <CommentForm postId={postId} onSuccess={handleCommentCreated} />
        </div>
      )}

      {myComment && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-gray-700">내 댓글</h3>
          <CommentItem
            comment={myComment}
            onCommentUpdated={handleCommentCreated}
          />
        </div>
      )}

      {comments.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">모든 댓글</h3>
          {comments.map((comment) => (
            <CommentItem
              key={`${comment.postId}-${comment.authorId}`}
              comment={comment}
              onCommentUpdated={handleCommentCreated}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">아직 댓글이 없습니다.</p>
      )}
    </div>
  );
}
