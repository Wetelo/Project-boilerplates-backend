import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixFieldNameRefreshToken1719400588020
  implements MigrationInterface
{
  name = 'FixFieldNameRefreshToken1719400588020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "currentHashedRefreshToken" TO "current_hashed_refresh_token"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "current_hashed_refresh_token" TO "currentHashedRefreshToken"`,
    );
  }
}
