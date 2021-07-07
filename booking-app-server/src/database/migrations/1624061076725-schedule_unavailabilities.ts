import { MigrationInterface, QueryRunner } from 'typeorm';

export class scheduleUnavailabilities1624061076725
  implements MigrationInterface
{
  name = 'scheduleUnavailabilities1624061076725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "schedule_un_availabilities" ("id" SERIAL NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "schedule_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2921dd3bbc1db4ae0dab83507d7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_un_availabilities" ADD CONSTRAINT "FK_4379278fcbf4636b3c747ae7d05" FOREIGN KEY ("schedule_id") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule_un_availabilities" DROP CONSTRAINT "FK_4379278fcbf4636b3c747ae7d05"`,
    );
    await queryRunner.query(`DROP TABLE "schedule_un_availabilities"`);
  }
}
