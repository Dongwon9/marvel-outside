import { ClipboardList, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getBoardById, type Board } from "../api/boards";
import { getPosts, type PostResponse } from "../api/posts";
import { formatRelativeTime } from "../utils/time";

export default function BoardView() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<Board | null>(null);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBoardData() {
      if (!id) return;

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
  }, [id]);

  return (
    <section className="space-y-4 md:space-y-6">
      {/* Loading State */}
      {isPending && (
        <div className="flex items-center justify-center rounded-lg bg-white p-8 shadow-md md:rounded-xl md:p-12">
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

      {/* Board Header */}
      {!isPending && board && (
        <div className="rounded-lg bg-linear-to-r from-purple-500 to-pink-500 p-6 text-white shadow-lg md:rounded-xl md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold md:text-3xl">
                {board.name}
              </h1>
              {board.description && (
                <p className="mb-4 text-sm text-purple-50 md:mb-0 md:text-base">
                  {board.description}
                </p>
              )}
            </div>
            <Link
              to="/post/new"
              state={{ boardId: id }}
              className="rounded-lg bg-white px-4 py-2.5 text-center font-medium whitespace-nowrap text-purple-600 transition-colors hover:bg-purple-50 md:px-6 md:py-3"
            >
              + 글쓰기
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-4 border-t border-purple-400 pt-4 md:gap-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              <span className="text-sm md:text-base">
                게시글 {posts.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Board ID Badge */}
      {board && (
        <div className="text-tertiary inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm">
          <FileText className="h-4 w-4" />
          보드 ID: {id}
        </div>
      )}

      {/* Posts List */}
      {!isPending && !error && (
        <div className="overflow-hidden rounded-lg bg-white shadow-md md:rounded-xl">
          {posts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-muted px-4 py-3 text-left text-xs font-medium md:text-sm">
                      제목
                    </th>
                    <th className="text-muted hidden px-4 py-3 text-left text-xs font-medium sm:table-cell md:text-sm">
                      작성자
                    </th>
                    <th className="text-muted hidden px-4 py-3 text-left text-xs font-medium md:table-cell md:text-sm">
                      작성일
                    </th>
                    <th className="text-muted hidden px-4 py-3 text-center text-xs font-medium md:table-cell md:text-sm">
                      좋아요
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-4">
                        <Link
                          to={`/post/${post.id}`}
                          className="text-primary line-clamp-1 text-sm font-medium hover:text-blue-600 md:text-base"
                        >
                          {post.title}
                        </Link>
                        <div className="text-muted mt-1 flex items-center gap-2 text-xs sm:hidden">
                          <span>{post.authorName}</span>
                          <span>·</span>
                          <span>{formatRelativeTime(post.createdAt)}</span>
                        </div>
                      </td>
                      <td className="text-tertiary hidden px-4 py-4 text-sm sm:table-cell">
                        {post.authorName}
                      </td>
                      <td className="text-tertiary hidden px-4 py-4 text-sm md:table-cell">
                        {formatRelativeTime(post.createdAt)}
                      </td>
                      <td className="text-tertiary hidden px-4 py-4 text-center text-sm md:table-cell">
                        {post.likes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-tertiary">게시글이 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
