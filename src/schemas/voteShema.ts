import { z } from "zod";

export const voteSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').nonempty('O nome é obrigatório'),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
      message: 'Digite um email válido',
    }),
  selectedSlots: z.array(z.string()).min(1, 'Selecione pelo menos um horário para votar.'),
});