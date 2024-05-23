import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeleteForStaticPageRelations1716395955840
  implements MigrationInterface
{
  name = 'AddDeleteForStaticPageRelations1716395955840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "static_page_lang" DROP CONSTRAINT "FK_0e83d106e1b1e604eba29b896f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_page_lang" ADD CONSTRAINT "FK_0e83d106e1b1e604eba29b896f0" FOREIGN KEY ("page_id") REFERENCES "static_page"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "static_page_lang" DROP CONSTRAINT "FK_0e83d106e1b1e604eba29b896f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "static_page_lang" ADD CONSTRAINT "FK_0e83d106e1b1e604eba29b896f0" FOREIGN KEY ("page_id") REFERENCES "static_page"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
