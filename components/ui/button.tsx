import { cn } from '@/app/libs/utils';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={cn(
        'rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none',
        className
      )}
      {...props}>
      {children}
    </button>
  );
};
