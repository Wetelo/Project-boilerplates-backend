import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '../common/enums/user-role.enum';
import { CONFIG } from '../common/enums/config';
import * as process from 'process';

export class UserSeeder implements Seeder {
  private SAULT = 10;

  public async run(dataSource: DataSource): Promise<void> {
    const ADMIN_EMAIL = process.env[CONFIG.ADMIN_EMAIL];
    const ADMIN_PASSWORD = process.env[CONFIG.ADMIN_PASSWORD];
    const userRepository = dataSource.getRepository(User);

    const newUserData: Partial<User> = {
      firstName: 'Awesome',
      lastName: 'Developer',
      email: ADMIN_EMAIL,
      password: await bcrypt.hash(ADMIN_PASSWORD, this.SAULT),
      role: UserRoleEnum.ADMIN,
    };

    const existedUser = await userRepository.findOneBy({
      email: newUserData.email,
    });
    if (!existedUser) {
      const newUser = userRepository.create(newUserData);
      await userRepository.save(newUser);
    }
  }
}
