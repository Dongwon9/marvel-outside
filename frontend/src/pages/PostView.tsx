import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MoreVertical,
  User,
  Share2,
  FileText,
} from "lucide-react";

import MarkdownRenderer from "../components/MarkdownRenderer";
import RateButtons from "../components/RateButtons";
import {
  getPostById,
  deletePost,
  increasePostViews,
  type PostResponse,
} from "../api/posts";
import { getRates, type RateResponse } from "../api/rates";
import { formatRelativeTime } from "../utils/time";

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [userRate, setUserRate] = useState<RateResponse | undefined>();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isPending, setIsPending] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async () => {
    if (!id || !post) return;

    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost(id);
      alert("게시글이 삭제되었습니다.");
      navigate("/post");
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("게시글을 삭제할 수 없습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) {
      alert("잘못된 접근입니다.");
      navigate("/post");
      return;
    }

    async function fetchPost() {
      try {
        const data = await getPostById(id as string);
        setPost(data);
        setLikes(data.likes);
        setDislikes(data.dislikes);

        // 조회수 증가
        try {
          await increasePostViews(id as string);
        } catch {
          // 조회수 증가 실패는 무시
        }

        // 사용자의 평가 조회 (현재 사용자가 로그인했다면)
        try {
          const rates = await getRates(id);
          const currentUserRate = rates.find((r) => r.postId === id);
          setUserRate(currentUserRate);
        } catch {
          // 평가가 없으면 무시
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        alert("게시글을 불러올 수 없습니다.");
        navigate("/post");
      } finally {
        setIsPending(false);
      }
    }

    void fetchPost();
  }, [id, navigate]);

  const now = Date.now();
  const comments = [
    {
      id: "1",
      author: "이영희",
      content: "좋은 글 감사합니다!",
      createdAt: new Date(now - 45 * 1000).toISOString(),
      likes: 5,
    },
    {
      id: "2",
      author: "박민수",
      content: "정말 유익한 정보네요. 많은 도움이 되었습니다.",
      createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      likes: 3,
    },
  ];

  if (isPending) {
    return (
      <section className="flex items-center justify-center rounded-lg bg-white p-8 shadow-md md:rounded-xl md:p-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-sm text-gray-600 md:text-base">
            게시글을 불러오는 중...
          </p>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="space-y-4 md:space-y-6">
        <Link
          to="/post"
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 md:text-base"
        >
          <ChevronLeft className="h-5 w-5" />
          목록으로
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 md:p-6">
          <p className="text-sm text-red-700 md:text-base">
            게시글을 찾을 수 없습니다.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 md:space-y-6">
      {/* Back Button */}
      <Link
        to="/post"
        className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 md:text-base"
      >
        <ChevronLeft className="h-5 w-5" />
        목록으로
      </Link>

      {/* Post Content */}
      <article className="overflow-hidden rounded-lg bg-white shadow-md md:rounded-xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 md:p-6 lg:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="flex-1 text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 md:px-4 md:py-2.5"
              >
                <MoreVertical className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 md:gap-4 md:text-sm">
            <Link
              to={`/board/${post.boardId}`}
              className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-700 transition-colors hover:bg-blue-200"
            >
              {post.boardId}
            </Link>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <Link
                to={`/user/${post.authorId}`}
                className="font-medium transition-colors hover:text-blue-600"
              >
                {post.authorId}
              </Link>
            </span>
            <span>·</span>
            <span>{formatRelativeTime(post.createdAt)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <RateButtons
              postId={id!}
              initialLikes={likes}
              initialDislikes={dislikes}
              userRate={userRate}
              onRateChange={(newLikes, newDislikes) => {
                setLikes(newLikes);
                setDislikes(newDislikes);
              }}
            />
            <button className="flex items-center gap-1.5 px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 md:gap-2 md:px-4 md:py-2.5">
              <Share2 className="h-5 w-5" />
              <span className="hidden text-sm sm:inline md:text-base">
                공유
              </span>
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md md:rounded-xl">
        <div className="border-b border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-bold md:text-xl">
            댓글 {comments.length}
          </h2>
        </div>

        {/* Comment Form */}
        <div className="border-b border-gray-200 bg-gray-50 p-4 md:p-6">
          <textarea
            placeholder="댓글을 입력하세요..."
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:py-3 md:text-base"
          />
          <div className="mt-3 flex justify-end">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 md:px-6 md:py-2.5 md:text-base">
              댓글 작성
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="divide-y divide-gray-200">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 transition-colors hover:bg-gray-50 md:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200 md:h-10 md:w-10" />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 md:text-base">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 md:text-sm">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-700 md:text-base">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <button className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-blue-600 md:text-sm">
                      <ThumbsUp className="h-4 w-4" />
                      {comment.likes}
                    </button>
                    <button className="text-xs text-gray-500 transition-colors hover:text-blue-600 md:text-sm">
                      답글
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post ID Badge (for development) */}
      <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-600 md:text-sm">
        <FileText className="h-4 w-4" />
        게시글 ID: {id}
      </div>
    </section>
  );
}
