import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  element: React.ReactElement;
  kickOnAuthFail?: boolean;
}

export function ProtectedRoute({
  element,
  kickOnAuthFail = false,
}: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null; // AppLayout의 스켈레톤이 표시됨
  }

  if (!isLoggedIn) {
    if (kickOnAuthFail) {
      alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
}
