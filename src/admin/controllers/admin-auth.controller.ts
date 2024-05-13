import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../common/dto/login.dto';
import { AdminAuthService } from '../services/admin-auth.service';
import { Response } from 'express';
import { AdminAuthLoginApiDocs } from '../docs/admin-auth-login-api-docs.decorator';
import { AdminAuthResponseDto } from '../dto/responses/admin-auth-response.dto';

@ApiTags('admin/auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authAdminService: AdminAuthService) {}

  @AdminAuthLoginApiDocs()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() login: LoginDto, @Res() res: Response) {
    const response = await this.authAdminService.login(login);
    res.setHeader('Set-Cookie', [response.refreshTokenCookie]);
    delete response.refreshTokenCookie;
    res.json(response).end();
  }
}
