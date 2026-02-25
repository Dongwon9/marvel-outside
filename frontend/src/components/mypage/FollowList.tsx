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
        <p className="text-muted py-8 text-center">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {users.map((user) => (
        <Link key={user.id} to={`/user/${user.id}`}>
          <Card
            variant="outlined"
            padding="md"
            className="h-full cursor-pointer transition-shadow hover:shadow-lg"
          >
            <div className="space-y-3">
              {/* User Info */}
              <div className="space-y-1">
                <h3 className="text-primary truncate text-base font-semibold">
                  {user.name}
                </h3>
                <p className="text-secondary truncate text-xs md:text-sm">
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
