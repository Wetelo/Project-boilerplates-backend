import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserInvite1719951795130 implements MigrationInterface {
  name = 'AddUserInvite1719951795130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_invitation" ("id" SERIAL NOT NULL, "expired_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "email" character varying NOT NULL, CONSTRAINT "UQ_bfb40fd7def80c6b67652f588c2" UNIQUE ("email"), CONSTRAINT "PK_41026b90b70299ac5dc0183351a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_invitation"`);
  }
}
