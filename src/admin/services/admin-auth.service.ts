import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto } from '../../common/dto/login.dto';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../user/services/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRoleEnum } from '../../common/enums/user-role.enum';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login({ email, password }: LoginDto) {
    const isAdmin = await this.userRepository.findOne({
      where: { email, role: UserRoleEnum.ADMIN },
    });
    if (!isAdmin) {
      throw new ForbiddenException('Invalid user');
    }
    const user = await this.authService.checkLoginCredentials({
      email,
      password,
    });
    const token = await this.authService.generateToken(user);
    const refreshTokenCookie =
      await this.authService.getCookieWithJwtRefreshToken({
        id: user.id,
        role: user.role,
      });
    await this.userService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );
    return {
      token,
      refreshTokenCookie: refreshTokenCookie.cookie,
      user: {
        id: user.id,
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}
