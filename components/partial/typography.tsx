import { cn } from '@/app/libs/utils';
import React from 'react';

export interface TypographyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2';
}

const variantClasses: Record<NonNullable<TypographyProps['variant']>, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  body1: 'text-base',
  body2: 'text-sm',
};

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  className,
  children,
  ...props
}) => {
  return (
    <p className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </p>
  );
};

export default Typography;
