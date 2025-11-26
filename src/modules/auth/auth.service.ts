import { PrismaService } from '@/database/prisma/prisma.service'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthenticateBodySchema } from './dto/authenticate.dto'
import { compare } from 'bcryptjs'

type JwtTyp = 'USER' | 'ORG_CLIENT' | 'ORG_PRO'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async authenticate({ email, password }: AuthenticateBodySchema) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        userProfile: { select: { id: true } },
        member: {
          select: {
            id: true,
            role: true,
            type: true,
            organizationId: true,
            organization: {
              select: {
                id: true,
                type: true,
                proProfile: { select: { id: true } },
                clientProfile: { select: { id: true } },
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const hasUserProfile = !!user.userProfile
    const hasMember = !!user.member

    if (!hasUserProfile && !hasMember) {
      throw new BadRequestException(
        'User has no active context (no profile or organization).',
      )
    }

    if (hasUserProfile && hasMember) {
      throw new BadRequestException(
        'User is linked to multiple contexts (profile and organization).',
      )
    }

    let typ: JwtTyp
    let ctx: {
      orgId: string | null
      memberId: string | null
      profileId: string | null
      role?: string
    }

    if (hasUserProfile) {
      const userProfileId = user.userProfile?.id
      if (!userProfileId) {
        throw new BadRequestException('User had no user profile.')
      }
      typ = 'USER'
      ctx = {
        orgId: null,
        memberId: null,
        profileId: userProfileId,
      }
    } else {
      const m = user.member!
      if (m.type === 'PRO') {
        const proProfileId = m.organization.proProfile?.id
        if (!proProfileId) {
          throw new BadRequestException(
            'Organization of type PRO without proProfile.',
          )
        }
        typ = 'ORG_PRO'
        ctx = {
          orgId: m.organizationId,
          memberId: m.id,
          profileId: proProfileId,
          role: m.role,
        }
      } else {
        const clientProfileId = m.organization.clientProfile?.id
        if (!clientProfileId) {
          throw new BadRequestException(
            'Organization of type CLIENT without clientProfile.',
          )
        }
        typ = 'ORG_CLIENT'
        ctx = {
          orgId: m.organizationId,
          memberId: m.id,
          profileId: clientProfileId,
          role: m.role,
        }
      }
    }

    const payload = {
      sub: user.id,
      typ,
      ctx,
      iss: 'workee.auth',
    }

    const accessToken = await this.jwt.signAsync(payload)

    return {
      access_token: accessToken,
    }
  }
}
