import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getPostById,
  saveDraftPost,
  publishDraftPost,
  discardDraft,
} from "@/api/posts";
import MarkdownEditor from "@/components/MarkdownEditor";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

interface PostForm {
  title: string;
  content: string;
}

export default function PostEditor() {
  const { id: postId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState<PostForm>({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 게시글 불러오기
  useEffect(() => {
    if (!postId) {
      return;
    }
    void getPostById(postId)
      .then((data) => {
        if (data.authorId !== user?.id) {
          addToast("작성자가 아닙니다.", "error");
          void navigate(-1);
          return;
        }

        const published = data.publishedAt != null;
        setIsPublished(published);

        // 공개 게시글이면 draft 필드 우선 사용
        if (published) {
          setForm({
            title: data.draftTitle ?? data.title,
            content: data.draftContent ?? data.content,
          });
        } else {
          setForm({
            title: data.title,
            content: data.content,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load post:", err);
        addToast("게시글을 불러올 수 없습니다.", "error");
      });
  }, [postId, addToast, user?.id, navigate]);

  // 자동 저장 로직 (3초 디바운스)
  useEffect(() => {
    if (!postId) return;

    // 기존 타이머 클리어
    if (autoSaveTimeoutRef.current !== null) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // 새로운 타이머 설정
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveDraftPost(postId, form);
        addToast("저장됨", "success");
      } catch (err) {
        console.error("Save error:", err);
        addToast("저장 실패", "error");
      }
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current !== null) {
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

      await saveDraftPost(postId, form);
      addToast("임시 저장되었습니다.", "success");
      void navigate(`/post/${postId}`);
    } catch (err) {
      console.error("Save error:", err);
      addToast("게시글 저장에 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishLoading(true);

    try {
      if (!postId) {
        addToast("게시글을 찾을 수 없습니다.", "error");
        return;
      }

      // 먼저 현재 내용을 draft로 저장한 후 게시
      await saveDraftPost(postId, form);
      await publishDraftPost(postId);
      addToast(
        isPublished ? "수정본이 게시되었습니다." : "게시글이 공개되었습니다.",
        "success",
      );
      void navigate(`/post/${postId}`);
    } catch (err) {
      console.error("Publish error:", err);
      addToast("게시글 공개에 실패했습니다.", "error");
    } finally {
      setPublishLoading(false);
    }
  };

  const handleDiscardDraft = async () => {
    if (!postId) return;
    if (!confirm("임시 수정본을 폐기하시겠습니까? 공개 버전으로 되돌립니다.")) {
      return;
    }

    try {
      const data = await discardDraft(postId);
      setForm({ title: data.title, content: data.content });
      addToast("수정본이 폐기되었습니다.", "success");
    } catch (err) {
      console.error("Discard error:", err);
      addToast("수정본 폐기에 실패했습니다.", "error");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isPublished ? "게시글 수정" : "게시글 초안 편집"}
        </h1>
        {isPublished && (
          <p className="text-tertiary mt-1 text-sm">
            수정 내용은 &quot;게시&quot;하기 전까지 공개 버전에 반영되지
            않습니다.
          </p>
        )}
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
            {loading ? "저장 중..." : "임시 저장"}
          </Button>
          <Button
            type="button"
            onClick={() => void handlePublish()}
            disabled={publishLoading}
            variant="primary"
            size="lg"
          >
            {publishLoading ? "게시 중..." : "게시"}
          </Button>
          {isPublished && (
            <Button
              type="button"
              onClick={() => void handleDiscardDraft()}
              variant="secondary"
              size="lg"
            >
              수정본 폐기
            </Button>
          )}
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
