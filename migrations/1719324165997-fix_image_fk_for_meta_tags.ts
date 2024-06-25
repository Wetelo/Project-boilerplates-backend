import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixImageFkForMetaTags1719324165997 implements MigrationInterface {
  name = 'FixImageFkForMetaTags1719324165997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meta_tag" DROP CONSTRAINT "FK_46cf5b75ba339f22d1777719654"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meta_tag" ADD CONSTRAINT "FK_46cf5b75ba339f22d1777719654" FOREIGN KEY ("image_id") REFERENCES "file_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meta_tag" DROP CONSTRAINT "FK_46cf5b75ba339f22d1777719654"`,
    );
    await queryRunner.query(
      `ALTER TABLE "meta_tag" ADD CONSTRAINT "FK_46cf5b75ba339f22d1777719654" FOREIGN KEY ("image_id") REFERENCES "file_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
