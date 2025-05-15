import React, { InputHTMLAttributes, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const inputVariants = cva(
  'w-full rounded-md border px-4 py-3 text-base transition-colors duration-150 focus:outline-none',
  {
    variants: {
      intent: {
        default: 'border-gray-300 focus:ring-2 focus:ring-green-600',
        error: 'border-red-600 focus:ring-2 focus:ring-red-600',
        disabled: 'bg-gray-100 cursor-not-allowed opacity-50',
      },
      size: {
        sm: 'text-sm px-3 py-2',
        md: 'text-base px-4 py-3',
        lg: 'text-lg px-5 py-4',
      },
    },
    defaultVariants: {
      intent: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  icon?: ReactNode;
  error?: string | boolean;
}

export const InputPrimary: React.FC<InputProps> = ({
  intent,
  size,
  icon,
  error,
  disabled,
  className,
  ...props
}) => {
const currentIntent = disabled
    ? 'disabled'
    : error
    ? 'error'
    : intent;

  return (
    <div className="relative">
      <input
        className={clsx(
          inputVariants({ intent: currentIntent, size }),
          className
        )}
        disabled={disabled}
        {...props}
      />

      {icon && (
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}

      {typeof error === 'string' && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
