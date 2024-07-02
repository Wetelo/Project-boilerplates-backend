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
import { AddUuidForFile1716389764542 } from './migrations/1716389764542-add_uuid_for_file';
import { AddDeleteForStaticPageRelations1716395955840 } from './migrations/1716395955840-add_delete_for_static_page_relations';
import { AddEmailToVerification1716464571439 } from './migrations/1716464571439-add_email_to_verification';
import { AddNullableToEmail1716471561758 } from './migrations/1716471561758-add_nullable_to_email';
import { MetaTag } from './src/meta-tags/entities/meta-tag.entity';
import { AddMetaTags1719237213437 } from './migrations/1719237213437-add_meta_tags';
import { FixImageFkForMetaTags1719324165997 } from './migrations/1719324165997-fix_image_fk_for_meta_tags';
import { FixFieldNameRefreshToken1719400588020 } from './migrations/1719400588020-fix_field_name_refresh_token';
import { UserInvitation } from './src/user/entities/user-invitation.entity';
import { AddUserInvite1719951795130 } from './migrations/1719951795130-add_user_invite';

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
    MetaTag,
    UserInvitation,
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
    AddUuidForFile1716389764542,
    AddDeleteForStaticPageRelations1716395955840,
    AddEmailToVerification1716464571439,
    AddNullableToEmail1716471561758,
    AddMetaTags1719237213437,
    FixImageFkForMetaTags1719324165997,
    FixFieldNameRefreshToken1719400588020,
    AddUserInvite1719951795130,
  ],
  seeds: [MainSeeder],
};

export default new DataSource(options);
