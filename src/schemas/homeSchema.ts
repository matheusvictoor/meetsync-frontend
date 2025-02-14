import { z } from "zod";

export const createRoomSchema = z.object({
  name: z
    .string()
    .regex(/^[A-Za-z\s]+$/, 'O nome deve conter apenas letras')
    .min(3, 'O nome deve ter pelo menos 3 caracteres'),
});

export const joinRoomSchema = z.object({
  roomId: z.string().uuid('ID inválido'),
});