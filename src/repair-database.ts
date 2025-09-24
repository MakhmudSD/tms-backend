import { Client } from 'pg';

/**
 * Database Repair Script
 * Fixes schema issues and ensures data integrity
 */
async function repairDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Mahmud2001',
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log('🔧 Connected to PostgreSQL database');

    // 1. Ensure TMS schema exists
    await client.query('CREATE SCHEMA IF NOT EXISTS "tms"');
    console.log('✅ TMS schema verified');

    // 2. Fix users table structure
    await client.query(`
      -- Drop and recreate users table with proper structure
      DROP TABLE IF EXISTS "tms"."users" CASCADE;
      
      CREATE TABLE "tms"."users" (
        "user_id" SERIAL PRIMARY KEY,
        "login_id" VARCHAR(50) NOT NULL UNIQUE,
        "password_hash" VARCHAR(255) NOT NULL,
        "user_name" VARCHAR(100) NOT NULL,
        "branch_id" INTEGER,
        "role_id" INTEGER,
        "email" VARCHAR(100),
        "phone_number" VARCHAR(20),
        "status_code" VARCHAR(20) DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table recreated');

    // 3. Fix roles table structure
    await client.query(`
      DROP TABLE IF EXISTS "tms"."roles" CASCADE;
      
      CREATE TABLE "tms"."roles" (
        "role_id" SERIAL PRIMARY KEY,
        "role_name" VARCHAR(50) NOT NULL UNIQUE,
        "description" TEXT
      );
    `);
    console.log('✅ Roles table recreated');

    // 4. Create drivers table in public schema (as per original design)
    await client.query(`
      DROP TABLE IF EXISTS "public"."drivers" CASCADE;
      
      CREATE TABLE "public"."drivers" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "phone" VARCHAR(20) NOT NULL,
        "vehicle" VARCHAR(100) NOT NULL,
        "license_number" VARCHAR(50),
        "status" VARCHAR(20) DEFAULT 'available',
        "email" VARCHAR(100),
        "address" TEXT,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Drivers table created');

    // 5. Create orders table in public schema
    await client.query(`
      DROP TABLE IF EXISTS "public"."orders" CASCADE;
      
      CREATE TABLE "public"."orders" (
        "id" SERIAL PRIMARY KEY,
        "customer_name" VARCHAR(100) NOT NULL,
        "customer_phone" VARCHAR(20) NOT NULL,
        "pickup_location" TEXT NOT NULL,
        "dropoff_location" TEXT NOT NULL,
        "status" VARCHAR(20) DEFAULT 'pending',
        "priority" VARCHAR(20) DEFAULT 'normal',
        "description" TEXT,
        "estimated_fare" DECIMAL(10,2),
        "actual_fare" DECIMAL(10,2),
        "scheduled_pickup_time" TIMESTAMP,
        "actual_pickup_time" TIMESTAMP,
        "actual_dropoff_time" TIMESTAMP,
        "driver_id" INTEGER,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE SET NULL
      );
    `);
    console.log('✅ Orders table created');

    // 6. Insert sample data
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Insert roles
    await client.query(`
      INSERT INTO "tms"."roles" ("role_name", "description") VALUES 
      ('admin', 'System Administrator'),
      ('manager', 'Operations Manager'),
      ('dispatcher', 'Order Dispatcher')
      ON CONFLICT ("role_name") DO NOTHING;
    `);

    // Insert users
    await client.query(`
      INSERT INTO "tms"."users" ("login_id", "password_hash", "user_name", "email", "status_code", "role_id") VALUES 
      ('admin', $1, 'System Administrator', 'admin@tms.com', 'ACTIVE', 1),
      ('manager', $1, 'John Manager', 'manager@tms.com', 'ACTIVE', 2),
      ('dispatcher', $1, 'Jane Dispatcher', 'dispatcher@tms.com', 'ACTIVE', 3)
      ON CONFLICT ("login_id") DO NOTHING;
    `, [hashedPassword]);

    // Insert sample drivers
    await client.query(`
      INSERT INTO "public"."drivers" ("name", "phone", "vehicle", "license_number", "status", "email", "address") VALUES 
      ('Mike Johnson', '+1234567890', 'Toyota Camry - ABC123', 'DL123456789', 'available', 'mike@tms.com', '123 Main St, City, State'),
      ('Sarah Wilson', '+1234567891', 'Honda Accord - DEF456', 'DL987654321', 'available', 'sarah@tms.com', '456 Oak Ave, City, State'),
      ('David Brown', '+1234567892', 'Ford Focus - GHI789', 'DL456789123', 'available', 'david@tms.com', '789 Pine St, City, State'),
      ('Lisa Davis', '+1234567893', 'Nissan Altima - JKL012', 'DL789123456', 'busy', 'lisa@tms.com', '321 Elm St, City, State')
      ON CONFLICT DO NOTHING;
    `);

    // Insert sample orders
    await client.query(`
      INSERT INTO "public"."orders" ("customer_name", "customer_phone", "pickup_location", "dropoff_location", "status", "priority", "description", "estimated_fare", "driver_id") VALUES 
      ('Alice Smith', '+1987654321', '123 Downtown St, City, State', '456 Airport Blvd, City, State', 'pending', 'normal', 'Airport transfer', 25.50, NULL),
      ('Bob Johnson', '+1987654322', '789 Hotel Plaza, City, State', '321 Convention Center, City, State', 'assigned', 'high', 'Business meeting transport', 18.75, 4),
      ('Carol White', '+1987654323', '654 Residential Ave, City, State', '987 Shopping Mall, City, State', 'completed', 'normal', 'Shopping trip', 12.00, 1),
      ('Daniel Green', '+1987654324', '147 Business District, City, State', '258 Train Station, City, State', 'in_progress', 'urgent', 'Train station transfer', 22.00, 2)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Sample data inserted');

    // 7. Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS "idx_users_login_id" ON "tms"."users" ("login_id");
      CREATE INDEX IF NOT EXISTS "idx_users_status" ON "tms"."users" ("status_code");
      CREATE INDEX IF NOT EXISTS "idx_drivers_status" ON "public"."drivers" ("status");
      CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "public"."orders" ("status");
      CREATE INDEX IF NOT EXISTS "idx_orders_driver" ON "public"."orders" ("driver_id");
    `);
    console.log('✅ Performance indexes created');

    // 8. Verify data integrity
    const userCount = await client.query('SELECT COUNT(*) FROM "tms"."users"');
    const roleCount = await client.query('SELECT COUNT(*) FROM "tms"."roles"');
    const driverCount = await client.query('SELECT COUNT(*) FROM "public"."drivers"');
    const orderCount = await client.query('SELECT COUNT(*) FROM "public"."orders"');

    console.log('\n🎉 Database repair completed successfully!');
    console.log(`📊 Users: ${userCount.rows[0].count}`);
    console.log(`📊 Roles: ${roleCount.rows[0].count}`);
    console.log(`📊 Drivers: ${driverCount.rows[0].count}`);
    console.log(`📊 Orders: ${orderCount.rows[0].count}`);

    console.log('\n🔐 Login Credentials:');
    console.log('Username: admin, Password: password123 (Admin)');
    console.log('Username: manager, Password: password123 (Manager)');
    console.log('Username: dispatcher, Password: password123 (Dispatcher)');

  } catch (error) {
    console.error('❌ Database repair failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

repairDatabase();
