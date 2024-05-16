import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStaticPagesLang1715878559815 implements MigrationInterface {
  name = 'AddStaticPagesLang1715878559815';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "static_page_lang" ("id" SERIAL NOT NULL, "lang_id" character varying NOT NULL, "content" character varying, "title" character varying NOT NULL, "page_id" integer, CONSTRAINT "PK_b96447debb1ebf579053cab0a1f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_page_lang" ADD CONSTRAINT "FK_0e83d106e1b1e604eba29b896f0" FOREIGN KEY ("page_id") REFERENCES "static_page"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "static_page_lang" DROP CONSTRAINT "FK_0e83d106e1b1e604eba29b896f0"`,
    );
    await queryRunner.query(`DROP TABLE "static_page_lang"`);
  }
}
