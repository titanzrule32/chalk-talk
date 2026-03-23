import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary:
    'bg-chalk-blue text-white hover:bg-blue-600 active:bg-blue-700',
  secondary:
    'bg-slate-100 text-chalk-text hover:bg-slate-200 active:bg-slate-300',
  danger:
    'bg-chalk-red text-white hover:bg-red-600 active:bg-red-700',
  ghost:
    'bg-transparent text-chalk-blue hover:bg-slate-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[36px]',
  md: 'px-5 py-2.5 text-base min-h-[44px]',
  lg: 'px-6 py-3 text-lg min-h-[52px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
