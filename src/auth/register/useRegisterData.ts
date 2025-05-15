import { useState } from 'react';
import { registerSchema, RegisterSchema } from './register_schema';

type Errors = Record<string, string>;

export const useRegisterData = () => {
    const [data, setData] = useState<RegisterSchema>({
        name: '',
        surname: '',
        email: '',
        password: '',
        address: { cep: '', number: '', complement: '' }
      });
       const [errors, setErrors] = useState<Errors>({});
  const [isValid, setIsValid] = useState(false);

  const update = (field: string, value: string | number) =>
    setData(prev =>
      field.startsWith('address.')
        ? {
            ...prev,
            address: {
              ...prev.address,
              [field.split('.')[1] as keyof RegisterSchema['address']]: value
            }
          }
        : { ...prev, [field]: value }
    );

  const validate = () => {
    const result = registerSchema.safeParse(data);

    if (result.success) {
      setErrors({});
      setIsValid(true);
    } else {
      const errs: Errors = {};
      result.error.errors.forEach(e => (errs[e.path.join('.')] = e.message));
      setErrors(errs);
      setIsValid(false);
    }
    return result.success;
  };

  return { data, errors, isValid, update, validate };
};
