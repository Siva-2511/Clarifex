import { Skeleton } from "@/components/ui/skeleton";

/** Dashboard loading skeleton — shown while server components fetch data */
export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-6 p-6" aria-busy="true" aria-label="Loading dashboard">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Recent documents */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
