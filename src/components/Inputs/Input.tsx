import { FC } from "react";

type InputProps = {
  label: string;
  name: string;
  value: string | number;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  onChange: (field: string, value: string) => void;
};

export const Input: FC<InputProps> = ({
  label,
  name,
  value,
  error,
  type = 'text',
  onChange
}) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={label}
      value={value}
      onChange={e => onChange(name, e.target.value)}
      className={`w-full p-2 border rounded ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);
