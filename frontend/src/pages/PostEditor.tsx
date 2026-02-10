import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getPostById, updatePost } from "../api/posts";
import MarkdownEditor from "../components/MarkdownEditor";
import { Button, Input } from "../components/ui";
import { useToast } from "../hooks/useToast";

interface PostForm {
  title: string;
  content: string;
}

export default function PostEditor() {
  const { id: postId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState<PostForm>({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // 게시글 불러오기
  useEffect(() => {
    if (postId) {
      void getPostById(postId)
        .then((data) => {
          setForm({
            title: data.title,
            content: data.content,
          });
        })
        .catch((err) => {
          console.error("Failed to load post:", err);
          addToast("게시글을 불러올 수 없습니다.", "error");
        });
    }
  }, [postId, addToast]);

  // 자동 저장 로직 (3초 디바운스)
  useEffect(() => {
    if (!postId) return;

    // 기존 타이머 클리어
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // 새로운 타이머 설정
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        await updatePost(postId, form);
        addToast("저장됨", "success");
      } catch (err) {
        console.error("Save error:", err);
        addToast("저장 실패", "error");
      }
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [form, postId, addToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!postId) {
        addToast("게시글을 찾을 수 없습니다.", "error");
        return;
      }

      await updatePost(postId, form);
      addToast("게시글이 수정되었습니다.", "success");
      void navigate(`/post/${postId}`);
    } catch (err) {
      console.error("Save error:", err);
      addToast("게시글 수정에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">게시글 수정</h1>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
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
            {loading ? "수정 중..." : "수정"}
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
