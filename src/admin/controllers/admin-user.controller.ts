import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AdminUserService } from '../services/admin-user.service';
import { AdminGetAllUsersFilterDto } from '../dto/admin-get-all-users-filters.dto';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';
import { AdminGetAllUsersApiDocs } from '../docs/admin-get-all-users-api-docs.decorator';
import { AdminGetUserApiDocs } from '../docs/admin-get-user-api-docs.decorator';
import { AdminUpdateUserApiDocs } from '../docs/admin-update-user-api-docs.decorator';

@ApiTags('admin/user')
@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @AdminGetAllUsersApiDocs()
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUsers(@Query() filterDto: AdminGetAllUsersFilterDto) {
    return await this.adminUserService.getUsers(filterDto);
  }

  @AdminGetUserApiDocs()
  @Get('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.adminUserService.getUser(id);
  }

  @AdminUpdateUserApiDocs()
  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminUpdateUserDto: AdminUpdateUserDto,
  ) {
    return await this.adminUserService.updateUser(id, adminUpdateUserDto);
  }
}
