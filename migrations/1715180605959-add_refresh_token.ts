import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshToken1715180605959 implements MigrationInterface {
  name = 'AddRefreshToken1715180605959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "currentHashedRefreshToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "currentHashedRefreshToken"`,
    );
  }
}
