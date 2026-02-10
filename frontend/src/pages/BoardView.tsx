import { BookOpen } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Section } from "@/components/ui";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

import { getBoardById, type Board } from "../api/boards";
import { createPost, getPosts } from "../api/posts";
import PostCard from "../components/PostCard";

export default function BoardView() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [boardPending, setBoardPending] = useState(true);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState("createdAt");
  const navigate = useNavigate();

  // Memoized fetch functions with orderBy dependency
  const fetchInitialMemo = useCallback(
    () => getPosts({ boardId: id, take: 20, skip: 0 }),
    [id],
  );

  const fetchMoreMemo = useCallback(
    (skip: number) => getPosts({ boardId: id, skip, take: 10 }),
    [id],
  );

  // Infinite scroll hook
  const {
    data: posts,
    isLoading,
    isLoadingMore,
    hasMore,
    error: postsError,
    sentinelRef,
  } = useInfiniteScroll({
    fetchInitial: fetchInitialMemo,
    fetchMore: fetchMoreMemo,
    initialSize: 20,
    pageSize: 10,
  });

  // Fetch board data
  useEffect(() => {
    async function fetchBoard() {
      if (!id) {
        alert("유효하지 않은 게시판 ID입니다.");
        void navigate("/");
        return;
      }

      try {
        setBoardError(null);
        const boardData = await getBoardById(id);
        setBoard(boardData);
      } catch (err) {
        setBoardError("게시판 데이터를 불러올 수 없습니다.");
        console.error("Failed to fetch board data:", err);
      } finally {
        setBoardPending(false);
      }
    }

    void fetchBoard();
  }, [id, navigate]);

  const createPostAndEnter = async () => {
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
  };

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

      {/* Sort Options */}
      {!boardPending && !boardError && (
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium">
            정렬:
          </label>
          <select
            id="sort"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="createdAt">최신순</option>
            <option value="hits">조회순</option>
          </select>
        </div>
      )}

      {/* Loading State */}
      {boardPending && isLoading && (
        <div className="card-default card-padding-lg flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="text-muted md:text-base">게시판을 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {boardError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 md:p-6">
          <p className="text-sm text-red-700 md:text-base">{boardError}</p>
        </div>
      )}

      {postsError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 md:p-6">
          <p className="text-sm text-red-700 md:text-base">
            게시글을 불러올 수 없습니다.
          </p>
        </div>
      )}

      {/* Posts Grid */}
      {!boardPending && !boardError && (
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      )}

      {/* Sentinel Element for Infinite Scroll */}
      {!boardPending && !boardError && hasMore && (
        <div ref={sentinelRef} className="h-2 w-full" />
      )}

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-8">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      )}

      {/* Empty State */}
      {!boardPending && !boardError && posts.length === 0 && (
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
