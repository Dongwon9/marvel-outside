import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

import PostCard from "../components/PostCard";

export default function PostList() {
  // Mock data for demonstration
  const mockPosts = [
    {
      id: "1",
      title: "첫 번째 게시글",
      content: "Marvel Outside에 오신 것을 환영합니다!",
      author: "사용자1",
      createdAt: "2026-01-20",
      likes: 12,
      comments: 5,
    },
    {
      id: "2",
      title: "반응형 디자인 적용 완료",
      content: "모바일과 데스크톱에서 모두 잘 작동합니다.",
      author: "사용자2",
      createdAt: "2026-01-20",
      likes: 8,
      comments: 3,
    },
    {
      id: "3",
      title: "Tailwind CSS 활용하기",
      content: "유틸리티 클래스로 빠르게 UI를 구성할 수 있습니다.",
      author: "사용자3",
      createdAt: "2026-01-19",
      likes: 15,
      comments: 7,
    },
  ];

  return (
    <section className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">게시글 목록</h1>
        <Link
          to="/post/new"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white shadow-md transition-colors hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 md:px-6 md:py-3 md:text-base"
        >
          + 새 게시글
        </Link>
      </div>

      {/* Filter/Sort Bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-sm md:gap-3 md:p-4">
        <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700 md:px-4 md:py-2 md:text-base">
          최신순
        </button>
        <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 md:px-4 md:py-2 md:text-base">
          인기순
        </button>
        <button className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 md:px-4 md:py-2 md:text-base">
          댓글순
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {mockPosts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            author={post.author}
            createdAt={post.createdAt}
            likes={post.likes}
            comments={post.comments}
          />
        ))}
      </div>

      {/* Empty State */}
      {mockPosts.length === 0 && (
        <div className="rounded-lg bg-white p-8 text-center shadow-md md:rounded-xl md:p-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 md:h-20 md:w-20">
            <FileText className="h-8 w-8 text-gray-400 md:h-10 md:w-10" />
          </div>
          <h3 className="mb-2 text-lg font-semibold md:text-xl">
            게시글이 없습니다
          </h3>
          <p className="mb-6 text-sm text-gray-600 md:text-base">
            첫 번째 게시글을 작성해보세요!
          </p>
          <Link
            to="/post/new"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            게시글 작성하기
          </Link>
        </div>
      )}
    </section>
  );
}
