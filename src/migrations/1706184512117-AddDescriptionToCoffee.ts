import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToCoffee1706184512117 implements MigrationInterface {
  name = 'AddDescriptionToCoffee1706184512117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);
  }
}
