import { cn } from "@/lib/utils";

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-xl bg-[var(--surface-secondary)]", className)} />
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <SkeletonBox className="aspect-video w-full" />
      <div className="flex gap-3">
        <SkeletonBox className="h-9 w-9 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-3 w-2/3" />
          <SkeletonBox className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function VideoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}
