import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from '@/config/env'
import z from 'zod'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  typ: z.enum(['USER', 'ORG_CLIENT', 'ORG_PRO']),
  ctx: z.object({
    orgId: z.string().nullable(),
    memberId: z.string().nullable(),
    profileId: z.string().nullable(),
    role: z.string().optional(),
  }),
})

export type TokenPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  validate(payload: TokenPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}
