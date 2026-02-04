import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

import PostCard from "../components/PostCard";
import LinkButton from "../components/ui/LinkButton";
import Section from "../components/ui/Section";
import { getPosts, type PostResponse } from "../api/posts";

export default function PostList() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setError(null);
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError("게시글을 불러올 수 없습니다.");
        console.error("Failed to fetch posts:", err);
      } finally {
        setIsPending(false);
      }
    }

    void fetchPosts();
  }, []);
  return (
    <Section>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">게시글 목록</h1>
        <LinkButton to="/post/new">+ 새 게시글</LinkButton>
      </div>

      {/* Filter/Sort Bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-sm md:gap-3 md:p-4">
        <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700 md:px-4 md:py-2 md:text-base">
          최신순
        </button>
        <button className="text-secondary rounded-lg bg-gray-100 px-3 py-1.5 text-sm transition-colors hover:bg-gray-200 md:px-4 md:py-2 md:text-base">
          인기순
        </button>
        <button className="text-secondary rounded-lg bg-gray-100 px-3 py-1.5 text-sm transition-colors hover:bg-gray-200 md:px-4 md:py-2 md:text-base">
          댓글순
        </button>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="card-default card-padding-lg flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            <p className="text-muted md:text-base">게시글을 불러오는 중...</p>
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
            <FileText className="h-8 w-8 text-gray-400 md:h-10 md:w-10" />
          </div>
          <h3 className="text-primary mb-2 text-lg font-semibold md:text-xl">
            게시글이 없습니다
          </h3>
          <p className="text-tertiary mb-6 md:text-base">
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
    </Section>
  );
}
