import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import { AuthService } from './auth.service'
import {
  type SignInBodySchema,
  signInBodySchema,
} from './schemas/sign-in.schema'
import {
  type SignUpBodySchema,
  signUpBodySchema,
} from './schemas/sign-up.schema'

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @UsePipes(new ZodValidationPipe(signInBodySchema))
  async signin(@Body() body: SignInBodySchema) {
    const result = await this.authService.singin(body)

    return result
  }

  @Post('/signup')
  @UsePipes(new ZodValidationPipe(signUpBodySchema))
  async signup(@Body() body: SignUpBodySchema) {
    await this.authService.singup(body)
  }
}
