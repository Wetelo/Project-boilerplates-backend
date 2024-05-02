import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToUser1714661688778 implements MigrationInterface {
  name = 'AddStatusToUser1714661688778';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "status" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
  }
}
