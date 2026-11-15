import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "rect";
}

export function Skeleton({
  className,
  variant = "rect",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200 dark:bg-slate-800",
        variant === "circle" && "rounded-full",
        variant === "text" && "h-4 rounded-md",
        variant === "rect" && "rounded-xl",
        className
      )}
      {...props}
    />
  );
}

/* ============================================
   Preset skeleton untuk halaman-halaman ZYXELL
   ============================================ */

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] p-6">
        <Skeleton variant="circle" className="h-24 w-24" />
        <Skeleton variant="text" className="w-32" />
        <Skeleton variant="text" className="w-48" />
      </div>
      <div className="space-y-4 rounded-2xl border border-[var(--border)] p-6">
        <Skeleton variant="text" className="w-24" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" className="w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-2xl border border-[var(--border)] p-4"
        >
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/3" />
            <Skeleton variant="text" className="w-2/3" />
          </div>
          <Skeleton variant="circle" className="h-6 w-6" />
        </div>
      ))}
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton variant="text" className="h-7 w-32" />
        <Skeleton variant="text" className="w-48" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
