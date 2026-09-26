import { Skeleton } from "@/components/ui/skeleton";

export default function VaultLoading() {
  return (
    <div className="flex-1 p-6 space-y-6" aria-busy="true" aria-label="Loading vault">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-64 ml-auto" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
