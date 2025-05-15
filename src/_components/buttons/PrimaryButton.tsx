import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-bold transition-colors duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      intent: {
        contained: 'bg-[#00c864] text-white hover:bg-green-800',
        outlined: 'border border-[--primary] bg-transparent text-[--primary] hover:bg-[--primary]/10',
        underlined: 'text-[--primary] underline shadow-none hover:text-[--hover]',
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      intent: 'contained',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({
  intent,
  size,
  className,
  label,
  ...props
}) => {
  return (
    <button
      className={clsx(buttonVariants({ intent, size }), className)}
      {...props}
    >
      {label}
    </button>
  );
};
