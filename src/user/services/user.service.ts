import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LIBS } from '../../common/enums/libs';
import { bcrypt } from '../../utils/libs/bcrypt/bcrypt.type';
import { HASH_ROUNDS } from '../../common/constants/auth';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserVerificationService } from './user-verification.service';
import { MailService } from '../../email/services/mail.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(LIBS.BCRYPT) private readonly bcryptLib: bcrypt,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userVerificationService: UserVerificationService,
    private readonly mailService: MailService,
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
}
