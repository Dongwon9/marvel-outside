import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { logout, getMe } from "../api/auth";

export default function HeaderRight() {
  console.log("🔵 HeaderRight 렌더링");

  const [user, setUser] = useState(
    null as null | { id: string; email: string; name: string },
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    void fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          {user.name}
          <Link
            to="/settings"
            className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            설정
          </Link>
          <button
            onClick={() => void handleLogout()}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <a
            href="/login"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            로그인
          </a>
          <a
            href="/signup"
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            회원가입
          </a>
        </>
      )}
    </div>
  );
}
