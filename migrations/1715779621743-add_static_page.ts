import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStaticPage1715779621743 implements MigrationInterface {
  name = 'AddStaticPage1715779621743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "static_page" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying, "content" character varying, "no_index" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "UQ_b8f89191899a6aa3de51f843442" UNIQUE ("slug"), CONSTRAINT "PK_6e73c6614c07ee6f40ceb9fd46c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "static_page"`);
  }
}
