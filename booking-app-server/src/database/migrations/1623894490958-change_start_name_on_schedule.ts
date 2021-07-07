import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeStartNameOnSchedule1623894490958
  implements MigrationInterface
{
  name = 'changeStartNameOnSchedule1623894490958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule" RENAME COLUMN "starts_time" TO "start_time"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule" RENAME COLUMN "start_time" TO "starts_time"`,
    );
  }
}
