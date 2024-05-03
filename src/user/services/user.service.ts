import {
  BadRequestException,
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

@Injectable()
export class UserService {
  constructor(
    @Inject(LIBS.BCRYPT) private readonly bcryptLib: bcrypt,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userVerificationService: UserVerificationService,
    private readonly mailService: MailService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async setNewUserPassword(newPassword: string, userId: number) {
    const password = await this.bcryptLib.hash(newPassword, HASH_ROUNDS);
    await this.userRepository.update({ id: userId }, { password });
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
    const existUser = await this.userRepository.findOne({
      where: {
        email: updateDto.email,
        id: Not(id),
      },
    });
    if (existUser) {
      throw new BadRequestException('User with such email already exist');
    }
    if (updateDto.avatarFileId) {
      const file = await this.fileRepository.findOne({
        where: { id: updateDto.avatarFileId },
      });
      if (!file) {
        throw new NotFoundException('File not found');
      }
      user.avatar = file;
    }
    Object.assign<User, Partial<User>>(user, updateDto);
    await this.userRepository.save(user);
    return {
      id: user.id,
      ...updateDto,
    };
  }

  public async updatePassword(
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
}
