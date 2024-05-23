import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNullableToEmail1716471561758 implements MigrationInterface {
  name = 'AddNullableToEmail1716471561758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verification" ALTER COLUMN "email" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verification" ALTER COLUMN "email" SET NOT NULL`,
    );
  }
}
