import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen dark:bg-zinc-800 overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-[250px] border-r h-full flex flex-col p-2 gap-4 bg-white dark:bg-zinc-800 shrink-0">
        {/* User Info */}
        <div className="flex items-center gap-3 px-2 py-1">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>

        {/* Search */}
        <div className="px-2">
          <Skeleton className="h-8 w-full rounded-md" />
        </div>

        {/* Nav Items */}
        <div className="flex-1 space-y-2 px-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
          <div className="pt-4 space-y-2">
            <Skeleton className="h-px w-full" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`custom-${i}`} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-2 pt-2 border-t">
          <Skeleton className="h-8 w-full" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1 flex flex-col bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="h-32 p-8 flex flex-col justify-end gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex-1 p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-white/50 dark:bg-zinc-800/50 rounded-md flex items-center px-4 gap-4"
            >
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
