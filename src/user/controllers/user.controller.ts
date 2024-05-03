import {
  Body,
  Controller,
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

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  async updateUser(
    @Body() updateDto: UpdateUserDto,
    @GetJwtPayload() { id: userId }: JwtPayload,
  ) {
    return await this.userService.updateUser(updateDto, userId);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard, ActiveUserGuard)
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @GetJwtPayload() user: JwtPayload,
  ) {
    await this.userService.updatePassword(user.id, body);
    return { message: 'Password was changed successfully' };
  }
}
