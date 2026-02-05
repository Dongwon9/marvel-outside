import { Link } from "react-router-dom";

import HeaderRight from "../Header-right";
import SearchBar from "../searchbar";

export default function HeaderDesktop() {
  return (
    <header className="border-light sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 lg:py-4">
          <Link
            to="/"
            className="text-primary text-xl font-bold transition-colors hover:text-blue-700 md:text-2xl"
          >
            Marvel Outside
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-6 text-base">
            <Link
              to="/board"
              className="font-medium transition-colors hover:text-blue-600"
            >
              게시판 목록
            </Link>
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
            <HeaderRight />
          </nav>
        </div>

        {/* Search Bar */}
        <div className="py-3 lg:pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
