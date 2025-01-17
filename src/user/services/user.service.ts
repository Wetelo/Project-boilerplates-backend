import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LIBS } from '../../common/enums/libs';
import { bcrypt } from '../../utils/libs/bcrypt/bcrypt.type';
import { HASH_ROUNDS } from '../../common/constants/auth';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Not, Repository } from 'typeorm';
import { UserVerificationService } from './user-verification.service';
import { MailService } from '../../email/services/mail.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FileEntity } from '../../file/entities/file.entity';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UpdateUserResponseDto } from '../dto/responses/update-user-response.dto';
import { GetUserResponseDto } from '../dto/responses/get-user-response.dto';
import { FileService } from '../../file/services/file.service';
import { UpdatePhoneDto } from '../dto/update-phone.dto';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { ChangePhoneResponseDto } from '../dto/responses/change-phone-response.dto';
import { ChangeEmailResponseDto } from '../dto/responses/change-email-response.dto';
import { ENTITIES } from '../../common/enums/entities';
import { UserRefreshTokenType } from '../types/user-refresh-token.type';
import { UserRefreshToken } from '../entities/user-refresh-token.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(LIBS.BCRYPT) private readonly bcryptLib: bcrypt,
    @Inject(ENTITIES.USER_REFRESH_TOKEN)
    private readonly userRefreshToken: UserRefreshTokenType,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userVerificationService: UserVerificationService,
    private readonly mailService: MailService,
    @InjectRepository(UserRefreshToken)
    private readonly userRefreshTokenRepository: Repository<UserRefreshToken>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly fileService: FileService,
  ) {}

  async checkEmailAvailability({ email }: { email: string }) {
    const existedEmail = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (existedEmail) {
      throw new ConflictException('Email has been already taken');
    }
  }

  async setNewUserPassword(newPassword: string, userId: number) {
    const password = await this.bcryptLib.hash(newPassword, HASH_ROUNDS);
    await this.userRepository.update({ id: userId }, { password });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await this.bcryptLib.hash(
      refreshToken,
      HASH_ROUNDS,
    );
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        refreshTokens: true,
      },
    });
    const newRefreshToken = new this.userRefreshToken();
    newRefreshToken.hashedRefreshToken = currentHashedRefreshToken;
    user.refreshTokens.push(newRefreshToken);
    await this.userRepository.save(user);
  }

  async sendForgotPasswordCode(email: string) {
    const user: User = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { code } = await this.userVerificationService.getVerificationCode(
      user,
      { isResetCode: true },
    );
    await this.mailService.sendForgotPassword({
      email,
      name: user.firstName + user.lastName,
      code,
    });
    return {
      success: true,
    };
  }

  async updateUser(
    updateDto: UpdateUserDto,
    id: number,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateDto.avatarFileUUID) {
      const file = await this.fileRepository.findOne({
        where: { uuid: updateDto.avatarFileUUID },
      });
      if (!file) {
        throw new NotFoundException('File not found');
      }
      user.avatar = file;
      //delete old avatar
      await this.fileService.deleteFile(file.uuid, user.id);
    }
    Object.assign<User, Partial<User>>(user, updateDto);
    await this.userRepository.save(user);
    return {
      id: user.id,
      ...updateDto,
      email: user.email,
      phone: user.phone,
    };
  }

  async updatePassword(
    userId: number,
    { newPassword, currentPassword }: UpdatePasswordDto,
  ): Promise<void> {
    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!(await this.bcryptLib.compare(currentPassword, user.password))) {
      throw new BadRequestException('Invalid password');
    }
    await this.setNewUserPassword(newPassword, user.id);
  }

  async getProfile(id: number): Promise<GetUserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { avatar: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatarFileUUID: user.avatar?.uuid,
    };
  }

  async getUserIfRefreshTokenMatches(userRefreshToken: string, id: number) {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: null, status: true },
      relations: {
        refreshTokens: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let isRefreshTokenMatching = false;
    for (const refreshToken of user.refreshTokens) {
      isRefreshTokenMatching = await this.bcryptLib.compare(
        userRefreshToken,
        refreshToken.hashedRefreshToken,
      );
      if (isRefreshTokenMatching) {
        return {
          id: user.id,
        };
      }
    }
  }

  async removeRefreshToken(id: number, userRefreshToken: string) {
    if (!userRefreshToken) {
      return false;
    }
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        refreshTokens: true,
      },
    });
    let isRefreshTokenMatching = false;
    for (const refreshToken of user.refreshTokens) {
      isRefreshTokenMatching = await this.bcryptLib.compare(
        userRefreshToken,
        refreshToken.hashedRefreshToken,
      );
      if (isRefreshTokenMatching) {
        return await this.userRefreshTokenRepository.delete(refreshToken.id);
      }
    }
  }

  async sendVerifyCode(id: number, email = null) {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { code } = await this.userVerificationService.getVerificationCode(
      user,
      { email },
    );
    await this.mailService.sendVerifyCode({
      email: email ?? user.email,
      name: user.firstName + user.lastName,
      code,
    });
    return {
      success: true,
    };
  }

  async changeEmail(
    { email, code }: UpdateEmailDto,
    id: number,
  ): Promise<ChangeEmailResponseDto> {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const existUser = await this.userRepository.findOne({
      where: {
        email: email,
        id: Not(id),
      },
    });
    if (existUser) {
      throw new BadRequestException('User with such email already exist');
    }
    const verifyCode =
      await this.userVerificationService.validateVerificationCode({
        email: user.email,
        code,
        newEmail: email,
      });
    await this.userRepository.update({ id }, { email });
    await this.userVerificationService.deleteCode(verifyCode);
    return {
      email,
    };
  }

  async changePhone(
    { phone, code }: UpdatePhoneDto,
    id: number,
  ): Promise<ChangePhoneResponseDto> {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //uncomment if need to check phone for unique
    // const existUser = await this.userRepository.findOne({
    //   where: {
    //     phone: phone,
    //     id: Not(id),
    //   },
    // });
    // if (phone) {
    //   throw new BadRequestException('User with such phone already exist');
    // }
    const verifyCode =
      await this.userVerificationService.validateVerificationCode({
        email: user.email,
        code,
      });
    await this.userRepository.update({ id }, { phone });
    await this.userVerificationService.deleteCode(verifyCode);
    return {
      phone,
    };
  }
}
