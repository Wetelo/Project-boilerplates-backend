import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import {
  Between,
  FindOptionsWhere,
  Not,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { AdminGetAllUsersFilterDto } from '../dto/admin-get-all-users-filters.dto';
import { AdminGetAllUsersResponseDto } from '../dto/responses/admin-get-all-users-response.dto';
import { AdminGetUserResponseDto } from '../dto/responses/admin-get-user-response.dto';
import { AdminUserUpdateResponseDto } from '../dto/responses/admin-user-update-response.dto';
import { SortOrderEnum } from '../../common/enums/sort-order.enum';
import { PAGINATION_DEFAULT_SETTINGS } from '../../common/constants/pagination';
import { UsersSortByEnum } from '../enum/users-sort-by.enum';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { generateSearchConditions } from '../../utils/filters/entities/search';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers({
    page = PAGINATION_DEFAULT_SETTINGS.page,
    limit = PAGINATION_DEFAULT_SETTINGS.limit,
    sortBy,
    order = SortOrderEnum.DESC,
    ...findFields
  }: AdminGetAllUsersFilterDto): Promise<AdminGetAllUsersResponseDto> {
    const repository: SelectQueryBuilder<User> = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.phone',
        'user.role',
        'user.createdAt',
        'user.status',
      ])
      .orderBy(
        sortBy ? UsersSortByEnum[sortBy] : UsersSortByEnum['createdAt'],
        order,
      );

    const where: FindOptionsWhere<User> = {
      role: Not(UserRoleEnum.ADMIN),
    };

    const additionalWhereConditions: FindOptionsWhere<User> =
      this.getUsersWhereConditions(findFields);

    repository.where({ ...where, ...additionalWhereConditions });

    const paginator: Pagination<User> = await paginate<User>(repository, {
      page,
      limit,
    });

    return new Pagination<AdminGetUserResponseDto>(
      paginator.items.map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        phone: item.phone,
        role: item.role,
        status: item.status,
        createdAt: item.createdAt,
      })),
      paginator.meta,
    );
  }

  private getUsersWhereConditions({
    createdAt,
    status,
    ...searchFields
  }: Partial<AdminGetAllUsersFilterDto>) {
    const whereConditions: FindOptionsWhere<User> = {};
    if (createdAt) {
      const dateFrom = new Date(createdAt);
      dateFrom.setHours(0);
      const dateTo = new Date(dateFrom);
      dateTo.setDate(dateFrom.getDate() + 1);
      whereConditions.createdAt = Between(dateFrom, dateTo);
    }

    if (status) {
      whereConditions.status = status;
    }

    const searchConditions = generateSearchConditions<User>(searchFields);
    Object.assign(whereConditions, searchConditions);

    return whereConditions;
  }

  async getUser(id: number): Promise<AdminGetUserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async updateUser(
    id: number,
    updateUserDto: AdminUpdateUserDto,
  ): Promise<AdminUserUpdateResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign<User, Partial<User>>(user, updateUserDto);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
