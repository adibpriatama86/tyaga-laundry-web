import { cn } from '../../utils/cn';

type BadgeVariant = 'blue' | 'green' | 'amber' | 'slate' | 'red' | 'sky';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  blue: 'bg-primary-soft text-primary',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  slate: 'bg-slate-100 text-slate-700',
  red: 'bg-red-50 text-red-700',
  sky: 'bg-sky-50 text-sky-700',
};

export function Badge({ children, variant = 'slate', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
}
