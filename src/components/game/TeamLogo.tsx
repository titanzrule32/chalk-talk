import { useState } from 'react';

interface TeamLogoProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-16 w-16',
  md: 'h-28 w-28',
  lg: 'h-40 w-40',
};

export function TeamLogo({ src, alt, size = 'lg' }: TeamLogoProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-2xl bg-slate-100 text-4xl`}
      >
        &#127944;
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`${sizeClasses[size]} object-contain`}
      draggable={false}
    />
  );
}
