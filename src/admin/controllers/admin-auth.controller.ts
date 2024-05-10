import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../common/dto/login.dto';
import { AuthService } from '../../auth/services/auth.service';
//import { AdminAuthLoginApiDocs } from '../docs/admin-auth/admin-auth-login-api-docs.decorator';

@ApiTags('admin/auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  //@AdminAuthLoginApiDocs()
  //ADD Docs
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() login: LoginDto) {
    //TODO fix with refresh
    return await this.authService.login(login);
  }
}
