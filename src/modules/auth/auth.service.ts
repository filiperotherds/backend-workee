import { PrismaService } from '@/database/prisma/prisma.service'
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SignInBodySchema } from './schemas/sign-in.schema'
import { compare, hash } from 'bcryptjs'
import { SignUpBodySchema } from './schemas/sign-up.schema'
import { Slug } from '@/common/value-objects/slug'

type JwtTyp = 'USER' | 'ORG_CLIENT' | 'ORG_PRO'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async singin({ identifier, password }: SignInBodySchema) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
      include: {
        userProfile: true,
        member: {
          include: {
            organization: {
              include: {
                providerProfile: true,
                clientProfile: true,
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

    let typ: JwtTyp
    let ctx: {
      orgId: string | null
      memberId: string | null
      profileId: string | null
      role?: string
      slug?: string
    }

    if (user.accountType === 'INDIVIDUAL') {
      if (!user.userProfile) {
        throw new BadRequestException('Individual account without profile.')
      }

      typ = 'USER'
      ctx = {
        orgId: null,
        memberId: null,
        profileId: user.userProfile.id,
      }
    } else {
      if (!user.member) {
        throw new BadRequestException(
          'Business user has no organization linked.',
        )
      }

      const org = user.member.organization

      if (org.type === 'PROVIDER') {
        if (!org.providerProfile) {
          throw new BadRequestException(
            'Provider Organization missing profile.',
          )
        }

        typ = 'ORG_PRO'
        ctx = {
          orgId: org.id,
          memberId: user.member.id,
          profileId: org.providerProfile.id,
          role: user.member.role,
          slug: org.slug,
        }
      } else {
        if (!org.clientProfile) {
          throw new BadRequestException('Client Organization missing profile.')
        }

        typ = 'ORG_CLIENT'
        ctx = {
          orgId: org.id,
          memberId: user.member.id,
          profileId: org.clientProfile.id,
          role: user.member.role,
          slug: org.slug,
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

  async singup({
    name,
    identifier,
    password,
    accountType,
    orgName,
    orgType,
  }: SignUpBodySchema) {
    const isEmail = identifier.includes('@')

    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    })

    if (userExists) {
      throw new ConflictException('User already exists.')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          password: hashedPassword,
          accountType,
          ...(isEmail ? { email: identifier } : { phone: identifier }),
        },
      })

      if (accountType === 'INDIVIDUAL') {
        await tx.userProfile.create({
          data: {
            userId: user.id,
          },
        })
      } else if (accountType === 'BUSINESS') {
        if (!orgName || !orgType) {
          throw new BadRequestException('Missing organization details')
        }

        const { slugValue } = await Slug.createFromText(orgName, this.prisma)

        const organization = await tx.organization.create({
          data: {
            name: orgName,
            slug: slugValue,
            type: orgType,
            ownerId: user.id,
            members: {
              create: {
                userId: user.id,
                role: 'ADMIN',
              },
            },
          },
        })

        if (orgType === 'PROVIDER') {
          await tx.providerProfile.create({
            data: { organizationId: organization.id },
          })
        } else {
          await tx.clientProfile.create({
            data: { organizationId: organization.id },
          })
        }
      }
    })
  }
}
