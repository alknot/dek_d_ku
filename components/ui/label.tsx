import { cn } from '@/app/libs/utils';
import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label: React.FC<LabelProps> = ({ className, children, ...props }) => {
  return (
    <label className={cn('text-sm font-medium', className)} {...props}>
      {children}
    </label>
  );
};
