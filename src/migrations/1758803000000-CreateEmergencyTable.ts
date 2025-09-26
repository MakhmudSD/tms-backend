import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEmergencyTable1758803000000 implements MigrationInterface {
  name = 'CreateEmergencyTable1758803000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create emergencies table using raw SQL to avoid foreign key issues
    await queryRunner.query(`
      CREATE TABLE "tms"."emergencies" (
        "emergency_id" SERIAL NOT NULL,
        "emergency_type" character varying(50) NOT NULL,
        "priority" character varying(20) NOT NULL DEFAULT 'medium',
        "status" character varying(20) NOT NULL DEFAULT 'reported',
        "description" text NOT NULL,
        "current_location" character varying(255),
        "vehicle_plate" character varying(50),
        "driver_name" character varying(100),
        "contact_phone" character varying(50),
        "reported_at" TIMESTAMP NOT NULL DEFAULT now(),
        "response_started_at" TIMESTAMP,
        "resolved_at" TIMESTAMP,
        "response_time_minutes" integer,
        "response_logs" jsonb NOT NULL DEFAULT '[]',
        "asset_id" integer,
        "driver_id" integer,
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_emergencies_emergency_id" PRIMARY KEY ("emergency_id")
      )
    `);

    // Create indexes for better performance using raw SQL
    await queryRunner.query(`CREATE INDEX "IDX_emergencies_status" ON "tms"."emergencies" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_emergencies_priority" ON "tms"."emergencies" ("priority")`);
    await queryRunner.query(`CREATE INDEX "IDX_emergencies_reported_at" ON "tms"."emergencies" ("reported_at")`);
    await queryRunner.query(`CREATE INDEX "IDX_emergencies_asset_id" ON "tms"."emergencies" ("asset_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_emergencies_driver_id" ON "tms"."emergencies" ("driver_id")`);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "tms"."emergencies" 
      ADD CONSTRAINT "FK_emergencies_asset_id" 
      FOREIGN KEY ("asset_id") 
      REFERENCES "tms"."assets"("asset_id") 
      ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "tms"."emergencies" 
      ADD CONSTRAINT "FK_emergencies_driver_id" 
      FOREIGN KEY ("driver_id") 
      REFERENCES "public"."drivers"("id") 
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "tms"."emergencies" DROP CONSTRAINT "FK_emergencies_driver_id"`);
    await queryRunner.query(`ALTER TABLE "tms"."emergencies" DROP CONSTRAINT "FK_emergencies_asset_id"`);

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "tms"."IDX_emergencies_driver_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "tms"."IDX_emergencies_asset_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "tms"."IDX_emergencies_reported_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "tms"."IDX_emergencies_priority"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "tms"."IDX_emergencies_status"`);

    // Drop table
    await queryRunner.dropTable('tms.emergencies');
  }
}
