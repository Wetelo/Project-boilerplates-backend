import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
