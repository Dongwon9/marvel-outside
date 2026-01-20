import { Link, useParams } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();

  // Mock user data
  const userData = {
    name: "김철수",
    email: "user@example.com",
    bio: "안녕하세요! Marvel Outside에서 활동하고 있는 개발자입니다.",
    joinedAt: "2026년 1월",
    followers: 128,
    following: 256,
    posts: 42,
  };

  const recentPosts = [
    {
      id: "1",
      title: "첫 번째 게시글",
      createdAt: "2026-01-20",
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      title: "두 번째 게시글",
      createdAt: "2026-01-19",
      likes: 18,
      comments: 5,
    },
    {
      id: "3",
      title: "세 번째 게시글",
      createdAt: "2026-01-18",
      likes: 32,
      comments: 12,
    },
  ];

  return (
    <section className="space-y-4 md:space-y-6">
      {/* Profile Header */}
      <div className="rounded-lg bg-linear-to-r from-blue-500 to-purple-500 p-6 text-white shadow-lg md:rounded-xl md:p-8 lg:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-3xl md:h-24 md:w-24 md:text-4xl lg:h-28 lg:w-28 lg:text-5xl">
            👤
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-bold md:text-3xl lg:text-4xl">
              {userData.name}
            </h1>
            <p className="mb-4 text-sm text-blue-50 md:text-base">
              {userData.bio}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <span>가입: {userData.joinedAt}</span>
              <span>·</span>
              <span>ID: {id}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 md:shrink-0">
            <button className="rounded-lg bg-white px-4 py-2 font-medium whitespace-nowrap text-blue-600 transition-colors hover:bg-blue-50 md:px-6 md:py-2.5">
              팔로우
            </button>
            <button className="rounded-lg border-2 border-white bg-blue-600 px-4 py-2 font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-700 md:px-6 md:py-2.5">
              메시지
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-blue-400 pt-6">
          <div className="text-center">
            <div className="text-xl font-bold md:text-2xl lg:text-3xl">
              {userData.posts}
            </div>
            <div className="mt-1 text-xs text-blue-50 md:text-sm">게시글</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold md:text-2xl lg:text-3xl">
              {userData.followers}
            </div>
            <div className="mt-1 text-xs text-blue-50 md:text-sm">팔로워</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold md:text-2xl lg:text-3xl">
              {userData.following}
            </div>
            <div className="mt-1 text-xs text-blue-50 md:text-sm">팔로잉</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md md:rounded-xl">
        <div className="flex border-b border-gray-200">
          <button className="flex-1 border-b-2 border-blue-600 px-4 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-gray-50 md:py-4 md:text-base">
            게시글
          </button>
          <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 md:py-4 md:text-base">
            좋아요
          </button>
          <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 md:py-4 md:text-base">
            저장
          </button>
        </div>

        {/* Recent Posts */}
        <div className="divide-y divide-gray-200">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="block p-4 transition-colors hover:bg-gray-50 md:p-6"
            >
              <h3 className="mb-2 text-base font-semibold text-gray-900 md:text-lg">
                {post.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-600 md:text-sm">
                <span>{post.createdAt}</span>
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {post.comments}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
