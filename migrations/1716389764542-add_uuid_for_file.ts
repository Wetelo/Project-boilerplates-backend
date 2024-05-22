import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUuidForFile1716389764542 implements MigrationInterface {
  name = 'AddUuidForFile1716389764542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file_entity" ADD "uuid" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file_entity" DROP COLUMN "uuid"`);
  }
}
