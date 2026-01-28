import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { logout, getMe } from "../api/auth";
import { Button } from "./ui";

export default function HeaderRight() {
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
          <Link to="/settings">
            <Button variant="secondary" size="md">
              설정
            </Button>
          </Link>
          <Button
            onClick={() => void handleLogout()}
            variant="danger"
            size="md"
          >
            로그아웃
          </Button>
        </>
      ) : (
        <>
          <a href="/login">
            <Button variant="primary" size="md">
              로그인
            </Button>
          </a>
          <a href="/signup">
            <Button variant="success" size="md">
              회원가입
            </Button>
          </a>
        </>
      )}
    </div>
  );
}
