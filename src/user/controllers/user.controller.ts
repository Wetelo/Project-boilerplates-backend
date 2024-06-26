import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ActiveUserGuard } from '../../auth/guards/active-user.guard';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { GetJwtPayload } from '../../utils/decorators/jwt-payload.decorator';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UpdateProfileApiDocs } from '../docs/update-profile.decorator';
import { UpdatePasswordApiDocs } from '../docs/update-password.decorator';
import { GetProfileApiDocs } from '../docs/get-profile.decorator';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { UpdatePhoneDto } from '../dto/update-phone.dto';
import { ChangeEmailApiDocs } from '../docs/change-email.decorator';
import { ChangePhoneApiDocs } from '../docs/change-phone.decorator';
import { ChangeDataVerifyCodeApiDocs } from '../docs/change-data-verify-code.decorator';
import { ChangeEmailDto } from '../dto/change-email.dto';
import { CheckEmailDto } from '../dto/check-email.dto';
import { CheckEmailApiDocs } from '../docs/check-email.api.docs';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @CheckEmailApiDocs()
  @Post('check-email')
  async checkUserEmailAvailability(@Body() body: CheckEmailDto) {
    await this.userService.checkEmailAvailability({
      email: body.email,
    });
    return { message: 'Email is available' };
  }

  @UpdateProfileApiDocs()
  @Put('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  async updateUser(
    @Body() updateDto: UpdateUserDto,
    @GetJwtPayload() { id: userId }: JwtPayload,
  ) {
    return await this.userService.updateUser(updateDto, userId);
  }

  @ChangeDataVerifyCodeApiDocs()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  @Post('/change-email/verify-code')
  async getVerifyCodeForEmailChanging(
    @GetJwtPayload() { id: userId }: JwtPayload,
    @Body() changeEmailDto: ChangeEmailDto,
  ) {
    return await this.userService.sendVerifyCode(userId, changeEmailDto.email);
  }

  @ChangeDataVerifyCodeApiDocs()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  @Post('/change-phone/verify-code')
  async getVerifyCodeForPhoneChanging(
    @GetJwtPayload() { id: userId }: JwtPayload,
  ) {
    return await this.userService.sendVerifyCode(userId);
  }

  @ChangeEmailApiDocs()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  @Patch('email')
  async changeEmail(
    @Body() updateEmailDto: UpdateEmailDto,
    @GetJwtPayload() { id: userId }: JwtPayload,
  ) {
    return await this.userService.changeEmail(updateEmailDto, userId);
  }

  @ChangePhoneApiDocs()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  @Patch('phone')
  async changePhone(
    @Body() updatePhoneDto: UpdatePhoneDto,
    @GetJwtPayload() { id: userId }: JwtPayload,
  ) {
    return await this.userService.changePhone(updatePhoneDto, userId);
  }

  @UpdatePasswordApiDocs()
  @Put('password')
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @GetJwtPayload() user: JwtPayload,
  ) {
    await this.userService.updatePassword(user.id, body);
    return { message: 'Password was changed successfully' };
  }

  @GetProfileApiDocs()
  @Get('/profile')
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  async getProfile(@GetJwtPayload() user: JwtPayload) {
    return await this.userService.getProfile(user.id);
  }
}
