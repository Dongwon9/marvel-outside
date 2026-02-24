import { Card } from "@/components/ui";

interface ActivityStatsProps {
  postCount: number;
  commentCount: number;
  followerCount: number;
  followingCount: number;
}

export default function ActivityStats({
  postCount,
  commentCount,
  followerCount,
  followingCount,
}: ActivityStatsProps) {
  const stats = [
    { label: "게시글", count: postCount },
    { label: "댓글", count: commentCount },
    { label: "팔로워", count: followerCount },
    { label: "팔로잉", count: followingCount },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 mt-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          variant="outlined"
          padding="sm"
          className="text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-2xl md:text-3xl font-bold text-primary">
            {stat.count}
          </div>
          <div className="text-muted text-xs md:text-sm mt-2">
            {stat.label}
          </div>
        </Card>
      ))}
    </div>
  );
}
