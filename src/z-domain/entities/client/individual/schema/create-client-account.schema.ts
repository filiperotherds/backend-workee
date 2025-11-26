import { z } from 'zod'

export const createClientAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type CreateClientAccountBodySchema = z.infer<
  typeof createClientAccountBodySchema
>
