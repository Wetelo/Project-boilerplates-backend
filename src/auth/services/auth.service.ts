import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { LoginDto } from '../../common/dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { LIBS } from '../../common/enums/libs';
import { bcrypt } from '../../utils/libs/bcrypt/bcrypt.type';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { ENTITIES } from '../../common/enums/entities';
import { UserType } from '../../user/types/user.type';
import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { LoginResponseDto } from '../dto/responses/login-response.dto';
import { RegisterResponseDto } from '../dto/responses/register-response.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserService } from '../../user/services/user.service';
import { UserVerificationService } from '../../user/services/user-verification.service';
import { HASH_ROUNDS } from '../../common/constants/auth';
import { ConfigService } from '@nestjs/config';
import { CONFIG } from '../../common/enums/config';
import { RefreshTokenCookieDto } from '../dto/refresh-token-cookie.dto';
import { CreateInvitedUserDto } from '../dto/create-invite-user.dto';
import { UserInvitation } from '../../user/entities/user-invitation.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ENTITIES.USER)
    private readonly user: UserType,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInvitation)
    private readonly userInvite: Repository<UserInvitation>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(LIBS.BCRYPT) private readonly bcryptLib: bcrypt,
    private readonly userService: UserService,
    private readonly userVerificationService: UserVerificationService,
  ) {}

  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.checkLoginCredentials({ email, password });
    const token = await this.generateToken(user);
    const refreshTokenCookie = await this.getCookieWithJwtRefreshToken({
      id: user.id,
      role: user.role,
    });
    await this.userService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );
    return {
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      token,
      refreshTokenCookie,
    };
  }

  async refresh({ id }: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = await this.generateToken(user);
    const refreshTokenCookie = await this.getCookieWithJwtRefreshToken({
      id: user.id,
      role: user.role,
    });
    await this.userService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );
    return {
      token,
      refreshTokenCookie,
    };
  }
  async generateToken({ id, role }: JwtPayload, signOptions?: JwtSignOptions) {
    const token = await this.jwtService.signAsync(
      {
        id,
        role,
      },
      signOptions,
    );
    return token;
  }

  async getCookieWithJwtRefreshToken(
    payload: JwtPayload,
  ): Promise<RefreshTokenCookieDto> {
    const tokenExpireTimeDays = `${this.configService.get(CONFIG.JWT_REFRESH_EXPIRATION_TIME)}d`;
    const token = await this.generateToken(payload, {
      secret: this.configService.get(CONFIG.JWT_REFRESH_SECRET),
      expiresIn: tokenExpireTimeDays,
    });
    const cookieExpireTimeSeconds: number =
      parseInt(tokenExpireTimeDays) * 24 * 3600; // convert day to seconds
    const domain = this.configService.get(CONFIG.COOKIE_DOMAIN);
    const cookie = `Refresh=${token}; HttpOnly=true; Secure=true; Domain=${domain}; SameSite=Strict; Path=/; Max-Age=${cookieExpireTimeSeconds}`;
    return {
      cookie,
      token,
    };
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<RegisterResponseDto & { refreshTokenCookie: string }> {
    const existedUser = await this.userRepository.findOne({
      where: {
        email: registerDto.email,
      },
    });
    if (existedUser) {
      throw new ConflictException('This email is already taken');
    }

    const user = new this.user();
    user.firstName = registerDto.firstName;
    user.lastName = registerDto.lastName;
    user.email = registerDto.email;
    user.phone = registerDto.phone;
    user.role = UserRoleEnum.USER;
    user.password = await this.bcryptLib.hash(
      registerDto.password,
      HASH_ROUNDS,
    );
    const savedUser = await this.userRepository.save(user);

    const token: string = await this.generateToken(savedUser);
    const refreshTokenCookie = await this.getCookieWithJwtRefreshToken({
      id: savedUser.id,
      role: savedUser.role,
    });
    await this.userService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      savedUser.id,
    );
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      id: user.id,
      token,
      refreshTokenCookie: refreshTokenCookie.cookie,
    };
  }

  async checkLoginCredentials({ email, password }: LoginDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!user.status) {
      throw new BadRequestException('User was blocked');
    }
    if (user.deletedAt) {
      throw new BadRequestException('User doesn`t exist');
    }
    const isPasswordEqual = await this.verifyPassword(password, user.password);
    if (!isPasswordEqual) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  private async verifyPassword(newPassword: string, currentPassword: string) {
    const isPassEqual = await this.bcryptLib.compare(
      newPassword,
      currentPassword,
    );
    return isPassEqual;
  }

  async resetPassword({ code, email, newPassword }: ResetPasswordDto) {
    const resetCode =
      await this.userVerificationService.validateVerificationCode({
        email,
        code,
      });
    const user = resetCode.user;
    await this.userService.setNewUserPassword(newPassword, user.id);
    await this.userVerificationService.deleteCode(resetCode);
    const token: string = await this.generateToken(user);
    const refreshTokenCookie = await this.getCookieWithJwtRefreshToken({
      id: user.id,
      role: user.role,
    });
    await this.userService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );

    return {
      token,
      refreshTokenCookie,
    };
  }

  getCookiesForLogOut() {
    const cookieExpireTimeSeconds: number = 0;
    const domain = this.configService.get(CONFIG.COOKIE_DOMAIN);
    return [
      `Refresh=; HttpOnly=true; Secure=true; Domain=${domain}; SameSite=Strict; Path=/; Max-Age=${cookieExpireTimeSeconds}`,
    ];
  }

  async createUserByInvite(
    createUserDto: CreateInvitedUserDto,
  ): Promise<RegisterResponseDto & { refreshTokenCookie: string }> {
    const existedUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existedUser) {
      throw new ConflictException('This email is already taken');
    }

    const invitedUser = await this.userInvite.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (!invitedUser) {
      throw new NotFoundException('Invitation not found');
    }
    await this.checkInviteExpiration(invitedUser);
    const user = new this.user();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.phone = createUserDto.phone;
    user.role = UserRoleEnum.USER;
    user.password = await this.bcryptLib.hash(
      createUserDto.password,
      HASH_ROUNDS,
    );
    const savedUser = await this.userRepository.save(user);

    const token: string = await this.generateToken(savedUser);
    const refreshTokenCookie = await this.getCookieWithJwtRefreshToken({
      id: savedUser.id,
      role: savedUser.role,
    });
    await this.userService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      savedUser.id,
    );
    await this.deleteInvitedUser(savedUser.id);
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      id: user.id,
      token,
      refreshTokenCookie: refreshTokenCookie.cookie,
    };
  }

  private async checkInviteExpiration(invitationData: UserInvitation) {
    if (invitationData.expiredAt.getTime() < new Date().getTime()) {
      await this.deleteInvitedUser(invitationData.id);
      throw new BadRequestException(
        'Your invite link was expired. Please try again',
      );
    }
  }

  private async deleteInvitedUser(userId: number) {
    await this.userInvite.delete({ id: userId });
  }
}
