import type { FormEvent } from "react";
import { useState } from "react";

import {
  createComment,
  updateComment,
  type CommentForm as ICommentForm,
} from "../api/comments";

interface CommentFormProps {
  postId: string;
  initialContent?: string;
  isEdit?: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function CommentForm({
  postId,
  initialContent = "",
  isEdit = false,
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    const performSubmit = async () => {
      try {
        const form: ICommentForm = { content };

        if (isEdit) {
          await updateComment(postId, form);
        } else {
          await createComment(postId, form);
        }

        setContent("");
        onSuccess();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "댓글 작성에 실패했습니다.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void performSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-default card-padding-md border-light space-y-3"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력해주세요..."
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        rows={3}
        disabled={isLoading}
      />

      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="text-tertiary rounded px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "작성 중..." : isEdit ? "수정" : "댓글 작성"}
        </button>
      </div>
    </form>
  );
}
