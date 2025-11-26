import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ClientService } from '../client.service'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard' 
import { CurrentUser } from '@/common/decorators/current-user-decorator' 
import type { TokenPayload } from '@/modules/auth/strategies/jwt.strategy'

@Controller('/client/address')
@UseGuards(JwtAuthGuard)
export class GetClientAddressController {
  constructor(private clientService: ClientService) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: TokenPayload) {
    const userId = user.sub

    return this.clientService.getAddressesByUserId(userId)
  }
}
