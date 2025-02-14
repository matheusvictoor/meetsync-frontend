import { z } from "zod";

export const newRoomSchema = z.object({
    name: z
      .string()
      .nonempty({ message: 'Nome não pode ser vazio' })
      .regex(/^[A-Za-z\s]+$/, 'O nome deve conter apenas letras')
      .min(3, 'O nome deve ter pelo menos 3 caracteres'),
    title: z.string().nonempty({ message: 'Título não pode ser vazio' }).min(5, 'Título deve ter pelo menos 5 caracteres'),
    description: z.string().optional(),
    endDate: z.date(),
    endTime: z.string(),
    selectedDates: z
      .array(
        z.object({
          date: z.date(),
          times: z
            .array(
              z.object({
                start: z.string().nonempty('Selecione um horário'),
                duration: z.string().nonempty('Selecione a duração'),
              })
            )
            .min(1, 'Cada data precisa ter pelo menos um horário'),
        })
      )
      .min(1, 'Defina pelo menos uma data com um horário'),
  });