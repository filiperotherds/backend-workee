import { z } from 'zod'

export const createClientAddressBodySchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
})

export type CreateClientAddressBodySchema = z.infer<
  typeof createClientAddressBodySchema
>
