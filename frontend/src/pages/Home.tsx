import { use } from "react";

import { getPosts } from "../api/posts";
import PostCard from "../components/PostCard";
import { Section } from "../components/ui";
import { useAuth } from "../hooks/useAuth";

const feedDataPromise = getPosts({ take: 5 });
export default function Home() {
  const feedData = use(feedDataPromise);
  const { user } = useAuth();
  return (
    <Section>
      {user ? user.name + "님 만을 위한" : "오늘의"} 피드
      <div className="space-y-4">
        {feedData.map((item) => (
          <PostCard key={item.id} {...item} variant="feed" />
        ))}
      </div>
    </Section>
  );
}
