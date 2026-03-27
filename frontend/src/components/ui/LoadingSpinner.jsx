import React from 'react';
import { Loader2 } from 'lucide-react';

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
};

export default function LoadingSpinner({ size = 'md', className = '', text = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizes[size]} text-primary-800 animate-spin`} />
      {text && <p className="text-slate-500 text-sm font-medium">{text}</p>}
    </div>
  );
}
