import { useState } from "react";
import { Link } from "react-router-dom";

import SearchBar from "../searchbar";
import HeaderRight from "../Header-right";

export default function HeaderMobile() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClose = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          <Link
            to="/"
            className="text-lg font-bold text-blue-600 transition-colors hover:text-blue-700"
          >
            Marvel Outside
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
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
          <nav className="flex flex-col gap-2 border-t border-gray-200 py-3">
            <Link
              to="/board"
              className="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
              onClick={handleMenuClose}
            >
              게시판 목록
            </Link>
            <Link
              to="/feed"
              className="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
              onClick={handleMenuClose}
            >
              피드
            </Link>
            <Link
              to="/post"
              className="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
              onClick={handleMenuClose}
            >
              게시글
            </Link>
            <HeaderRight />
          </nav>
        )}

        {/* Search Bar */}
        <div className="py-3">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
