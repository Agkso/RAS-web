import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeOff } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type LoginForm = {
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha muito curta'),
});

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log('Login enviado:', data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-400">
      <div className="flex w-[320px] flex-col gap-6 rounded-lg bg-white p-8 shadow-lg">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Value"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Value"
                className="w-full rounded-md border border-gray-300 p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className="absolute right-2 top-2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <EyeIcon size={20} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-gray-800 py-2 text-white transition hover:bg-gray-900"
          >
            Sign In
          </button>
        </form>

        <a href="#" className="text-sm text-blue-700 underline hover:text-blue-900">
          Forgot password?
        </a>
      </div>
    </div>
  );
};

export default Page;
