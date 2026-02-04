import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MoreVertical, User, Share2 } from "lucide-react";

import MarkdownRenderer from "../components/MarkdownRenderer";
import RateButtons from "../components/RateButtons";
import CommentList from "../components/CommentList";
import {
  getPostById,
  deletePost,
  increasePostViews,
  type PostResponse,
} from "../api/posts";
import { getRateByPostAndUserId, type RateResponse } from "../api/rates";
import { formatRelativeTime } from "../utils/time";
import { useAuth } from "../hooks/useAuth";

export default function PostView() {
  const { id } = useParams();
  const { user } = useAuth();
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
      void navigate("/post");
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
      void navigate("/post");
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
          if (user?.id) {
            const currentUserRate = await getRateByPostAndUserId(
              id as string,
              user.id,
            );
            setUserRate(currentUserRate);
          }
        } catch {
          // 평가가 없으면 무시
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        alert("게시글을 불러올 수 없습니다.");
        void navigate("/post");
      } finally {
        setIsPending(false);
      }
    }

    void fetchPost();
  }, [id, navigate, user?.id]);

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
          className="text-tertiary hover:text-primary inline-flex items-center gap-2 text-sm transition-colors md:text-base"
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
        className="text-tertiary hover:text-primary inline-flex items-center gap-2 text-sm transition-colors md:text-base"
      >
        <ChevronLeft className="h-5 w-5" />
        목록으로
      </Link>

      {/* Post Content */}
      <article className="card-default overflow-hidden">
        {/* Header */}
        <div className="border-light border-b p-4 md:p-6 lg:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="text-primary flex-1 text-xl font-bold md:text-2xl lg:text-3xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void handleDeletePost()}
                disabled={isDeleting}
                className="text-tertiary rounded-lg px-3 py-2 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 md:px-4 md:py-2.5"
              >
                <MoreVertical className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="text-muted flex flex-wrap items-center gap-2 text-xs md:gap-4 md:text-sm">
            <Link
              to={`/board/${post.boardId}`}
              className="rounded bg-blue-100 px-2 py-1 font-medium text-blue-700 transition-colors hover:bg-blue-200"
            >
              {post.boardName}
            </Link>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <Link
                to={`/user/${post.authorId}`}
                className="font-medium transition-colors hover:text-blue-600"
              >
                {post.authorName}
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
            <button className="text-tertiary hover:text-primary flex items-center gap-1.5 px-3 py-2 transition-colors md:gap-2 md:px-4 md:py-2.5">
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
        <div className="p-4 md:p-6">{id && <CommentList postId={id} />}</div>
      </div>
    </section>
  );
}
