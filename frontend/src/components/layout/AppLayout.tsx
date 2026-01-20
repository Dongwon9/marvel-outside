import { Suspense, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import SearchBar from "../searchbar";

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex items-center justify-between py-3 lg:py-4">
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Marvel Outside
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-base">
              <Link
                to="/feed"
                className="font-medium hover:text-blue-600 transition-colors"
              >
                피드
              </Link>
              <Link
                to="/post"
                className="font-medium hover:text-blue-600 transition-colors"
              >
                게시글
              </Link>
              <Link
                to="/settings"
                className="font-medium hover:text-blue-600 transition-colors"
              >
                설정
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                가입
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="메뉴 열기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="md:hidden py-3 border-t border-gray-200 flex flex-col gap-2">
              <Link
                to="/feed"
                className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                피드
              </Link>
              <Link
                to="/post"
                className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                게시글
              </Link>
              <Link
                to="/settings"
                className="px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                설정
              </Link>
              <Link
                to="/login"
                className="px-3 py-2 text-center text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="px-3 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                가입
              </Link>
            </nav>
          )}

          {/* Search Bar */}
          <div className="py-3 lg:pb-4">
            <SearchBar />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
                <p className="mt-2 text-gray-600">로딩 중...</p>
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2026 Marvel Outside. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
