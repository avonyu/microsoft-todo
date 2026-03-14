import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen max-h-screen flex bg-gray-100 dark:bg-zinc-800 overflow-hidden">
      {/* Sidebar Skeleton */}
      <aside className="w-[250px] flex flex-col h-full bg-white dark:bg-zinc-900 shrink-0 border-r border-gray-200 dark:border-zinc-700">
        <div className="h-full flex flex-col overflow-hidden px-1 pt-3">
          {/* User Info */}
          <div className="flex items-center gap-2.5 mb-2 px-2">
            <Skeleton className="h-11 w-11 rounded-full bg-gray-200 dark:bg-zinc-700" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-zinc-700" />
              <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-zinc-700" />
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col px-2 mb-4">
            <Skeleton className="h-8 w-full rounded-md bg-gray-200 dark:bg-zinc-700" />
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto flex flex-col space-y-1 px-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-1.5">
                <Skeleton className="h-5 w-5 rounded-sm bg-gray-200 dark:bg-zinc-700" />
                <Skeleton className="h-4 flex-1 bg-gray-200 dark:bg-zinc-700" />
              </div>
            ))}
            <div className="h-px bg-gray-200 dark:bg-zinc-700 mx-2 my-2" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`custom-${i}`} className="flex items-center gap-3 px-2 py-1.5">
                <Skeleton className="h-5 w-5 rounded-sm bg-gray-200 dark:bg-zinc-700" />
                <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-zinc-700" />
              </div>
            ))}
          </nav>

          {/* Footer - New List Button */}
          <div className="flex w-full border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            <div className="flex-1 flex items-center gap-2 p-2">
              <Skeleton className="h-4 w-4 bg-gray-200 dark:bg-zinc-700" />
              <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-zinc-700" />
            </div>
            <div className="px-2 flex items-center">
              <Skeleton className="h-4 w-4 bg-gray-200 dark:bg-zinc-700" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-200 dark:bg-zinc-700">
        <div className="flex flex-col px-12 h-full">
          {/* Header Skeleton */}
          <div className="py-6 flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-sm bg-gray-300 dark:bg-zinc-600" />
            <Skeleton className="h-9 w-40 bg-gray-300 dark:bg-zinc-600" />
          </div>

          {/* Task list */}
          <div className="flex-1 py-1 flex flex-col space-y-0.5 overflow-y-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-3 bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded text-sm"
              >
                <Skeleton className="h-5 w-5 rounded-full bg-gray-300 dark:bg-zinc-600" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-gray-300 dark:bg-zinc-600" />
                </div>
                <Skeleton className="h-4 w-4 bg-gray-300 dark:bg-zinc-600" />
              </div>
            ))}
          </div>

          {/* Add task input skeleton */}
          <div className="mt-2 h-20">
            <div className="flex items-center gap-2 px-3 py-3 bg-white/80 dark:bg-zinc-800/80 backdrop-blur rounded">
              <Skeleton className="h-5 w-5 rounded-full bg-gray-300 dark:bg-zinc-600" />
              <Skeleton className="h-4 w-20 bg-gray-300 dark:bg-zinc-600" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
