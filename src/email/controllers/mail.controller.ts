import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MailService } from '../services/mailing.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('mail')
export class MailController {
  constructor(private readonly mail: MailService) {}
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  @Post('test-email')
  async mailTest(@Body() { email }) {
    await this.mail.sendTest(email);
    return {
      success: true,
    };
  }
}
