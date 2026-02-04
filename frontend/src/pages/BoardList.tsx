import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

import { Button } from "../components/ui";
import Section from "../components/ui/Section";
import { getBoards, createBoard, type Board } from "../api/boards";

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBoards() {
      try {
        setError(null);
        const data = await getBoards();
        setBoards(data);
      } catch (err) {
        setError("게시판을 불러올 수 없습니다.");
        console.error("Failed to fetch boards:", err);
      } finally {
        setIsPending(false);
      }
    }

    void fetchBoards();
  }, []);

  function handleCreateBoard() {
    const name = prompt("새 게시판 이름을 입력하세요:");
    if (!name) return;
    const description = prompt("게시판 설명을 입력하세요 (선택사항):");

    void (async () => {
      try {
        const newBoard = await createBoard({
          name,
          description: description || undefined,
        });
        setBoards((prev) => [newBoard, ...prev]);
      } catch (err) {
        setError("게시판을 생성할 수 없습니다.");
        console.error("Failed to create board:", err);
      }
    })();
  }

  return (
    <Section>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">게시판 목록</h1>
        <Button onClick={handleCreateBoard}>+ 새 게시판</Button>
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

      {/* Boards Grid */}
      {!isPending && !error && (
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/board/${board.id}`}
              className="-translate-y-0.5 rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg md:rounded-xl"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-primary mb-2 line-clamp-2 text-lg font-semibold md:text-xl">
                {board.name}
              </h2>
              {board.description && (
                <p className="text-tertiary line-clamp-2 text-sm md:text-base">
                  {board.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isPending && !error && boards.length === 0 && (
        <div className="rounded-lg bg-white p-8 text-center shadow-md md:rounded-xl md:p-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 md:h-20 md:w-20">
            <BookOpen className="h-8 w-8 text-gray-400 md:h-10 md:w-10" />
          </div>
          <h3 className="text-primary mb-2 text-lg font-semibold md:text-xl">
            게시판이 없습니다
          </h3>
          <p className="text-tertiary mb-6 text-sm md:text-base">
            첫 번째 게시판을 만들어보세요!
          </p>
          <button
            onClick={handleCreateBoard}
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            게시판 만들기
          </button>
        </div>
      )}
    </Section>
  );
}
