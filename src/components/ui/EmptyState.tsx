import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={cn('rounded-lg border border-dashed border-line bg-white p-8 text-center', className)}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
        {icon ?? <ClipboardList className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </motion.div>
  );
}
