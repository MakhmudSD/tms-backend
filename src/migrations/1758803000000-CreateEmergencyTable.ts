import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEmergencyTable1758803000000 implements MigrationInterface {
  name = 'CreateEmergencyTable1758803000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'emergencies',
        schema: 'tms',
        columns: [
          {
            name: 'emergency_id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'emergency_type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'priority',
            type: 'varchar',
            length: '20',
            default: "'medium'",
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'reported'",
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'current_location',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'vehicle_plate',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'driver_name',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'contact_phone',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'reported_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'response_started_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'resolved_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'response_time_minutes',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'response_logs',
            type: 'jsonb',
            isNullable: false,
            default: "'[]'",
          },
          {
            name: 'asset_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'driver_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['asset_id'],
            referencedColumnNames: ['asset_id'],
            referencedTableName: 'assets',
            referencedSchema: 'tms',
            onDelete: 'SET NULL',
          },
          {
            columnNames: ['driver_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'drivers',
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

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
