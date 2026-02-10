import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Section } from "@/components/ui";

import { getBoardById, type Board } from "../api/boards";
import { createPost, getPosts, type PostResponse } from "../api/posts";
import PostCard from "../components/PostCard";

export default function BoardView() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBoardData() {
      if (!id) {
        alert("유효하지 않은 게시판 ID입니다.");
        void navigate("/");
        return;
      }

      try {
        setError(null);
        const [boardData, postsData] = await Promise.all([
          getBoardById(id),
          getPosts({ boardId: id }),
        ]);
        setBoard(boardData);
        setPosts(postsData);
      } catch (err) {
        setError("게시판 데이터를 불러올 수 없습니다.");
        console.error("Failed to fetch board data:", err);
      } finally {
        setIsPending(false);
      }
    }

    void fetchBoardData();
  }, [id, navigate]);

  async function createPostAndEnter() {
    if (!id) return;
    try {
      const postId = await createPost({ boardId: id, title: "", content: "" });
      void navigate(`/post/${postId}/edit`);
    } catch (err) {
      console.error("Failed to create post:", err);
      if (err instanceof Error) {
        alert(`게시글 생성에 실패했습니다: ${err.message}`);
      } else {
        alert("게시글 생성에 실패했습니다.");
      }
    }
  }

  return (
    <Section>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          {board && (
            <>
              <h1 className="text-2xl font-bold md:text-3xl">{board.name}</h1>
              {board.description && (
                <p className="text-tertiary mt-1 text-sm md:text-base">
                  {board.description}
                </p>
              )}
            </>
          )}
        </div>
        <Button
          onClick={() => void createPostAndEnter()}
          variant="primary"
          size="md"
        >
          + 글쓰기
        </Button>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="card-default card-padding-lg flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="text-muted md:text-base">게시판을 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 md:p-6">
          <p className="text-sm text-red-700 md:text-base">{error}</p>
        </div>
      )}

      {/* Posts Grid */}
      {!isPending && !error && (
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isPending && !error && posts.length === 0 && (
        <div className="card-default card-padding-lg text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 md:h-20 md:w-20">
            <BookOpen className="h-8 w-8 text-gray-400 md:h-10 md:w-10" />
          </div>
          <h3 className="text-primary mb-2 text-lg font-semibold md:text-xl">
            게시글이 없습니다
          </h3>
          <p className="text-tertiary mb-6 text-sm md:text-base">
            첫 번째 게시글을 작성해보세요!
          </p>
          <Button
            onClick={() => void createPostAndEnter()}
            variant="primary"
            className="inline-block"
          >
            게시글 작성하기
          </Button>
        </div>
      )}
    </Section>
  );
}
