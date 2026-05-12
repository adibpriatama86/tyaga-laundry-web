import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className, ...props }, ref) => (
    <label className="block">
      {label ? <span className="field-label">{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-primary',
          error && 'border-red-300 focus:border-red-500',
          className,
        )}
        {...props}
      />
      {helper ? <span className="mt-1 block text-xs text-muted">{helper}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  ),
);

Input.displayName = 'Input';
