export default function Home() {
  return (
    <section className="space-y-6 md:space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl p-6 md:p-12 text-white shadow-lg">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
          Marvel Outside에 오신 것을 환영합니다
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-blue-50 mb-6 md:mb-8">
          다양한 콘텐츠를 공유하고 소통하는 커뮤니티 플랫폼
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <a
            href="/signup"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
          >
            시작하기
          </a>
          <a
            href="/post"
            className="px-6 py-3 bg-blue-600 text-white border-2 border-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
          >
            게시글 보기
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-lg md:rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
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
          <h3 className="text-lg md:text-xl font-semibold mb-2">게시글 작성</h3>
          <p className="text-sm md:text-base text-gray-600">
            자유롭게 글을 작성하고 이미지를 공유하세요
          </p>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-green-600"
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
          <h3 className="text-lg md:text-xl font-semibold mb-2">팔로우</h3>
          <p className="text-sm md:text-base text-gray-600">
            관심있는 사용자를 팔로우하고 소식을 받아보세요
          </p>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-purple-600"
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
          <h3 className="text-lg md:text-xl font-semibold mb-2">소통</h3>
          <p className="text-sm md:text-base text-gray-600">
            댓글과 좋아요로 다른 사용자와 소통하세요
          </p>
        </div>
      </div>
    </section>
  );
}
