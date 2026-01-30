export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Logo skeleton */}
          <div className="flex items-center justify-between py-3 lg:py-4">
            <div className="h-8 w-32 bg-gray-200"></div>
            <div className="hidden gap-6 md:flex">
              <div className="h-5 w-12 bg-gray-200"></div>
              <div className="h-5 w-12 bg-gray-200"></div>
              <div className="h-5 w-20 bg-gray-200"></div>
            </div>
          </div>
          {/* Search bar skeleton */}
          <div className="py-3 lg:pb-4">
            <div className="h-10 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="space-y-4">
          <div className="h-8 w-1/3 rounded-lg bg-gray-200"></div>
          <div className="h-4 w-full rounded-lg bg-gray-200"></div>
          <div className="h-4 w-full rounded-lg bg-gray-200"></div>
          <div className="h-4 w-2/3 rounded-lg bg-gray-200"></div>
        </div>
      </main>

      {/* Footer skeleton */}
      <footer className="mt-auto border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto h-4 w-1/2 rounded-lg bg-gray-200"></div>
        </div>
      </footer>
    </div>
  );
}
