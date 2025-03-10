import { cn } from '@/app/libs/utils';
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'rounded border p-2 focus:border-blue-500 focus:outline-none focus:ring',
        className
      )}
      {...props}
    />
  );
};
