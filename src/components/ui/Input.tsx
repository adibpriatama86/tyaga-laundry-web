import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, rightElement, className, ...props }, ref) => (
    <label className="block">
      {label ? <span className="field-label">{label}</span> : null}
      <div className={rightElement ? 'relative' : undefined}>
        <input
          ref={ref}
          className={cn(
            'h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-primary',
            Boolean(rightElement) && 'pr-11',
            error && 'border-red-300 focus:border-red-500',
            className,
          )}
          {...props}
        />
        {rightElement ? <div className="absolute inset-y-0 right-0 flex items-center pr-1">{rightElement}</div> : null}
      </div>
      {helper ? <span className="mt-1 block text-xs text-muted">{helper}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  ),
);

Input.displayName = 'Input';
