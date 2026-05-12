import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/80', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-8 w-36" />
      <Skeleton className="mt-3 h-3 w-28" />
    </div>
  );
}
