import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../../common/dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Response } from 'express';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ForgotPasswordEmailDto } from '../dto/forgot-password-email.dto';
import { UserService } from '../../user/services/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(loginDto);
    if (response.token) {
      res.set({
        Authorization: response.token,
      });
    }
    res.json(response).end();
  }

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  //@ResetPasswordApiDocs()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Res() res: Response,
  ) {
    const token = await this.authService.resetPassword(body);
    res
      .set({
        Authorization: token,
      })
      .json({ message: 'Success', token })
      .end();
  }

  //@ForgotPasswordApiDocs()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordEmailDto) {
    return this.userService.sendForgotPasswordCode(email);
  }
}
