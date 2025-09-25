import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingOrderColumns1758802552753 implements MigrationInterface {
    name = 'AddMissingOrderColumns1758802552753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tms"."users" DROP CONSTRAINT "FK_users_branch_id"`);
        await queryRunner.query(`ALTER TABLE "tms"."assets" DROP CONSTRAINT "FK_assets_branch_id"`);
        await queryRunner.query(`ALTER TABLE "tms"."settlements" DROP CONSTRAINT "FK_settlements_client_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_orders_driver"`);
        await queryRunner.query(`DROP INDEX "public"."idx_orders_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_drivers_status"`);
        await queryRunner.query(`ALTER TABLE "tms"."settlements" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "estimated_fare" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "actual_fare" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "scheduled_pickup_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "actual_pickup_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "actual_dropoff_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tms"."waypoints" ADD "latitude" numeric(10,8)`);
        await queryRunner.query(`ALTER TABLE "tms"."waypoints" ADD "longitude" numeric(11,8)`);
        await queryRunner.query(`ALTER TABLE "tms"."settlements" ADD "settlement_date" date`);
        await queryRunner.query(`ALTER TABLE "tms"."settlements" ADD "total_amount" numeric(12,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tms"."settlements" DROP COLUMN "total_amount"`);
        await queryRunner.query(`ALTER TABLE "tms"."settlements" DROP COLUMN "settlement_date"`);
        await queryRunner.query(`ALTER TABLE "tms"."waypoints" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "tms"."waypoints" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "actual_dropoff_time"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "actual_pickup_time"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "scheduled_pickup_time"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "actual_fare"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "estimated_fare"`);
        await queryRunner.query(`ALTER TABLE "tms"."settlements" ADD "amount" numeric(10,2)`);
        await queryRunner.query(`CREATE INDEX "idx_drivers_status" ON "drivers" ("status") `);
        await queryRunner.query(`CREATE INDEX "idx_orders_status" ON "orders" ("status") `);
        await queryRunner.query(`CREATE INDEX "idx_orders_driver" ON "orders" ("driver_id") `);
        await queryRunner.query(`ALTER TABLE "tms"."settlements" ADD CONSTRAINT "FK_settlements_client_id" FOREIGN KEY ("client_id") REFERENCES "tms"."clients"("client_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tms"."assets" ADD CONSTRAINT "FK_assets_branch_id" FOREIGN KEY ("branch_id") REFERENCES "tms"."branches"("branch_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tms"."users" ADD CONSTRAINT "FK_users_branch_id" FOREIGN KEY ("branch_id") REFERENCES "tms"."branches"("branch_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
