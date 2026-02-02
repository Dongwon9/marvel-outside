import { Link, useParams } from "react-router-dom";
import { ClipboardList, Users, FileText } from "lucide-react";

import { formatRelativeTime } from "../utils/time";

export default function BoardView() {
  const { id } = useParams();

  // Mock board data
  const boardData = {
    name: "자유 게시판",
    description: "자유롭게 이야기를 나누는 공간입니다",
    postCount: 128,
    memberCount: 256,
  };

  const mockPosts = [
    {
      id: "1",
      title: "보드에 오신 것을 환영합니다",
      author: "관리자",
      createdAt: "2026-01-20T10:15:30.000Z",
      views: 145,
      likes: 23,
      comments: 12,
    },
    {
      id: "2",
      title: "자유 게시판 이용 안내",
      author: "운영자",
      createdAt: "2026-01-19T08:03:12.000Z",
      views: 98,
      likes: 15,
      comments: 8,
    },
  ];

  return (
    <section className="space-y-4 md:space-y-6">
      {/* Board Header */}
      <div className="rounded-lg bg-linear-to-r from-purple-500 to-pink-500 p-6 text-white shadow-lg md:rounded-xl md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-bold md:text-3xl">
              {boardData.name}
            </h1>
            <p className="mb-4 text-sm text-purple-50 md:mb-0 md:text-base">
              {boardData.description}
            </p>
          </div>
          <Link
            to="/post/new"
            className="rounded-lg bg-white px-4 py-2.5 text-center font-medium whitespace-nowrap text-purple-600 transition-colors hover:bg-purple-50 md:px-6 md:py-3"
          >
            + 글쓰기
          </Link>
        </div>
        <div className="mt-4 flex items-center gap-4 border-t border-purple-400 pt-4 md:gap-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <span className="text-sm md:text-base">
              게시글 {boardData.postCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="text-sm md:text-base">
              멤버 {boardData.memberCount}
            </span>
          </div>
        </div>
      </div>

      {/* Board ID Badge */}
      <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600">
        <FileText className="h-4 w-4" />
        보드 ID: {id}
      </div>

      {/* Posts List */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md md:rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 md:text-sm">
                  제목
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-gray-600 sm:table-cell md:text-sm">
                  작성자
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-gray-600 md:table-cell md:text-sm">
                  작성일
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 md:text-sm">
                  조회
                </th>
                <th className="hidden px-4 py-3 text-center text-xs font-medium text-gray-600 md:text-sm lg:table-cell">
                  좋아요
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockPosts.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <Link
                      to={`/post/${post.id}`}
                      className="line-clamp-1 text-sm font-medium text-gray-900 hover:text-blue-600 md:text-base"
                    >
                      {post.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 sm:hidden">
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{formatRelativeTime(post.createdAt)}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-sm text-gray-600 sm:table-cell">
                    {post.author}
                  </td>
                  <td className="hidden px-4 py-4 text-sm text-gray-600 md:table-cell">
                    {formatRelativeTime(post.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-600">
                    {post.views}
                  </td>
                  <td className="hidden px-4 py-4 text-center text-sm text-gray-600 lg:table-cell">
                    {post.likes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 md:text-base">
          이전
        </button>
        <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white md:text-base">
          1
        </button>
        <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 md:text-base">
          2
        </button>
        <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 md:text-base">
          3
        </button>
        <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 md:text-base">
          다음
        </button>
      </div>
    </section>
  );
}
