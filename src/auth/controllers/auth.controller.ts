import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../../common/dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { Response, Request } from 'express';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ForgotPasswordEmailDto } from '../dto/forgot-password-email.dto';
import { UserService } from '../../user/services/user.service';
import { ResetPasswordApiDocs } from '../docs/reset-password.decorator';
import { ForgotPasswordApiDocs } from '../docs/forgot-password.decorator';
import { RegisterApiDocs } from '../docs/register.decorator';
import { LoginApiDocs } from '../docs/login.decorator';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { GetJwtPayload } from '../../utils/decorators/jwt-payload.decorator';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetRefreshApiDocs } from '../../user/docs/get-refresh.decorator';
import { GetLogoutApiDocs } from '../../user/docs/logout.decorator';
import { CreateInvitedUserDto } from '../dto/create-invite-user.dto';
import { RegisterInvitedUserApiDocs } from '../docs/register-invited-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @LoginApiDocs()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(loginDto);
    res.setHeader('Set-Cookie', [response.refreshTokenCookie.cookie]);
    delete response.refreshTokenCookie;
    res.json(response).end();
  }

  @GetRefreshApiDocs()
  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetJwtPayload() user: JwtPayload,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const response = await this.authService.refresh(user, req.cookies?.Refresh);
    res.setHeader('Set-Cookie', [response.refreshTokenCookie.cookie]);
    delete response.refreshTokenCookie;
    res.json(response).end();
  }

  @RegisterApiDocs()
  @Post('/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const response = await this.authService.register(registerDto);
    res.setHeader('Set-Cookie', [response.refreshTokenCookie]);
    delete response.refreshTokenCookie;
    res.json(response).end();
  }

  @RegisterInvitedUserApiDocs()
  @HttpCode(HttpStatus.OK)
  @Post('/register-by-invite')
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() body: CreateInvitedUserDto, @Res() res: Response) {
    const response = await this.authService.createUserByInvite(body);
    res.setHeader('Set-Cookie', [response.refreshTokenCookie]);
    delete response.refreshTokenCookie;
    res.json(response).end();
  }

  @ResetPasswordApiDocs()
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto, @Res() res: Response) {
    const response = await this.authService.resetPassword(body);
    res.setHeader('Set-Cookie', [response.refreshTokenCookie.cookie]);
    res.json({ token: response.token }).end();
  }

  @ForgotPasswordApiDocs()
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgotPasswordEmailDto) {
    return this.userService.sendForgotPasswordCode(email);
  }

  @GetLogoutApiDocs()
  @HttpCode(HttpStatus.OK)
  @Post('log-out')
  @UseGuards(JwtAuthGuard)
  async logOut(
    @GetJwtPayload() user: JwtPayload,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    await this.userService.removeRefreshToken(user.id, req.cookies?.Refresh);
    res.clearCookie('Refresh');
    res.json().end();
  }
}
