import { Newspaper } from "lucide-react";
import { use } from "react";

import { getPosts } from "../api/posts";
import PostCard from "../components/PostCard";
import { Button, Section } from "../components/ui";

export default function Feed() {
  // Mock feed data
  const feedData = use(getPosts());
  return (
    <Section>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">피드</h1>
        <Button variant="outline" size="sm">
          새로고침
        </Button>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {feedData.map((item) => (
          <PostCard key={item.id} {...item} variant="feed" />
        ))}
      </div>

      {/* Empty State */}
      {feedData.length === 0 && (
        <div className="card-default card-padding-lg text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 md:h-20 md:w-20">
            <Newspaper className="text-subtle h-8 w-8 md:h-10 md:w-10" />
          </div>
          <h3 className="text-primary mb-2 text-lg font-semibold md:text-xl">
            피드가 비어있습니다
          </h3>
          <p className="text-tertiary mb-6 md:text-base">
            다른 사용자를 팔로우하여 피드를 채워보세요!
          </p>
        </div>
      )}
    </Section>
  );
}
