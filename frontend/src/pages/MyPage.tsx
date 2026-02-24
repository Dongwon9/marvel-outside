import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProfileCard from "@/components/mypage/ProfileCard";
import ActivityStats from "@/components/mypage/ActivityStats";
import MyPostsList from "@/components/mypage/MyPostsList";
import MyCommentsList from "@/components/mypage/MyCommentsList";
import FollowList from "@/components/mypage/FollowList";
import LikedPostsList from "@/components/mypage/LikedPostsList";
import { Section } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";

type TabType = "posts" | "liked" | "comments" | "followers" | "following";

const tabs: Array<{ id: TabType; label: string; icon: string }> = [
  { id: "posts", label: "내 게시글", icon: "📝" },
  { id: "liked", label: "좋아요한 글", icon: "❤️" },
  { id: "comments", label: "댓글", icon: "💬" },
  { id: "followers", label: "팔로워", icon: "👥" },
  { id: "following", label: "팔로잉", icon: "👥" },
];

// Mock data for demonstration
const mockStats = {
  postCount: 42,
  commentCount: 128,
  followerCount: 315,
  followingCount: 84,
};

const mockPosts = [
  {
    id: "1",
    title: "마이페이지 설계를 마쳤습니다",
    boardName: "개발 팁",
    createdAt: "2026-02-20T14:12:05.000Z",
    views: 142,
    comments: 8,
  },
  {
    id: "2",
    title: "React 19 업데이트 정리",
    boardName: "기술 공유",
    createdAt: "2026-02-19T11:03:40.000Z",
    views: 89,
    comments: 5,
  },
  {
    id: "3",
    title: "Tailwind CSS 팁과 트릭",
    boardName: "프론트엔드",
    createdAt: "2026-02-18T07:30:18.000Z",
    views: 256,
    comments: 12,
  },
];

const mockComments = [
  {
    id: "1",
    content: "정말 좋은 글이네요! 감사합니다.",
    postTitle: "마이페이지 설계를 마쳤습니다",
    postId: "1",
    createdAt: "2026-02-20T15:20:00.000Z",
  },
  {
    id: "2",
    content: "저도 이 방법을 써봐야겠습니다.",
    postTitle: "React 19 업데이트 정리",
    postId: "2",
    createdAt: "2026-02-19T12:45:00.000Z",
  },
];

const mockFollowers = [
  {
    id: "user1",
    name: "이준호",
    email: "junhove@example.com",
  },
  {
    id: "user2",
    name: "박민지",
    email: "minji@example.com",
  },
  {
    id: "user3",
    name: "최현준",
    email: "hyunjoon@example.com",
  },
];

const mockFollowing = [
  {
    id: "user4",
    name: "김재훈",
    email: "jaehun@example.com",
  },
  {
    id: "user5",
    name: "이수현",
    email: "suhyun@example.com",
  },
];

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("posts");

  if (!user) {
    return (
      <Section>
        <p className="text-center text-tertiary">사용자 정보를 로드할 수 없습니다.</p>
      </Section>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleDeleteAccount = () => {
    // 이 부분은 나중에 useConfirm으로 구현
    console.log("계정 삭제");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return <MyPostsList posts={mockPosts} />;
      case "liked":
        return <LikedPostsList posts={mockLikedPosts} />;
      case "comments":
        return <MyCommentsList comments={mockComments} />;
      case "followers":
        return <FollowList users={mockFollowers} type="followers" />;
      case "following":
        return <FollowList users={mockFollowing} type="following" />;
      default:
        return null;
    }
  };

  return (
    <Section>
      {/* Profile Section */}
      <ProfileCard
        userName={user.name}
        email={user.email}
        registeredAt={new Date().toISOString()}
        onEditProfile={() => console.log("프로필 수정")}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* Activity Stats */}
      <ActivityStats
        postCount={mockStats.postCount}
        commentCount={mockStats.commentCount}
        followerCount={mockStats.followerCount}
        followingCount={mockStats.followingCount}
      />

      {/* Tab Navigation */}
      <div className="border-b border-light mt-8">
        <div className="flex gap-2 overflow-x-auto md:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm md:text-base transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-primary"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6 md:mt-8">{renderTabContent()}</div>
    </Section>
  );
}
