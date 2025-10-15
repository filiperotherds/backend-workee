import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { UserService } from '../user.service'
import type { CreateAccountBodySchema } from '../schema/create-account.schema'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    await this.userService.create({ name, email, password })
  }
}
