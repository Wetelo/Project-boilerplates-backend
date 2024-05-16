import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueToTitle1715868471649 implements MigrationInterface {
  name = 'AddUniqueToTitle1715868471649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "static_page" ALTER COLUMN "title" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_page" ADD CONSTRAINT "UQ_bc330e5144335e7eaeaeb9ca6fe" UNIQUE ("title")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "static_page" DROP CONSTRAINT "UQ_bc330e5144335e7eaeaeb9ca6fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_page" ALTER COLUMN "title" DROP NOT NULL`,
    );
  }
}
