import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { InputPrimary } from '../../_components/input/PrimaryInput';
import { Button } from '../../_components/buttons/PrimaryButton';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Page: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<LoginFormInputs> = data => {
    console.log('Login data:', data);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
          <svg className="absolute w-full h-full" viewBox="0 0 500 500" fill="none">
            <path d="M0,100 Q250,200 500,100" stroke="#00AEEF33" strokeWidth="1" fill="none" />
            <path d="M0,200 Q250,300 500,200" stroke="#00AEEF33" strokeWidth="1" fill="none" />
            <path d="M0,300 Q250,400 500,300" stroke="#00AEEF33" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <div>

        </div>

        <div className="z-10 text-center">
          <h1 className="text-3xl font-bold text-[#00c864]">RSA</h1>
          <p className="text-[#00c864] text-lg">Reportyng Ambient<br />System</p>
        </div>
      </div>

      <div className="w-1/2 bg-[#094e1e] flex items-center justify-center relative">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
          <h2 className="text-center text-gray-800 text-lg font-medium mb-6">Informe suas credenciais para acessar a aplicação</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <InputPrimary
                id="email"
                type="email"
                {...register('email', { required: 'Login é obrigatório' })}
                placeholder="Login"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <InputPrimary
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Senha é obrigatória' })}
                placeholder="Senha"
                className="w-full px-4 py-3 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <Button
              label='Login'
              type="submit"
              className="w-full py-3 bg-[#00c864] text-white font-semibold rounded-md hover:bg-green-800 transition"
            />
            </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>SETIN - Secretaria de Tecnologia da Informação</p>
            <p>
              Suporte: <a href="#" className="underline hover:text-green-700">CATI - Central de Atendimento em TI</a>
            </p>
          </div>
        </div>

        <div className="absolute bottom-2 right-4 text-white text-xs opacity-70">Versão 1.0.1</div>
      </div>
    </div>
  );
};

export default Page;
