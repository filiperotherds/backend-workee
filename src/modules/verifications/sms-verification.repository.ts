import { env } from '@/config/env'
import { Injectable } from '@nestjs/common'
import twilio from 'twilio'
import { SendSmsSchema } from './schemas/send-sms.schema'
import { VerifySmsSchema } from './schemas/verify-sms.schema'

const accountSid = env.TWILIO_ACCOUNT_SID
const authToken = env.TWILIO_AUTH_TOKEN

const client = twilio(accountSid, authToken)

@Injectable()
export class SmsVerification {
  async sendSms({ to, channel }: SendSmsSchema) {
    const sendResponse = client.verify.v2
      .services(accountSid)
      .verifications.create({ to, channel })
      .then((verification) => console.log(verification.sid))

    return sendResponse
  }

  async verifySms({ to, code }: VerifySmsSchema) {
    const verifyResponse = client.verify.v2
      .services(accountSid)
      .verificationChecks.create({ to, code })
      .then((verification_check) => console.log(verification_check.status))

    return verifyResponse
  }
}
