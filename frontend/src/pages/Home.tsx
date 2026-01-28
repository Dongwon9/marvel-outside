import { Newspaper, Users, MessageSquare } from "lucide-react";

import { getHello } from "../api/app";

export default function Home() {
  return (
    <section className="space-y-6 md:space-y-8">
      {/* Hero Section */}
      <div className="rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-lg md:rounded-2xl md:p-12">
        <h1 className="mb-3 text-2xl font-bold md:mb-4 md:text-4xl lg:text-5xl">
          Marvel Outside에 오신 것을 환영합니다
        </h1>
        <p className="mb-6 text-base text-blue-50 md:mb-8 md:text-lg lg:text-xl">
          다양한 콘텐츠를 공유하고 소통하는 커뮤니티 플랫폼
        </p>
        <button
          onClick={async () => {
            const text = await getHello();
            alert(text);
            console.log(text);
          }}
          className="mb-6 rounded-lg bg-white px-4 py-2 text-blue-600 hover:bg-gray-100"
        >
          헬로월드
        </button>
        <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
          <a
            href="/signup"
            className="rounded-lg bg-white px-6 py-3 text-center font-medium text-blue-600 transition-colors hover:bg-gray-100"
          >
            시작하기
          </a>
          <a
            href="/post"
            className="rounded-lg border-2 border-white bg-blue-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
          >
            게시글 보기
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg md:rounded-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <Newspaper className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold md:text-xl">게시글 작성</h3>
          <p className="text-sm text-gray-600 md:text-base">
            자유롭게 글을 작성하고 이미지를 공유하세요
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg md:rounded-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold md:text-xl">팔로우</h3>
          <p className="text-sm text-gray-600 md:text-base">
            관심있는 사용자를 팔로우하고 소식을 받아보세요
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg md:rounded-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <MessageSquare className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold md:text-xl">소통</h3>
          <p className="text-sm text-gray-600 md:text-base">
            댓글과 좋아요로 다른 사용자와 소통하세요
          </p>
        </div>
      </div>
    </section>
  );
}
