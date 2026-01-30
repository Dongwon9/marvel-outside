import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { LoadingSkeleton } from "../LoadingSkeleton";
import Header from "./Header";
import { useAuth } from "../../hooks/useAuth";

export default function AppLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

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
