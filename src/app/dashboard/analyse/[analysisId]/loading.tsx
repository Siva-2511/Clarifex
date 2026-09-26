import { Skeleton } from "@/components/ui/skeleton";

/** Analysis workspace loading skeleton */
export default function AnalysisLoading() {
  return (
    <div className="flex h-full" aria-busy="true" aria-label="Loading analysis">
      {/* Left panel */}
      <div className="w-80 border-r bg-card/40 p-4 space-y-4 shrink-0">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-32 ml-auto" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}
