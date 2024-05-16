import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';
import { CONFIG } from './src/common/enums/config';
import { MainSeeder } from './src/seeds/MainSeeder';
import { User } from './src/user/entities/user.entity';
import { config } from 'dotenv';
import { Log } from './src/logger/entities/log.entity';
import { CreateUser1714493291084 } from './migrations/1714493291084-create_user';
import { CreateLog1714494159359 } from './migrations/1714494159359-create_log';
import { FileEntity } from './src/file/entities/file.entity';
import { AddFileEntity1714564472204 } from './migrations/1714564472204-add_file_entity';
import { AddStatusToUser1714661688778 } from './migrations/1714661688778-add_status_to_user';
import { UserVerification } from './src/user/entities/user-verification.entity';
import { AddUserVerification1714686851253 } from './migrations/1714686851253-add_user_verification';
import { AddRefreshToken1715180605959 } from './migrations/1715180605959-add_refresh_token';
import { StaticPage } from './src/static-pages/entities/static-pages.entity';
import { AddStaticPage1715779621743 } from './migrations/1715779621743-add_static_page';
import { AddUniqueToTitle1715868471649 } from './migrations/1715868471649-add_unique_to_title';
import { StaticPageLang } from './src/static-pages/entities/static-pages-lang.entity';
import { AddStaticPagesLang1715878559815 } from './migrations/1715878559815-add_static_pages_lang';

config();
const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get(CONFIG.POSTGRES_HOST),
  port: configService.get(CONFIG.POSTGRES_PORT),
  username: configService.get(CONFIG.POSTGRES_USER),
  password: configService.get(CONFIG.POSTGRES_PASSWORD),
  database: configService.get(CONFIG.POSTGRES_DB),
  entities: [
    Log,
    User,
    FileEntity,
    UserVerification,
    StaticPage,
    StaticPageLang,
  ],
  migrations: [
    CreateUser1714493291084,
    CreateLog1714494159359,
    AddFileEntity1714564472204,
    AddStatusToUser1714661688778,
    AddUserVerification1714686851253,
    AddRefreshToken1715180605959,
    AddStaticPage1715779621743,
    AddUniqueToTitle1715868471649,
    AddStaticPagesLang1715878559815,
  ],
  seeds: [MainSeeder],
};

export default new DataSource(options);
