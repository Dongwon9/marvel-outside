import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import MarkdownEditor from "../components/MarkdownEditor";

interface PostForm {
  title: string;
  content: string;
  boardId: string;
  contentFormat: "markdown" | "plaintext";
}

interface Board {
  id: string;
  name: string;
}

interface PostResponse {
  id: string;
  title: string;
  content: string;
  boardId: string;
  contentFormat: string;
}

export default function PostEditor() {
  const { id: postId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(postId);

  const [form, setForm] = useState<PostForm>({
    title: "",
    content: "",
    boardId: "",
    contentFormat: "markdown",
  });
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);

  // 편집 모드일 때 기존 게시글 불러오기
  useEffect(() => {
    if (isEditMode && postId) {
      fetch(`/api/posts/${postId}`)
        .then((res) => res.json())
        .then((data: PostResponse) => {
          setForm({
            title: data.title,
            content: data.content,
            boardId: data.boardId,
            contentFormat:
              (data.contentFormat as "markdown" | "plaintext") || "markdown",
          });
        })
        .catch((err) => console.error("Failed to load post:", err));
    }
  }, [isEditMode, postId]);

  // 게시판 목록 불러오기
  useEffect(() => {
    fetch("/api/boards")
      .then((res) => res.json())
      .then((data: Board[]) => setBoards(data))
      .catch((err) => console.error("Failed to load boards:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode ? `/api/posts/${postId}` : "/api/posts";
      const method = isEditMode ? "PATCH" : "POST";

      const body = isEditMode ? form : { ...form, authorId: "current-user-id" }; // TODO: 실제 사용자 ID로 교체

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save post");

      const saved = (await response.json()) as PostResponse;
      void navigate(`/post/${saved.id}`);
    } catch (err) {
      console.error("Save error:", err);
      alert("게시글 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        {isEditMode ? "게시글 수정" : "새 게시글 작성"}
      </h1>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        {/* 게시판 선택 */}
        <div>
          <label htmlFor="board" className="mb-2 block text-sm font-medium">
            게시판
          </label>
          <select
            id="board"
            value={form.boardId}
            onChange={(e) => setForm({ ...form, boardId: e.target.value })}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">게시판을 선택하세요</option>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 */}
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="게시글 제목을 입력하세요"
          />
        </div>

        {/* 포맷 선택 */}
        <div>
          <label className="mb-2 block text-sm font-medium">콘텐츠 형식</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="markdown"
                checked={form.contentFormat === "markdown"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contentFormat: e.target.value as "markdown",
                  })
                }
                className="mr-2"
              />
              마크다운
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="plaintext"
                checked={form.contentFormat === "plaintext"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contentFormat: e.target.value as "plaintext",
                  })
                }
                className="mr-2"
              />
              일반 텍스트
            </label>
          </div>
        </div>

        {/* 내용 */}
        <div>
          <label className="mb-2 block text-sm font-medium">내용</label>
          {form.contentFormat === "markdown" ? (
            <MarkdownEditor
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
            />
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={15}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="내용을 입력하세요"
            />
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "저장 중..." : isEditMode ? "수정" : "작성"}
          </button>
          <button
            type="button"
            onClick={() => void navigate(-1)}
            className="rounded-md bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
