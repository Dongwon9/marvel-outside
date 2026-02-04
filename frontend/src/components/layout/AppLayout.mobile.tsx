import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { LoadingSkeleton } from "../LoadingSkeleton";
import HeaderMobile from "./Header.mobile";
import { useAuth } from "../../hooks/useAuth";

export default function AppLayoutMobile() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <HeaderMobile />

      <main className="flex-1 px-3 py-4 sm:px-4 sm:py-6">
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
        <div className="px-3 py-4 sm:px-4 sm:py-6">
          <p className="text-center text-xs text-gray-500">
            © 2026 Marvel Outside. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
