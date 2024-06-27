import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveRefreshTokenToSepTable1719409480238
  implements MigrationInterface
{
  name = 'MoveRefreshTokenToSepTable1719409480238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_refresh_token" ("id" SERIAL NOT NULL, "hashed_refresh_token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "user_id" integer, CONSTRAINT "PK_2f86bb87603956e017efa2e74ec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_refresh_token" ADD CONSTRAINT "FK_24e64309aedf1c04d857a456dfc" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_refresh_token" DROP CONSTRAINT "FK_24e64309aedf1c04d857a456dfc"`,
    );
    await queryRunner.query(`DROP TABLE "user_refresh_token"`);
  }
}
