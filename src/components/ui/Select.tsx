import React from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => (
    <label className="block">
      {label ? <span className="field-label">{label}</span> : null}
      <select
        ref={ref}
        className={cn(
          'h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition hover:border-slate-300 focus:border-primary',
          error && 'border-red-300 focus:border-red-500',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  ),
);

Select.displayName = 'Select';
