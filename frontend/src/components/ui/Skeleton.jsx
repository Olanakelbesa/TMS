import { cn } from "../../lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/60", className)}
      {...props}
    />
  );
}

export function TalentCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 h-64 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <div>
        <Skeleton className="h-6 w-3/4 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="pt-6 border-t border-slate-100">
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
