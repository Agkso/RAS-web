import { FC } from "react";
import { Input } from "../../components/Inputs/Input";
import { useRegisterData } from "./useRegisterData";

export const RegisterForm: FC = () => {
    const { data, errors, isValid, update, validate } = useRegisterData();
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validate()) {
        console.log('Pronto para chamar service ➜', data);
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-900">
        <div className="grid grid-cols-2 w-[900px] bg-white rounded-lg overflow-hidden shadow-lg">
          <aside className="flex flex-col items-center justify-center p-10 text-green-600">
            <h1 className="text-4xl font-bold mb-2">RSA</h1>
            <p className="text-lg text-center leading-tight">
              Reportyng Ambient <br /> System
            </p>
          </aside>
  
          <section className="bg-green-900 flex items-center justify-center p-10">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl p-8 w-full max-w-md space-y-4 shadow-lg"
            >
              <h2 className="text-lg font-semibold text-center text-green-900">
                Crie sua conta
              </h2>
  
              <Input
                label="Nome"
                name="name"
                value={data.name}
                error={errors.name}
                onChange={update}
              />
              <Input
                label="Sobrenome"
                name="surname"
                value={data.surname}
                error={errors.surname}
                onChange={update}
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={data.email}
                error={errors.email}
                onChange={update}
              />
              <Input
                label="Senha"
                type="password"
                name="password"
                value={data.password}
                error={errors.password}
                onChange={update}
              />
              <Input
                label="CEP"
                name="address.cep"
                value={data.address.cep}
                error={errors['address.cep']}
                onChange={update}
              />
              <Input
                label="Número"
                type="number"
                name="address.number"
                value={data.address.number}
                error={errors['address.number']}
                onChange={update}
              />
              <Input
                label="Complemento"
                name="address.complement"
                value={data.address.complement ?? ''}
                error={errors['address.complement']}
                onChange={update}
              />
  
              <button
                type="submit"
                className="w-full p-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
              >
                {isValid ? 'Enviar' : 'Validar'}
              </button>
            </form>
          </section>
        </div>
      </div>
    );
  };
  
  