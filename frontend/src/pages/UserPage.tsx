import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getUserComments, type CommentResponse } from "@/api/comments";
import { getFollowers, getFollowing, type FollowUserInfo } from "@/api/follows";
import { getDrafts, getUserPosts, type PostResponse } from "@/api/posts";
import { getUserById, getUserStats, type UserStats } from "@/api/user";
import ActivityStats from "@/components/mypage/ActivityStats";
import FollowList from "@/components/mypage/FollowList";
import LikedPostsList from "@/components/mypage/LikedPostsList";
import MyCommentsList from "@/components/mypage/MyCommentsList";
import MyPostsList from "@/components/mypage/MyPostsList";
import ProfileCard from "@/components/mypage/ProfileCard";
import { Section } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

type TabType =
  | "posts"
  | "liked"
  | "comments"
  | "followers"
  | "following"
  | "drafts";

// Component-compatible types
interface Post {
  id: string;
  title: string;
  boardName: string;
  createdAt: string;
  views: number;
  comments: number;
}

interface Comment {
  id: string;
  content: string;
  postTitle: string;
  postId: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const tabs: Array<{
  id: TabType;
  label: string;
  icon: string;
  meOnly?: boolean;
}> = [
  { id: "posts", label: "게시글", icon: "📝" },
  { id: "comments", label: "댓글", icon: "💬" },
  { id: "followers", label: "팔로워", icon: "👥" },
  { id: "following", label: "팔로잉", icon: "👥" },
  { id: "liked", label: "좋아요한 글", icon: "❤️", meOnly: true },
  { id: "drafts", label: "임시저장", icon: "🗂️", meOnly: true },
];

// Temporary mock data for unsupported features
const mockLikedPosts = [
  {
    id: "post1",
    title: "NestJS 보안을 위한 필수 가이드",
    boardName: "백엔드",
    createdAt: "2026-02-17T10:15:00.000Z",
    views: 523,
    comments: 28,
  },
  {
    id: "post2",
    title: "Docker로 쉽게 개발환경 구축하기",
    boardName: "DevOps",
    createdAt: "2026-02-16T09:30:00.000Z",
    views: 412,
    comments: 19,
  },
];

export default function MyPage() {
  const { id: userId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [userData, setUserData] = useState<{
    name: string;
    registeredAt: string;
  } | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [draftsList, setDraftsList] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data and stats on mount
  useEffect(() => {
    async function fetchUserData() {
      if (!userId) {
        void navigate("/not-found", { replace: true });
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const [userRes, statsRes] = await Promise.all([
          getUserById(userId),
          getUserStats(userId),
        ]);

        setUserData({
          name: userRes.name,
          registeredAt: userRes.registeredAt.toString(),
        });
        setStats(statsRes);
      } catch (err) {
        console.error("사용자 데이터를 가져오는 중 오류 발생:", err);
        setError("사용자 정보를 불러올 수 없습니다");
        void navigate("/not-found", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    void fetchUserData();
  }, [userId, navigate]);

  // Fetch tab-specific data when active tab changes
  useEffect(() => {
    if (!userId) return;
    const safeUserId = userId;

    async function fetchTabData() {
      try {
        setLoading(true);
        setError(null);

        // Transform API responses to component-compatible types
        const transformPost = (post: PostResponse): Post => ({
          id: post.id,
          title: post.title,
          boardName: post.boardName,
          createdAt: post.createdAt,
          views: post.hits,
          comments: post.commentCount,
        });

        const transformComment = (comment: CommentResponse): Comment => ({
          id: `${comment.authorId}_${comment.postId}`, // Unique ID from authorId and postId
          content: comment.content,
          postTitle: comment.post.title,
          postId: comment.postId,
          createdAt: comment.createdAt,
        });

        const transformUser = (data: FollowUserInfo): User => ({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        });

        switch (activeTab) {
          case "posts": {
            const posts = await getUserPosts(safeUserId);
            setPostsList(posts.map(transformPost));
            break;
          }
          case "comments": {
            const comments = await getUserComments(safeUserId);
            setCommentsList(comments.map(transformComment));
            break;
          }
          case "followers": {
            const followers = await getFollowers(safeUserId);
            setFollowersList(followers.map(transformUser));
            break;
          }
          case "following": {
            const following = await getFollowing(safeUserId);
            setFollowingList(following.map(transformUser));
            break;
          }
          case "drafts": {
            const drafts = await getDrafts(safeUserId);
            setDraftsList(drafts.map(transformPost));
            break;
          }
          default:
            break;
        }
      } catch (err) {
        console.error(`${activeTab} 탭 데이터 로딩 중 오류:`, err);
        setError(`${activeTab} 데이터를 불러올 수 없습니다`);
      } finally {
        setLoading(false);
      }
    }

    void fetchTabData();
  }, [userId, activeTab]);

  if (!userId) {
    return (
      <Section>
        <p className="text-tertiary text-center">
          사용자 정보를 로드할 수 없습니다.
        </p>
      </Section>
    );
  }

  const profileMode = () => {
    if (!user) return "nonMember";
    if (user.id === userId) return "self";
    return "member";
  };

  const renderTabContent = () => {
    if (loading && activeTab !== "posts") {
      return (
        <div className="text-tertiary py-8 text-center">로드 중입니다...</div>
      );
    }

    if (error) {
      return <div className="py-8 text-center text-red-500">{error}</div>;
    }

    switch (activeTab) {
      case "posts":
        return <MyPostsList posts={postsList} />;
      case "liked":
        return <LikedPostsList posts={mockLikedPosts} />;
      case "comments":
        return <MyCommentsList comments={commentsList} />;
      case "followers":
        return <FollowList users={followersList} type="followers" />;
      case "following":
        return <FollowList users={followingList} type="following" />;
      case "drafts":
        return <MyPostsList posts={draftsList} />;
      default:
        return null;
    }
  };

  return (
    <Section>
      {/* Profile Section */}

      <ProfileCard
        userName={userData?.name || ""}
        registeredAt={
          userData ? new Date(userData.registeredAt).toISOString() : ""
        }
        onEditProfile={() => console.log("프로필 수정")}
        mode={profileMode()}
        onFollow={() => console.log("팔로우")}
      />

      {/* Activity Stats */}
      <ActivityStats
        postCount={stats?.postCount || 0}
        commentCount={stats?.commentCount || 0}
        followerCount={stats?.followerCount || 0}
        followingCount={stats?.followingCount || 0}
      />

      {/* Tab Navigation */}
      <div className="border-light mt-8 border-b">
        <div className="flex gap-2 overflow-x-auto md:gap-4">
          {tabs.map((tab) =>
            !tab.meOnly || user?.id === userId ? (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors md:text-base ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-blue-500"
                    : "text-secondary hover:text-primary"
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ) : null,
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6 md:mt-8">{renderTabContent()}</div>
    </Section>
  );
}
