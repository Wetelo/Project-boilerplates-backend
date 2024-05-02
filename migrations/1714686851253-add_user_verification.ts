import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserVerification1714686851253 implements MigrationInterface {
  name = 'AddUserVerification1714686851253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_verification" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "expired_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "user_id" integer, CONSTRAINT "PK_679edeb6fcfcbc4c094573e27e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verification" ADD CONSTRAINT "FK_3d40c1993bffba775f0ffad0cae" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verification" DROP CONSTRAINT "FK_3d40c1993bffba775f0ffad0cae"`,
    );
    await queryRunner.query(`DROP TABLE "user_verification"`);
  }
}
