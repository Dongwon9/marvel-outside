import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getBoards } from "../api/boards";
import {
  getPostById,
  createPost,
  saveDraftPost,
  publishDraftPost,
} from "../api/posts";
import MarkdownEditor from "../components/MarkdownEditor";
import { Button, Input } from "../components/ui";
import { useToast } from "../hooks/useToast";

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
  const { addToast } = useToast();

  const [form, setForm] = useState<PostForm>({
    title: "",
    content: "",
    boardId: "",
  });
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [draftPostId, setDraftPostId] = useState<string | null>(postId || null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

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
        .catch((err) => {
          console.error("Failed to load post:", err);
          addToast("게시글을 불러올 수 없습니다.", "error");
        });
    }
  }, [isEditMode, postId, addToast]);

  // 게시판 목록 불러오기
  useEffect(() => {
    void getBoards()
      .then((data) => setBoards(data))
      .catch((err) => {
        console.error("Failed to load boards:", err);
        addToast("게시판 목록을 불러올 수 없습니다.", "error");
      });
  }, [addToast]);

  // 신규 작성 모드에서 draft 생성
  useEffect(() => {
    if (!isEditMode && !draftPostId && boards.length > 0 && form.boardId) {
      void createPost({ title: "", content: "", boardId: form.boardId })
        .then((data) => {
          setDraftPostId(data.id);
        })
        .catch((err) => {
          console.error("Failed to create draft:", err);
          addToast("임시 저장을 초기화할 수 없습니다.", "error");
        });
    }
  }, [isEditMode, draftPostId, boards, form.boardId, addToast]);

  // 자동 저장 로직 (3초 디바운스)
  useEffect(() => {
    if (!draftPostId || isEditMode) return;

    // 기존 타이머 클리어
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // 새로운 타이머 설정
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsAutoSaving(true);
        await saveDraftPost(draftPostId, form);
        addToast("임시저장됨", "success");
      } catch (e) {
        try {
          await createPost(form);
          addToast("임시저장됨", "success");
        } catch (err) {
          console.error("Auto-save error:", err);
          addToast("임시저장 실패", "error");
        }
      } finally {
        setIsAutoSaving(false);
      }
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [form, draftPostId, isEditMode, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode && postId) {
        // 발행 모드
        const published = await publishDraftPost(postId);
        addToast("게시글이 발행되었습니다.", "success");
        void navigate(`/post/${published.id}`);
        return;
      }

      if (draftPostId) {
        // 신규 작성 모드: draft를 발행
        const published = await publishDraftPost(draftPostId);
        addToast("게시글이 발행되었습니다.", "success");
        void navigate(`/post/${published.id}`);
        return;
      }

      addToast("게시글을 발행할 수 없습니다.", "error");
    } catch (err) {
      console.error("Save error:", err);
      addToast("게시글 발행에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "게시글 수정" : "새 게시글 작성"}
        </h1>
        {isAutoSaving && (
          <span className="text-sm text-gray-500">저장 중...</span>
        )}
      </div>

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
          <Button
            type="submit"
            disabled={loading || !draftPostId}
            variant="primary"
            size="lg"
          >
            {loading ? "발행 중..." : isEditMode ? "수정" : "작성"}
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
