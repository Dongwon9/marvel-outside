import { Link } from "react-router-dom";

import { Card } from "@/components/ui";

interface User {
  id: string;
  name: string;
  email: string;
}

interface FollowListProps {
  users: User[];
  type: "followers" | "following";
  isLoading?: boolean;
}

export default function FollowList({
  users,
  type,
  isLoading,
}: FollowListProps) {
  const emptyMessage =
    type === "followers"
      ? "팔로워가 없습니다."
      : "팔로잉하는 사용자가 없습니다.";

  if (isLoading) {
    return (
      <Card variant="default" padding="md">
        <p className="text-muted text-center">로딩 중...</p>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card variant="default" padding="md">
        <p className="text-muted text-center py-8">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {users.map((user) => (
        <Link key={user.id} to={`/user/${user.id}`}>
          <Card
            variant="outlined"
            padding="md"
            className="h-full hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="space-y-3">
              {/* Avatar */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-xl text-white font-bold">
                {user.name.substring(0, 1)}
              </div>

              {/* User Info */}
              <div className="space-y-1">
                <h3 className="text-primary text-base font-semibold truncate">
                  {user.name}
                </h3>
                <p className="text-secondary text-xs md:text-sm truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
