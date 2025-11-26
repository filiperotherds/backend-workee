import { z } from 'zod'

export const createAddressBodySchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
  number: z.string()
})

export type CreateAddressBodySchema = z.infer<typeof createAddressBodySchema>
