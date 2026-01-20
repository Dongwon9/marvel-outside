export default function Home() {
  return (
    <section className="space-y-6 md:space-y-8">
      {/* Hero Section */}
      <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white shadow-lg md:rounded-2xl md:p-12">
        <h1 className="mb-3 text-2xl font-bold md:mb-4 md:text-4xl lg:text-5xl">
          Marvel Outside에 오신 것을 환영합니다
        </h1>
        <p className="mb-6 text-base text-blue-50 md:mb-8 md:text-lg lg:text-xl">
          다양한 콘텐츠를 공유하고 소통하는 커뮤니티 플랫폼
        </p>
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
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold md:text-xl">게시글 작성</h3>
          <p className="text-sm text-gray-600 md:text-base">
            자유롭게 글을 작성하고 이미지를 공유하세요
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg md:rounded-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold md:text-xl">팔로우</h3>
          <p className="text-sm text-gray-600 md:text-base">
            관심있는 사용자를 팔로우하고 소식을 받아보세요
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg md:rounded-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <svg
              className="h-6 w-6 text-purple-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
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
