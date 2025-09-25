import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1758774600000 implements MigrationInterface {
    name = 'InitSchema1758774600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create TMS schema if it doesn't exist
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "tms"`);

        // Create roles table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tms"."roles" (
                "role_id" SERIAL NOT NULL,
                "role_name" character varying NOT NULL,
                "description" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE ("role_name"),
                CONSTRAINT "PK_roles_role_id" PRIMARY KEY ("role_id")
            )
        `);

        // Create branches table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tms"."branches" (
                "branch_id" SERIAL NOT NULL,
                "branch_name" character varying NOT NULL,
                "address" character varying,
                "phone_number" character varying,
                "manager_name" character varying,
                "status" character varying NOT NULL DEFAULT 'ACTIVE',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_branches_branch_id" PRIMARY KEY ("branch_id")
            )
        `);

        // Create users table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tms"."users" (
                "user_id" SERIAL NOT NULL,
                "login_id" character varying NOT NULL,
                "password_hash" character varying NOT NULL,
                "user_name" character varying NOT NULL,
                "email" character varying,
                "phone_number" character varying,
                "branch_id" integer,
                "role_id" integer,
                "status_code" character varying NOT NULL DEFAULT 'ACTIVE',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_e564194a9a22f8c623354284f75" UNIQUE ("login_id"),
                CONSTRAINT "PK_users_user_id" PRIMARY KEY ("user_id")
            )
        `);

        // Create drivers table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "drivers" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "vehicle" character varying NOT NULL,
                "license_number" character varying,
                "status" character varying NOT NULL DEFAULT 'available',
                "email" character varying,
                "address" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_drivers_id" PRIMARY KEY ("id")
            )
        `);

        // Create orders table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "orders" (
                "id" SERIAL NOT NULL,
                "customer_name" character varying NOT NULL,
                "customer_phone" character varying NOT NULL,
                "pickup_location" character varying NOT NULL,
                "dropoff_location" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "priority" character varying NOT NULL DEFAULT 'normal',
                "description" character varying,
                "driver_id" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_orders_id" PRIMARY KEY ("id")
            )
        `);

        // Create clients table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tms"."clients" (
                "client_id" SERIAL NOT NULL,
                "client_name" character varying NOT NULL,
                "phone_number" character varying,
                "email" character varying,
                "address" character varying,
                "status" character varying NOT NULL DEFAULT 'ACTIVE',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_clients_client_id" PRIMARY KEY ("client_id")
            )
        `);

        // Create assets table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tms"."assets" (
                "asset_id" SERIAL NOT NULL,
                "asset_name" character varying NOT NULL,
                "asset_type" character varying,
                "license_plate" character varying,
                "branch_id" integer,
                "status" character varying NOT NULL DEFAULT 'ACTIVE',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_assets_asset_id" PRIMARY KEY ("asset_id")
            )
        `);

        // Create waypoints table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tms"."waypoints" (
                "waypoint_id" SERIAL NOT NULL,
                "waypoint_name" character varying NOT NULL,
                "address" character varying,
                "type" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_waypoints_waypoint_id" PRIMARY KEY ("waypoint_id")
            )
        `);

        // Create settlements table
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "tms"."settlements" (
                "settlement_id" SERIAL NOT NULL,
                "client_id" integer,
                "amount" numeric(10,2),
                "status" character varying NOT NULL DEFAULT 'PENDING',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_settlements_settlement_id" PRIMARY KEY ("settlement_id")
            )
        `);

        // Create indexes
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_drivers_status" ON "drivers" ("status")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_orders_driver" ON "orders" ("driver_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "orders" ("status")`);

        // Create foreign key constraints (only if they don't exist)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_a2cecd1a3531c0b041e29ba46e1') THEN
                    ALTER TABLE "tms"."users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "tms"."roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END $$;
        `);
        
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_users_branch_id') THEN
                    ALTER TABLE "tms"."users" ADD CONSTRAINT "FK_users_branch_id" FOREIGN KEY ("branch_id") REFERENCES "tms"."branches"("branch_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END $$;
        `);
        
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_222cd7bf166a2d7a6aad9cdebee') THEN
                    ALTER TABLE "orders" ADD CONSTRAINT "FK_222cd7bf166a2d7a6aad9cdebee" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END $$;
        `);
        
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_assets_branch_id') THEN
                    ALTER TABLE "tms"."assets" ADD CONSTRAINT "FK_assets_branch_id" FOREIGN KEY ("branch_id") REFERENCES "tms"."branches"("branch_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END $$;
        `);
        
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_settlements_client_id') THEN
                    ALTER TABLE "tms"."settlements" ADD CONSTRAINT "FK_settlements_client_id" FOREIGN KEY ("client_id") REFERENCES "tms"."clients"("client_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "tms"."settlements" DROP CONSTRAINT "FK_settlements_client_id"`);
        await queryRunner.query(`ALTER TABLE "tms"."assets" DROP CONSTRAINT "FK_assets_branch_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_222cd7bf166a2d7a6aad9cdebee"`);
        await queryRunner.query(`ALTER TABLE "tms"."users" DROP CONSTRAINT "FK_users_branch_id"`);
        await queryRunner.query(`ALTER TABLE "tms"."users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);

        // Drop indexes
        await queryRunner.query(`DROP INDEX "public"."idx_orders_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_orders_driver"`);
        await queryRunner.query(`DROP INDEX "public"."idx_drivers_status"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "tms"."settlements"`);
        await queryRunner.query(`DROP TABLE "tms"."waypoints"`);
        await queryRunner.query(`DROP TABLE "tms"."assets"`);
        await queryRunner.query(`DROP TABLE "tms"."clients"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "drivers"`);
        await queryRunner.query(`DROP TABLE "tms"."users"`);
        await queryRunner.query(`DROP TABLE "tms"."branches"`);
        await queryRunner.query(`DROP TABLE "tms"."roles"`);

        // Drop schema
        await queryRunner.query(`DROP SCHEMA IF EXISTS "tms"`);
    }
}
