import {MigrationInterface, QueryRunner} from "typeorm";

export class cancelled1624923575295 implements MigrationInterface {
    name = 'cancelled1624923575295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" ADD "cancelled_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "cancelled_at"`);
    }

}
