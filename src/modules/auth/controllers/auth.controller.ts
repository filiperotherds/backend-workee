import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import z from 'zod'
import { AuthService } from '../auth.service'
import {
  type AuthenticateBodySchema,
  authenticateBodySchema,
} from '../dto/authenticate.dto'

type JwtTyp = 'USER' | 'ORG_CLIENT' | 'ORG_PRO'

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authService: AuthService) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const result = await this.authService.authenticate(body)

    return result
  }
}
