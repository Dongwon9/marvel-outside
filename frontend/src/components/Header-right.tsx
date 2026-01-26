import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout } from "../api/auth";

export default function HeaderRight() {
  // 로그인 상태 확인 (서버에서 확인 필요)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 서버에 현재 인증 상태 확인 요청
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
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
      {isLoggedIn ? (
        <>
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
