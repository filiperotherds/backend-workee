import { PrismaService } from '@/database/prisma/prisma.service'
import slugify from 'slugify'

export class Slug {
  public slugValue: string

  private constructor(slugValue: string) {
    this.slugValue = slugValue
  }

  static create(slugValue: string) {
    return new Slug(slugValue)
  }

  static async createFromText(
    text: string,
    prisma: PrismaService,
  ): Promise<Slug> {
    let baseSlug = slugify(text, { lower: true, strict: true })

    const existingOrg = await prisma.organization.findUnique({
      where: { slug: baseSlug },
    })

    if (!existingOrg) {
      return new Slug(baseSlug)
    }

    const randomSuffix = Math.floor(Math.random() * 10000)
    const newSlug = `${baseSlug}-${randomSuffix}`

    return new Slug(newSlug)
  }
}
