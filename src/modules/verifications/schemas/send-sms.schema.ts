import { z } from 'zod'

export const sendSmsSchema = z.object({
  to: z.coerce.string(),
  channel: z.string(),
})

export type SendSmsSchema = z.infer<typeof sendSmsSchema>
