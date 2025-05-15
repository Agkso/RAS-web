import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'O campo NOME é obrigatório'),
  surname: z.string().min(1, 'O campo SOBRENOME é obrigatório'),
  email: z.string().email('O endereço de e‑mail é inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  address: z.object({
    cep: z
      .string()
      .regex(/^\d{8}$/, 'CEP deve ter 8 dígitos numéricos'),
    number: z
      .string()
      .regex(/^[1-9]\d*$/, 'O campo NÚMERO é obrigatório'),
    complement: z.string().optional()
  })
});

export type RegisterSchema = z.infer<typeof registerSchema>;
