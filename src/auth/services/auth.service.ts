import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    @Inject(ENTITIES.USER)
    private readonly user: UserType,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(LIBS.BCRYPT) private readonly bcryptLib: bcrypt,
    private readonly userService: UserService,
    private readonly userVerificationService: UserVerificationService,
  ) {}

  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.checkLoginCredentials({ email, password });
    const token = await this.generateToken(user);
    return {
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      token,
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

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
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
    await this.userRepository.save(user);
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      id: user.id,
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
    await this.userService.setNewUserPassword(newPassword, resetCode.user.id);
    await this.userVerificationService.deleteCode(resetCode);
    return this.generateToken(resetCode.user);
  }
}
