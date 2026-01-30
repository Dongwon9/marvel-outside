import { useState } from "react";
import { Edit2, Trash2, X } from "lucide-react";

import { updateBoard, deleteBoard, type Board } from "../api/boards";
import { ApiError } from "../api/errors";

interface BoardEditModalProps {
  board: Board;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BoardEditModal({
  board,
  onClose,
  onSuccess,
}: BoardEditModalProps) {
  const [formData, setFormData] = useState({
    name: board.name,
    description: board.description || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateBoard(board.id, formData);
      alert("게시판이 수정되었습니다.");
      onSuccess?.();
      onClose();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "게시판 수정에 실패했습니다.";
      setError(message);
      console.error("Failed to update board:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">게시판 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              게시판 이름
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? "저장 중..." : "저장"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface BoardActionsProps {
  board: Board;
  onDeleted?: () => void;
}

export function BoardActions({ board, onDeleted }: BoardActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteBoard(board.id);
      alert("게시판이 삭제되었습니다.");
      onDeleted?.();
    } catch (err) {
      console.error("Failed to delete board:", err);
      alert("게시판 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
        >
          <Edit2 className="h-4 w-4" />
          수정
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          삭제
        </button>
      </div>

      {isEditModalOpen && (
        <BoardEditModal
          board={board}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </>
  );
}
