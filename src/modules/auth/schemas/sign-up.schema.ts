import { z } from 'zod'

export const signUpBodySchema = z
  .object({
    name: z.string(),
    identifier: z.string().min(1, 'Missing email or phone number.'),
    password: z.string(),
    accountType: z.enum(['INDIVIDUAL', 'BUSINESS']).default('INDIVIDUAL'),
    orgName: z.string().optional(),
    orgType: z.enum(['PROVIDER', 'CLIENT']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === 'BUSINESS') {
      if (!data.orgName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Organization name is required for Business accounts',
          path: ['orgName'],
        })
      }
      if (!data.orgType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Organization type is required for Business accounts',
          path: ['orgType'],
        })
      }
    }
  })

export type SignUpBodySchema = z.infer<typeof signUpBodySchema>
