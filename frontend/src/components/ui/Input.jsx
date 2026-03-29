import React from 'react';
import { CheckCircle } from 'lucide-react';

const Input = React.forwardRef(function Input(
  { label, error, helper, className = '', required = false, success = false, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={`input-field ${
            error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400 pr-9'
              : success
              ? 'border-teal-400 focus:ring-teal-400 focus:border-teal-400 pr-9'
              : ''
          } ${className}`}
          aria-invalid={!!error}
          {...props}
        />
        {success && !error && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500 pointer-events-none" />
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-sm text-slate-500">{helper}</p>}
    </div>
  );
});

export default Input;
