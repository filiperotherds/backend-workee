import { z } from 'zod'

export const verifySmsSchema = z.object({
  to: z.coerce.string(),
  code: z.coerce.string(),
})

export type VerifySmsSchema = z.infer<typeof verifySmsSchema>
