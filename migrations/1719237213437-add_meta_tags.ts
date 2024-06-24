import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetaTags1719237213437 implements MigrationInterface {
  name = 'AddMetaTags1719237213437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "meta_tag" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "keywords" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "image_id" integer, CONSTRAINT "UQ_7c62e0d1fdb558481c158e07996" UNIQUE ("slug"), CONSTRAINT "UQ_7b7ef4a1f3a2dec8bd8b96bdc3d" UNIQUE ("title"), CONSTRAINT "REL_46cf5b75ba339f22d177771965" UNIQUE ("image_id"), CONSTRAINT "PK_939c320026f158a8c53514e4dcd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isEmailVerified"`);
    await queryRunner.query(
      `ALTER TABLE "meta_tag" ADD CONSTRAINT "FK_46cf5b75ba339f22d1777719654" FOREIGN KEY ("image_id") REFERENCES "file_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "meta_tag" DROP CONSTRAINT "FK_46cf5b75ba339f22d1777719654"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`DROP TABLE "meta_tag"`);
  }
}
