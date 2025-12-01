import { z } from 'zod'

export const signInBodySchema = z.object({
  identifier: z.string().min(1, 'Missing email or phone number.'),
  password: z.string(),
})

export type SignInBodySchema = z.infer<typeof signInBodySchema>