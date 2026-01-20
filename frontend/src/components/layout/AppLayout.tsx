import { Suspense, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import SearchBar from "../searchbar";

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex items-center justify-between py-3 lg:py-4">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 transition-colors hover:text-blue-700 md:text-2xl"
            >
              Marvel Outside
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 text-base md:flex">
              <Link
                to="/feed"
                className="font-medium transition-colors hover:text-blue-600"
              >
                피드
              </Link>
              <Link
                to="/post"
                className="font-medium transition-colors hover:text-blue-600"
              >
                게시글
              </Link>
              <Link
                to="/settings"
                className="font-medium transition-colors hover:text-blue-600"
              >
                설정
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                가입
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
              aria-label="메뉴 열기"
            >
              <svg
                className="h-6 w-6"
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
            <nav className="flex flex-col gap-2 border-t border-gray-200 py-3 md:hidden">
              <Link
                to="/feed"
                className="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                피드
              </Link>
              <Link
                to="/post"
                className="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                게시글
              </Link>
              <Link
                to="/settings"
                className="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                설정
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-blue-600 px-3 py-2 text-center text-blue-600 transition-colors hover:bg-blue-50"
                onClick={() => setMenuOpen(false)}
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-3 py-2 text-center text-white transition-colors hover:bg-blue-700"
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

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                <p className="mt-2 text-gray-600">로딩 중...</p>
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2026 Marvel Outside. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
