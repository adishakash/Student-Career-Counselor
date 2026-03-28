import React from 'react';

const Input = React.forwardRef(function Input(
  { label, error, helper, className = '', required = false, ...props },
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
      <input
        ref={ref}
        className={`input-field ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-sm text-slate-500">{helper}</p>}
    </div>
  );
});

export default Input;
