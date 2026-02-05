import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import { Button } from "./ui";

export default function HeaderRight() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    void navigate("/");
  };

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
