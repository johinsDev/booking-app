import { MigrationInterface, QueryRunner } from 'typeorm';

export class appointment1624078173991 implements MigrationInterface {
  name = 'appointment1624078173991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "employee_id" integer NOT NULL, "service_id" integer NOT NULL, "client_email" character varying NOT NULL, "client_name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0e1f94f7ef24d239d15ec3d965" ON "appointment" ("uuid") `,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_a170b01d5845a629233fb80a51a" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" ADD CONSTRAINT "FK_cad339a11ed0408e417671162fb" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_cad339a11ed0408e417671162fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment" DROP CONSTRAINT "FK_a170b01d5845a629233fb80a51a"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_0e1f94f7ef24d239d15ec3d965"`);
    await queryRunner.query(`DROP TABLE "appointment"`);
  }
}
