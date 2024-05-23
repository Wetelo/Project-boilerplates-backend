import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailToVerification1716464571439 implements MigrationInterface {
  name = 'AddEmailToVerification1716464571439';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verification" ADD "email" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verification" DROP COLUMN "email"`,
    );
  }
}
