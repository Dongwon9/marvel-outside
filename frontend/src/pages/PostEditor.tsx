import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getBoards } from "../api/boards";
import { getPostById, createPost, updatePost } from "../api/posts";
import MarkdownEditor from "../components/MarkdownEditor";
import { Button, Input } from "../components/ui";

interface PostForm {
  title: string;
  content: string;
  boardId: string;
}

interface Board {
  id: string;
  name: string;
}

export default function PostEditor() {
  const { id: postId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(postId);

  const [form, setForm] = useState<PostForm>({
    title: "",
    content: "",
    boardId: "",
  });
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);

  // 편집 모드일 때 기존 게시글 불러오기
  useEffect(() => {
    if (isEditMode && postId) {
      void getPostById(postId)
        .then((data) => {
          setForm({
            title: data.title,
            content: data.content,
            boardId: data.boardId,
          });
        })
        .catch((err) => console.error("Failed to load post:", err));
    }
  }, [isEditMode, postId]);

  // 게시판 목록 불러오기
  useEffect(() => {
    void getBoards()
      .then((data) => setBoards(data))
      .catch((err) => console.error("Failed to load boards:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        if (!postId) {
          alert("게시글 정보를 불러올 수 없습니다.");
          return;
        }
        const saved = await updatePost(postId, form);
        void navigate(`/post/${saved.id}`);
        return;
      }

      const saved = await createPost(form);
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
        <Input
          type="text"
          id="title"
          label="제목"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          placeholder="게시글 제목을 입력하세요"
        />

        {/* 내용 */}
        <div>
          <label className="mb-2 block text-sm font-medium">내용</label>
          <MarkdownEditor
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} variant="primary" size="lg">
            {loading ? "저장 중..." : isEditMode ? "수정" : "작성"}
          </Button>
          <Button
            type="button"
            onClick={() => void navigate(-1)}
            variant="secondary"
            size="lg"
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
