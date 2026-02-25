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
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          variant="outlined"
          padding="sm"
          className="text-center transition-shadow hover:shadow-lg"
        >
          <div className="text-primary text-2xl font-bold md:text-3xl">
            {stat.count}
          </div>
          <div className="text-muted mt-2 text-xs md:text-sm">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
}
